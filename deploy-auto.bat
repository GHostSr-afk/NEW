@echo off
echo ========================================
echo SmartCloset - Auto Deploy to Vercel
echo ========================================
echo.
echo This will deploy your app to Vercel!
echo.
echo STEP 1: You will be asked to login
echo         - A browser will open
echo         - Login with your GitHub account
echo         - Return here after login
echo.
echo STEP 2: Answer these questions:
echo         - Set up and deploy? Y
echo         - Which scope? [Select your account]
echo         - Link to existing project? N
echo         - Project name? smartcloset (or press Enter)
echo         - Directory? ./ (press Enter)
echo         - Override settings? N
echo.
pause
echo.
echo Starting deployment...
echo.
cd C:\Users\Maann\Desktop\NEW
vercel --prod
echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your app is now live!
echo Copy the URL shown above and test it.
echo.
pause
