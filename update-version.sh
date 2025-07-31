#!/bin/bash

# GeoDa Version Update Script Wrapper
# Makes it easy to run the version update process locally

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "GeoDa Version Update Script"
    echo ""
    echo "Usage:"
    echo "  ./update-version.sh <version> [date]"
    echo "  ./update-version.sh --help"
    echo ""
    echo "Examples:"
    echo "  ./update-version.sh 1.22.0.20"
    echo "  ./update-version.sh 1.22.0.20 7/31/2025"
    echo ""
    echo "Options:"
    echo "  --help     Show this help message"
    echo "  --dry-run  Show what would be changed without making changes"
    echo ""
    echo "The script will:"
    echo "  1. Create backups of all files"
    echo "  2. Update version information in all JSON files"
    echo "  3. Apply changes to all language variants"
    echo "  4. Validate the changes"
    echo "  5. Show a summary of what was updated"
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if the update script exists
    if [ ! -f "scripts/update-version.js" ]; then
        print_error "scripts/update-version.js not found. Please run this script from the repository root."
        exit 1
    fi
    
    # Check if validation script exists
    if [ ! -f "scripts/validate-json.js" ]; then
        print_error "scripts/validate-json.js not found. Please run this script from the repository root."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to validate version format
validate_version() {
    local version=$1
    
    # Check if version matches pattern X.Y.Z.W
    if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_error "Invalid version format. Expected format: X.Y.Z.W (e.g., 1.22.0.20)"
        exit 1
    fi
    
    print_success "Version format is valid: $version"
}

# Function to validate date format
validate_date() {
    local date=$1
    
    # Check if date matches pattern M/D/YYYY
    if [[ ! $date =~ ^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$ ]]; then
        print_error "Invalid date format. Expected format: M/D/YYYY (e.g., 7/31/2025)"
        exit 1
    fi
    
    print_success "Date format is valid: $date"
}

# Function to run dry run
run_dry_run() {
    local version=$1
    local date=$2
    
    print_info "Running dry run simulation..."
    node scripts/test-version-update.js "$version" "$date"
}

# Function to run actual update
run_update() {
    local version=$1
    local date=$2
    
    print_info "Running actual version update..."
    node scripts/update-version.js "$version" "$date"
    
    print_info "Validating changes..."
    node scripts/validate-json.js "$version"
}

# Main script logic
main() {
    local version=""
    local date=""
    local dry_run=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help)
                show_usage
                exit 0
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            -*)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
            *)
                if [ -z "$version" ]; then
                    version=$1
                elif [ -z "$date" ]; then
                    date=$1
                else
                    print_error "Too many arguments"
                    show_usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Check if version is provided
    if [ -z "$version" ]; then
        print_error "Version is required"
        show_usage
        exit 1
    fi
    
    # Generate date if not provided
    if [ -z "$date" ]; then
        date=$(date +'%-m/%-d/%Y')
        print_info "Using current date: $date"
    fi
    
    # Validate inputs
    validate_version "$version"
    validate_date "$date"
    
    # Check prerequisites
    check_prerequisites
    
    # Run the appropriate action
    if [ "$dry_run" = true ]; then
        run_dry_run "$version" "$date"
    else
        run_update "$version" "$date"
    fi
    
    print_success "Version update process completed!"
}

# Run main function with all arguments
main "$@" 