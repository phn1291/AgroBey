# Script de Synchronisation GitHub - AgroBey
$git = "C:\Users\PaulAlbertNdour\.gemini\antigravity\brain\a2849c05-6cae-4bd0-a48f-cecf65e9ae91\scratch\git\cmd\git.exe"

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🌿 Synchronisation AgroBey vers GitHub" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Dépôt distant : https://github.com/phn1291/AgroBey.git" -ForegroundColor Cyan

# Vérifier si un token est fourni en paramètre ou demander
$token = Read-Host "Entrez votre GitHub Personal Access Token (ou appuyez sur Entrée pour utiliser le login standard)"

if ($token) {
    $remoteWithToken = "https://$token@github.com/phn1291/AgroBey.git"
    & $git push $remoteWithToken main --force
} else {
    & $git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Projet synchronisé avec succès sur GitHub !" -ForegroundColor Green
    Write-Host "👉 Visualisez votre code : https://github.com/phn1291/AgroBey" -ForegroundColor Yellow
} else {
    Write-Host "`n⚠️ Échec du push. Vérifiez vos identifiants ou votre Personal Access Token GitHub (repo scope)." -ForegroundColor Red
}
