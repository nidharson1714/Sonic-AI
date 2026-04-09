@echo off
echo ========================================
echo   Sonic-AI GitHub Push Tool
echo ========================================

REM Configure credentials
git config user.email "as14112004@gmail.com"
git config user.name "nidharson1714"

REM Initialize repository
echo Initializing Git repository...
git init

REM Connect to GitHub
echo Connecting to remote: https://github.com/nidharson1714/Sonic-AI.git
git remote add origin https://github.com/nidharson1714/Sonic-AI.git

REM Stage and commit
echo Staging and committing files...
git add .
git commit -m "initial commit: Sonic-AI project structure"

REM Push
echo Pushing to GitHub (main branch)...
echo NOTE: If the push fails, it might be due to a login window. Please complete the login.
git branch -M main
REM Using --force because we added a README via the browser which needs to be synced
git push -u origin main --force

echo.
echo ========================================
echo   DONE! If it still fails, please copy 
echo   the error message and tell me.
echo ========================================
pause
