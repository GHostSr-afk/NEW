@echo off
echo ========================================
echo SmartCloset Deployment Helper
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - SmartCloset app with AI features"
    echo.
    echo Git repository initialized!
    echo.
    echo Next steps:
    echo 1. Create a GitHub repository at https://github.com/new
    echo 2. Run: git remote add origin YOUR_GITHUB_REPO_URL
    echo 3. Run: git push -u origin main
    echo 4. Go to https://vercel.com and import your GitHub repo
    echo.
) else (
    echo Git repository already exists.
    echo.
    echo Checking for changes...
    git status
    echo.
    
    set /p commit="Do you want to commit and push changes? (y/n): "
    if /i "%commit%"=="y" (
        set /p message="Enter commit message: "
        git add .
        git commit -m "%message%"
        git push
        echo.
        echo Changes pushed! Vercel will auto-deploy if connected.
    )
)

echo.
echo ========================================
echo Deployment Guide:
echo ========================================
echo 1. Push code to GitHub (done above)
echo 2. Go to: https://vercel.com
echo 3. Click 'Add New' -^> 'Project'
echo 4. Import your GitHub repository
echo 5. Configure:
echo    - Framework: Other
echo    - Build Command: npm run build:vercel
echo    - Output Directory: client/build
echo 6. Add Environment Variables:
echo    - JWT_SECRET = your-secret-key
echo    - NODE_ENV = production
echo 7. Click 'Deploy'
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
echo ========================================
pause
