# GeoDa Version Update Automation

This repository includes a GitHub Action that automatically updates version information across all download files when a new GeoDa version is released.

## How It Works

The GitHub Action is triggered when a new tag is pushed to the repository with the format `vX.Y.Z.W` (e.g., `v1.22.0.20`).

## What Gets Updated

When a new version tag is pushed, the action automatically updates the following files:

### Main Files (src/data/)
- `downloadContent.json` - Updates version description and adds new release entry
- `downloadLinux.json` - Updates current version and moves previous to history
- `downloadMac.json` - Updates current version and moves previous to history  
- `downloadWindows.json` - Updates current version and moves previous to history
- `downloadNightly.json` - Adds new release entry

### Language-Specific Files (src/data/{de,es,zh-Hans}/)
- Same updates applied to all language variants

## Specific Changes Made

### downloadContent.json
- Updates description text: "GeoDa X.Y.Z.W with new features"
- Prepends new release entry: `{"date": "M/D/YYYY", "version": "X.Y.Z.W"}`

### Platform Download Files (Linux/Mac/Windows)
- Copies current version content to beginning of `previousVersions` array
- Updates `currentVersion.version` to new version
- Updates all download links to use new version number
- Updates all date references to current date

### downloadNightly.json
- Prepends new release entry with date, version, and release notes link

## How to Use

1. **Create a new release tag** in the GeoDa repository:
   ```bash
   git tag v1.22.0.20
   git push origin v1.22.0.20
   ```

2. **The action will automatically run** and:
   - Extract version number from tag (1.22.0.20)
   - Generate current date
   - Update all relevant JSON files
   - Create a pull request with all changes

3. **Review and merge the PR** that gets created automatically

## Example

For version `1.22.0.20` released on `7/31/2025`:

**Before:**
```json
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
```

**After:**
```json
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

## Requirements

- The action requires `jq` for JSON manipulation (included in Ubuntu runner)
- The action requires write permissions to create pull requests
- Tags must follow the format `vX.Y.Z.W` where X, Y, Z, W are numbers

## Troubleshooting

If the action fails:
1. Check that the tag format is correct (`v1.22.0.20`, not `1.22.0.20`)
2. Ensure the repository has the required permissions
3. Check the action logs for specific error messages

## Local Testing and Manual Updates

You can test and run the version update process locally using the provided scripts:

### Easy-to-use wrapper script:
```bash
# Show help
./update-version.sh --help

# Dry run (simulate changes without making them)
./update-version.sh --dry-run 1.22.0.20 7/31/2025

# Run actual update
./update-version.sh 1.22.0.20 7/31/2025

# Run with custom date
./update-version.sh 1.22.0.20 7/31/2025
```

### Direct script usage:
```bash
# Run simulation
node scripts/test-version-update.js 1.22.0.20 7/31/2025

# Run actual update
node scripts/update-version.js 1.22.0.20 7/31/2025

# Validate files (after updates)
node scripts/validate-json.js 1.22.0.20
```

### Features of Local Scripts

- **Automatic backups**: Creates timestamped backups before making changes
- **Validation**: Checks version format and validates JSON after updates
- **Error handling**: Provides clear error messages and rollback instructions
- **Dry run mode**: Test changes without modifying files
- **Multi-language support**: Updates all language variants automatically

## Manual Override

If you need to manually trigger the action or fix issues:
1. Go to the Actions tab in GitHub
2. Select "Update Version Information" workflow
3. Click "Run workflow"
4. Enter the version number manually 