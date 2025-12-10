# create_thamai_v4.ps1
param([string]$dest = "D:\ThamAI_PRO_ULTRA_v4_free")

if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

$backend = Join-Path $dest "backend"
$frontend = Join-Path $dest "frontend"

New-Item -ItemType Directory -Path $backend -Force | Out-Null
New-Item -ItemType Directory -Path $frontend -Force | Out-Null

# write backend files
Set-Content -Path (Join-Path $backend "server.cjs") -Value @'
[PASTE THE server.cjs CONTENT EXACTLY HERE]
'@ -Encoding UTF8

Set-Content -Path (Join-Path $backend "package.json") -Value @'
[PASTE THE backend package.json CONTENT HERE]
'@ -Encoding UTF8

Set-Content -Path (Join-Path $backend ".env.example") -Value "OPENAI_API_KEY=" -Encoding UTF8

# write frontend files
Set-Content -Path (Join-Path $frontend "index.html") -Value @'
[PASTE index.html CONTENT HERE]
'@ -Encoding UTF8

Set-Content -Path (Join-Path $frontend "script.js") -Value @'
[PASTE script.js CONTENT HERE]
'@ -Encoding UTF8

Set-Content -Path (Join-Path $frontend "styles.css") -Value @'
[PASTE styles.css CONTENT HERE]
'@ -Encoding UTF8

Set-Content -Path (Join-Path $frontend "package.json") -Value @'
[PASTE frontend package.json CONTENT HERE]
'@ -Encoding UTF8

Write-Host "Files created at $dest"
Write-Host "Now run:"
Write-Host "  cd $backend"
Write-Host "  npm install"
Write-Host "  node server.cjs"
Write-Host "In another terminal:"
Write-Host "  cd $frontend"
Write-Host "  npm install"
Write-Host "  npm run dev"
