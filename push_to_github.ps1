# Sonic-AI Push Script

# Configure credentials
git config user.email "as14112004@gmail.com"
git config user.name "nidharson1714"

# Initialize repository
Write-Host "Initializing Git repository..."
git init

# Connect to GitHub
Write-Host "Connecting to remote: https://github.com/nidharson1714/Sonic-AI.git"
git remote add origin https://github.com/nidharson1714/Sonic-AI.git 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin https://github.com/nidharson1714/Sonic-AI.git
}

# Stage and commit
Write-Host "Staging files..."
git add .
Write-Host "Committing changes..."
git commit -m "initial commit: Sonic-AI project structure"

# Push
Write-Host "Pushing to GitHub (main branch)..."
git branch -M main
git push -u origin main

Write-Host "Done! If you see a login prompt, please follow the instructions to authenticate."
pause
