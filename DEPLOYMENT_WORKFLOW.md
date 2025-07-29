# Dev to Production Deployment Workflow

## Overview
This document outlines the workflow for deploying changes from the development site (`preview.adultstherapy.com`) to the production site (`adultstherapy.com`).

## Repository Structure
- **Dev Repository**: `/Users/seandinwiddie/GitHub/preview.adultstherapy.com`
  - Remote origin: `https://github.com/seandinwiddie/preview.adultstherapy.com.git`
  - Remote upstream: `https://github.com/AdultsTherapy/adultstherapy.com.git`
- **Production Repository**: `/Users/seandinwiddie/Documents/GitHub/adultstherapy.com`
  - Remote origin: `https://github.com/AdultsTherapy/adultstherapy.com.git`

## Automated Deployment (Recommended)

### Quick Deployment
```bash
cd /Users/seandinwiddie/GitHub/preview.adultstherapy.com
./deploy-to-production.sh
```

The script will:
1. Create a backup of production
2. Check for uncommitted changes
3. Pull latest dev changes
4. Show what will be deployed
5. Sync files from dev to production
6. Commit and optionally push changes

## Manual Deployment Steps

### 1. Pre-deployment Checks
```bash
# Check dev repository status
cd /Users/seandinwiddie/GitHub/preview.adultstherapy.com
git status
git log --oneline -5

# Check production repository status  
cd /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
git status
```

### 2. Backup Production
```bash
cp -r /Users/seandinwiddie/Documents/GitHub/adultstherapy.com /tmp/adultstherapy-backup-$(date +%Y%m%d-%H%M%S)
```

### 3. Sync Changes
```bash
# Option A: Using rsync (recommended)
rsync -av --exclude='.git' --exclude='.DS_Store' --delete \
  /Users/seandinwiddie/GitHub/preview.adultstherapy.com/ \
  /Users/seandinwiddie/Documents/GitHub/adultstherapy.com/

# Option B: Manual file copy (if you want to be selective)
# Copy specific files/directories as needed
```

### 4. Commit Changes
```bash
cd /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
git add .
git commit -m "Deploy from dev: [describe changes]"
git push origin main
```

## Best Practices

### Before Deployment
- [ ] Ensure all dev changes are committed and pushed
- [ ] Test thoroughly on the dev site
- [ ] Review the TODO.md for any incomplete tasks
- [ ] Check that all images and assets are working correctly

### During Deployment
- [ ] Create a backup before making changes
- [ ] Review what files will be changed
- [ ] Use descriptive commit messages
- [ ] Test the production site after deployment

### After Deployment
- [ ] Verify the production site is working correctly
- [ ] Monitor for any broken links or missing assets
- [ ] Update any documentation as needed
- [ ] Clean up old backups when satisfied

## Git Strategy Recommendations

### Current Setup Analysis
- Dev and production are separate repositories
- Dev has both origin (your fork) and upstream (main production) remotes
- Production points directly to the main repository

### Recommended Git Flow
1. **Development**: Work in the dev repository
2. **Testing**: Test changes on preview.adultstherapy.com
3. **Deployment**: Use the automated script or manual sync
4. **Production**: Deploy to adultstherapy.com

## Troubleshooting

### Common Issues
1. **Merge Conflicts**: If production has diverged from dev
   ```bash
   # Reset production to match dev exactly
   cd /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
   git reset --hard HEAD
   # Then run deployment script
   ```

2. **Missing Files**: If rsync doesn't copy everything
   ```bash
   # Use -v flag to see what's being copied
   rsync -av --exclude='.git' --exclude='.DS_Store' --delete --dry-run \
     /Users/seandinwiddie/GitHub/preview.adultstherapy.com/ \
     /Users/seandinwiddie/Documents/GitHub/adultstherapy.com/
   ```

3. **Permission Issues**: If files can't be copied
   ```bash
   # Fix permissions
   chmod -R 755 /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
   ```

### Rollback Procedure
If something goes wrong:
```bash
# Restore from backup
rm -rf /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
cp -r /tmp/adultstherapy-backup-[timestamp] /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
cd /Users/seandinwiddie/Documents/GitHub/adultstherapy.com
git reset --hard HEAD~1  # If the bad commit was already pushed
```

## Automation Opportunities

### Future Enhancements
1. **GitHub Actions**: Set up automated deployment when dev is pushed
2. **Pre-deployment Testing**: Automated link checking and validation
3. **Staging Environment**: Additional testing layer between dev and production
4. **Monitoring**: Automated checks after deployment

### Example GitHub Action (for future implementation)
```yaml
name: Deploy to Production
on:
  workflow_dispatch:  # Manual trigger
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Sync files to production repository
          # Commit and push changes
```

## Contact and Support
- For questions about this workflow, contact the development team
- For urgent production issues, follow the rollback procedure
- Keep this documentation updated as the workflow evolves