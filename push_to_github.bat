@echo off
echo ========================================
echo Pushing Mobile Responsiveness Changes
echo ========================================
echo.
echo Repository: LedgerLearn/lessonLedger
echo Branch: master
echo Commit: feat: implement comprehensive mobile responsiveness
echo.
echo This will open a credential window if needed...
echo.
git push origin master
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo SUCCESS! Push completed successfully!
    echo ========================================
    echo.
    echo Verifying push status...
    git status
) else (
    echo ========================================
    echo Push failed or requires authentication
    echo ========================================
    echo Please check for credential popup window
)
echo.
pause
