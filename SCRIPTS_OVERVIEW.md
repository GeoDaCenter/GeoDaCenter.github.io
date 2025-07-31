# GeoDa Version Update Scripts Overview

This document provides an overview of all the scripts and tools available for automating GeoDa version updates.

## 📁 Script Files

### 1. GitHub Action Workflow
- **`.github/workflows/update-version.yml`** - Automated workflow triggered by git tags

### 2. Local Scripts
- **`update-version.sh`** - Easy-to-use wrapper script with colored output
- **`scripts/update-version.js`** - Main Node.js script for version updates
- **`scripts/test-version-update.js`** - Simulation script for testing
- **`scripts/validate-json.js`** - JSON validation script

### 3. Documentation
- **`VERSION_UPDATE_README.md`** - User guide
- **`VERSION_UPDATE_SOLUTION.md`** - Technical solution document
- **`SCRIPTS_OVERVIEW.md`** - This overview document

## 🚀 Quick Start

### For Automated Updates (Recommended)
```bash
# Create and push a tag
git tag v1.22.0.20
git push origin v1.22.0.20

# GitHub Action will automatically run and create a PR
```

### For Local Testing and Manual Updates
```bash
# Test what would be changed
./update-version.sh --dry-run 1.22.0.20 7/31/2025

# Run actual update
./update-version.sh 1.22.0.20 7/31/2025
```

## 📋 Script Details

### `update-version.sh` (Wrapper Script)
**Purpose**: User-friendly interface for running version updates locally

**Features**:
- ✅ Input validation (version format, date format)
- ✅ Prerequisites checking (Node.js, script files)
- ✅ Colored output for better readability
- ✅ Dry run mode for testing
- ✅ Help documentation
- ✅ Error handling and rollback instructions

**Usage**:
```bash
./update-version.sh --help                    # Show help
./update-version.sh --dry-run 1.22.0.20      # Test changes
./update-version.sh 1.22.0.20                # Run update
./update-version.sh 1.22.0.20 7/31/2025      # Run with custom date
```

### `scripts/update-version.js` (Main Script)
**Purpose**: Core logic for updating version information in JSON files

**Features**:
- ✅ Automatic backup creation
- ✅ Updates all file types (downloadContent, platform files, nightly)
- ✅ Multi-language support (de, es, zh-Hans)
- ✅ JSON validation
- ✅ Error handling with rollback instructions
- ✅ Progress reporting

**Usage**:
```bash
node scripts/update-version.js 1.22.0.20
node scripts/update-version.js 1.22.0.20 7/31/2025
```

### `scripts/test-version-update.js` (Simulation Script)
**Purpose**: Test the update logic without modifying files

**Features**:
- ✅ Simulates all update operations
- ✅ Shows before/after examples
- ✅ Validates logic correctness
- ✅ No file modifications

**Usage**:
```bash
node scripts/test-version-update.js 1.22.0.20 7/31/2025
```

### `scripts/validate-json.js` (Validation Script)
**Purpose**: Validate JSON files after updates

**Features**:
- ✅ Checks JSON syntax
- ✅ Validates version presence in expected locations
- ✅ Checks file structure
- ✅ Reports missing files gracefully

**Usage**:
```bash
node scripts/validate-json.js 1.22.0.20
```

## 🔄 Workflow Comparison

### GitHub Action Workflow
- **Trigger**: Git tag push
- **Environment**: GitHub Actions runner
- **Implementation**: Uses the local `update-version.sh` script
- **Output**: Pull request with changes
- **Use case**: Production releases

### Local Scripts
- **Trigger**: Manual execution
- **Environment**: Local machine
- **Output**: Direct file changes + backup
- **Use case**: Testing, development, manual updates

## 🛠️ Prerequisites

### For GitHub Action
- Repository with GitHub Actions enabled
- Write permissions for creating pull requests
- Git tags in format `vX.Y.Z.W`

### For Local Scripts
- Node.js installed
- Bash shell (for wrapper script)
- Repository cloned locally

## 📊 File Update Matrix

| File Type | GitHub Action | Local Scripts | Description |
|-----------|---------------|---------------|-------------|
| `downloadContent.json` | ✅ | ✅ | Updates description + adds release entry |
| `downloadLinux.json` | ✅ | ✅ | Updates current version + moves to history |
| `downloadMac.json` | ✅ | ✅ | Updates current version + moves to history |
| `downloadWindows.json` | ✅ | ✅ | Updates current version + moves to history |
| `downloadNightly.json` | ✅ | ✅ | Adds new release entry |
| Language variants (de/es/zh-Hans) | ✅ | ✅ | Same updates for all languages |

## 🔧 Error Handling

### GitHub Action
- Fails fast on errors
- Provides detailed logs
- No automatic rollback (manual intervention required)

### Local Scripts
- Creates automatic backups
- Provides rollback instructions
- Continues processing other files on individual failures
- Shows detailed error messages

## 🧪 Testing Strategy

### Before Production
1. **Dry run**: `./update-version.sh --dry-run 1.22.0.20`
2. **Simulation**: `node scripts/test-version-update.js 1.22.0.20`
3. **Local update**: `./update-version.sh 1.22.0.20`
4. **Validation**: `node scripts/validate-json.js 1.22.0.20`
5. **Review changes**: Check modified files
6. **Test website**: Ensure everything works

### Production Release
1. **Create tag**: `git tag v1.22.0.20`
2. **Push tag**: `git push origin v1.22.0.20`
3. **Monitor action**: Check GitHub Actions tab
4. **Review PR**: Examine generated pull request
5. **Merge PR**: Approve and merge changes

## 📈 Benefits

### Automation Benefits
- **Time saving**: Reduces manual work from hours to minutes
- **Accuracy**: Eliminates human errors in version numbers
- **Consistency**: Ensures uniform updates across all files
- **Audit trail**: Creates pull requests for review

### Local Script Benefits
- **Testing**: Verify changes before production
- **Development**: Test new features locally
- **Manual updates**: Handle special cases
- **Backup safety**: Automatic backups with rollback

## 🚨 Troubleshooting

### Common Issues
1. **Invalid version format**: Use `X.Y.Z.W` format (e.g., `1.22.0.20`)
2. **Missing Node.js**: Install Node.js for local scripts
3. **Permission errors**: Ensure write permissions for local files
4. **GitHub token issues**: Check repository permissions for actions

### Recovery
- **Local scripts**: Use backup directory to restore files
- **GitHub Action**: Manually revert changes or re-run action
- **Validation errors**: Check JSON syntax and file structure

## 🔮 Future Enhancements

Potential improvements for the scripts:
- Support for different version formats
- Custom date formats
- Additional file types
- Email notifications
- Integration with release notes generation
- Web interface for non-technical users 