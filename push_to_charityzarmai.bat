@echo off
echo ========================================
echo Pushing to charityzarmai GitHub
echo ========================================
echo.
echo Repository: charityzarmai/lessonLedger
echo Branch: master
echo Commit: Mobile Responsiveness Implementation
echo.
echo This will open a credential window if needed...
echo.
git push charityzarmai master
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo SUCCESS! Pushed to charityzarmai!
    echo ========================================
    echo.
    git remote -v
) else (
    echo ========================================
    echo Push failed or requires authentication
    echo ========================================
    echo.
    echo If the repository doesn't exist, please:
    echo 1. Go to https://github.com/charityzarmai
    echo 2. Create a new repository named 'lessonLedger'
    echo 3. Run this script again
)
echo.
pause
