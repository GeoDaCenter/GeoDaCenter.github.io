# GeoDa Version Update Automation - Complete Solution

## Overview

This solution provides a complete GitHub Actions workflow that automatically updates version information across all download files when a new GeoDa version is released. The workflow is triggered by creating a new tag and creates a pull request with all the necessary changes.

## Files Created

### 1. GitHub Action Workflow
- **`.github/workflows/update-version.yml`** - Main workflow that uses the local script for version updates

### 2. Documentation
- **`VERSION_UPDATE_README.md`** - User guide for using the automation
- **`VERSION_UPDATE_SOLUTION.md`** - This comprehensive solution document

### 3. Validation and Testing Scripts
- **`scripts/validate-json.js`** - Validates JSON files after updates
- **`scripts/test-version-update.js`** - Simulates the update process for testing

## How It Works

### Trigger
The workflow is triggered when a new tag is pushed with the format `vX.Y.Z` or `vX.Y.Z.W` (e.g., `v1.22.1` or `v1.22.0.20`).

### Process
1. **Extract version and date**: Parses the tag and generates current date
2. **Fetch release assets**: The script fetches the actual release assets from the GeoDa GitHub repo (the release must exist before the tag is pushed here)
3. **Run local script**: Executes the `update-version.sh` script with version and date
4. **Update files**: Script modifies all relevant JSON files, building download links from the real asset names (no guessed URLs)
5. **Validate changes**: Ensures all files are properly formatted
6. **Create PR**: Automatically creates a pull request with all changes

### Files Updated

#### Main Files (`src/data/`)
- `downloadContent.json` - Updates description and adds release entry
- `downloadLinux.json` - Updates current version, moves previous to history
- `downloadMac.json` - Updates current version, moves previous to history
- `downloadWindows.json` - Updates current version, moves previous to history
- `downloadNightly.json` - Adds new release entry
- `announcements.json` - Moves current announcement to history and adds the new one
- `indexContent.json` - Updates the homepage "NEW RELEASE" banner

#### Language-Specific Files (`src/data/{de,es,zh-Hans}/`)
- Same updates applied to all language variants

## Specific Changes Made

### downloadContent.json
```json
// Before
{
  "donation": {
    "description": "GeoDa is continuously updated. The most current version is GeoDa 1.22.0.18 with new features."
  },
  "releaseList": {
    "releases": [
      { "date": "7/25/2025", "version": "1.22.0.18" }
    ]
  }
}

// After
{
  "donation": {
    "description": "GeoDa is continuously updated. The most current version is GeoDa 1.22.0.20 with new features."
  },
  "releaseList": {
    "releases": [
      { "date": "7/31/2025", "version": "1.22.0.20" },
      { "date": "7/25/2025", "version": "1.22.0.18" }
    ]
  }
}
```

### Platform Download Files (Linux/Mac/Windows)

The download links are rebuilt from the **actual release assets** fetched from the GeoDa GitHub repo, so they always point at real files (e.g. `GeoDa-1.22.1-x86_64.AppImage`, `GeoDa1.22.1-arm64-Installer.dmg`, `GeoDa_1.22.1_win7+x64_Setup.exe`).

```json
// Before
{
  "currentVersion": {
    "version": "GeoDa 1.22.0.18",
    "downloads": [
      {
        "text": "GeoDa 1.22.0.18 (7/25/2025) for 64-bit Ubuntu Noble 24.04",
        "href": "https://github.com/GeoDaCenter/geoda/releases/download/v1.22.0.18/GeoDa-1.22.0-noble.zip"
      }
    ]
  },
  "previousVersions": []
}

// After
{
  "currentVersion": {
    "version": "GeoDa 1.22.0.20",
    "downloads": [
      {
        "text": "GeoDa 1.22.0.20 (7/31/2025) for 64-bit Ubuntu Noble 24.04",
        "href": "https://github.com/GeoDaCenter/geoda/releases/download/v1.22.0.20/GeoDa-1.22.0-noble.zip"
      }
    ]
  },
  "previousVersions": [
    {
      "version": "GeoDa 1.22.0.18",
      "downloads": [
        {
          "text": "GeoDa 1.22.0.18 (7/25/2025) for 64-bit Ubuntu Noble 24.04",
          "href": "https://github.com/GeoDaCenter/geoda/releases/download/v1.22.0.18/GeoDa-1.22.0-noble.zip"
        }
      ]
    }
  ]
}
```

### downloadNightly.json
```json
// Before
{
  "releases": [
    {
      "date": "7/25/2025",
      "version": "GeoDa 1.22.0.18",
      "releaseNotes": "https://github.com/GeoDaCenter/geoda/releases/tag/v1.22.0.18"
    }
  ]
}

// After
{
  "releases": [
    {
      "date": "7/31/2025",
      "version": "GeoDa 1.22.0.20",
      "releaseNotes": "https://github.com/GeoDaCenter/geoda/releases/tag/v1.22.0.20"
    },
    {
      "date": "7/25/2025",
      "version": "GeoDa 1.22.0.18",
      "releaseNotes": "https://github.com/GeoDaCenter/geoda/releases/tag/v1.22.0.18"
    }
  ]
}
```

## Usage Instructions

### 1. Create a New Release Tag
```bash
git tag v1.22.1
git push origin v1.22.1
```

### 2. Monitor the Action
- Go to the Actions tab in GitHub
- Watch the "Update Version Information" workflow run
- The action will automatically create a pull request

### 3. Review and Merge
- Review the generated pull request
- Ensure all changes look correct
- Merge the pull request

## Testing

### Run Simulation
```bash
node scripts/test-version-update.js 1.22.1 8/26/2026
```

### Validate Files (after updates)
```bash
node scripts/validate-json.js 1.22.1
```

## Technical Details

### Dependencies
- **Node.js 18+**: For the update script and validation (included in Ubuntu runner; requires global `fetch`)
- **Bash**: For the wrapper script (included in Ubuntu runner)
- **GitHub Actions**: For workflow execution
- **Network access**: The script fetches release assets from the GitHub API (`api.github.com`); the workflow passes `GITHUB_TOKEN` to avoid rate limits

### Key Features
- **Automatic version extraction** from git tags
- **Supports `X.Y.Z` and `X.Y.Z.W` version formats**
- **Release asset fetching**: download links are built from the real assets of the GeoDa release, never guessed
- **Date generation** in M/D/YYYY format
- **JSON validation** to ensure file integrity
- **Multi-language support** for de, es, zh-Hans (including localized descriptions)
- **Homepage announcement updates** (announcements.json, indexContent.json)
- **Automatic PR creation** with descriptive commit messages
- **Error handling** and validation

### Error Handling
- Validates JSON structure after updates
- Checks for required fields and formats
- Provides clear error messages
- Fails gracefully if files are missing

## Benefits

1. **Automation**: Eliminates manual file editing
2. **Consistency**: Ensures all files are updated uniformly
3. **Speed**: Reduces release time from hours to minutes
4. **Accuracy**: Prevents human errors in version numbers
5. **Audit Trail**: Creates pull requests for review
6. **Multi-language**: Handles all language variants automatically

## Troubleshooting

### Common Issues
1. **Tag format**: Must be `v1.22.1` or `v1.22.0.20`, not `1.22.1`
2. **Release must exist**: The script fetches assets from the GeoDa repo, so the release must be published before the tag is pushed here
3. **Permissions**: Repository needs write access for PR creation
4. **File structure**: Ensure all expected files exist

### Manual Override
If the action fails, you can:
1. Manually trigger the workflow from GitHub Actions tab
2. Run the validation script locally to check files
3. Use the test script to verify the logic

## Future Enhancements

Potential improvements:
- Custom date formats
- Additional file types
- Email notifications
- Integration with release notes generation

## Conclusion

This solution provides a robust, automated way to handle GeoDa version updates. It reduces manual work, prevents errors, and ensures consistency across all download files and language variants. The workflow is production-ready and includes comprehensive testing and validation. 