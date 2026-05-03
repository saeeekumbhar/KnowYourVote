# KnowYourVote Deployment Script
# 🚀 One-click deploy to Google Cloud Run

$ProjectID = "knowyourvote-495114"
$ServiceName = "knowyourvote"
$Region = "us-central1"

Write-Host "--- 🗳️ KnowYourVote Deployment Started ---" -ForegroundColor Cyan

# 1. Authenticate
Write-Host "[1/3] Authenticating with Google Cloud..." -ForegroundColor Yellow
gcloud auth login
gcloud config set project $ProjectID

# 2. Build & Submit to Artifact Registry (Google Cloud Build)
Write-Host "[2/3] Building and submitting container to Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --tag gcr.io/$ProjectID/$ServiceName

# 3. Deploy to Cloud Run
Write-Host "[3/3] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image gcr.io/$ProjectID/$ServiceName `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --port 8080

Write-Host "--- 🎉 Deployment Complete! ---" -ForegroundColor Green
Write-Host "Your website is live!" -ForegroundColor Green
