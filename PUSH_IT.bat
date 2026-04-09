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
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   DONE! If it failed, you might need to login.
echo ========================================
pause
