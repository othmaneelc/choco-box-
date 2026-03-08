# Save this as fix-all.ps1 and run with: .\fix-all.ps1

# Step 1: Rename physical image files
$renames = @{
    "Box cœur Ferrero premium.png" = "box-coeur-ferrero-premium.png"
    "Box cœur rose Ferrero.png"    = "box-coeur-rose-ferrero.png"
    "Box cœur romantique.png"      = "box-coeur-romantique.png"
    "Box cœur Ferrero rouge.png"   = "box-coeur-ferrero-rouge.png"
    "Box cœur love.png"            = "box-coeur-love.png"
    "Box cœur violet.png"          = "box-coeur-violet.png"
    "Box cœur chocolat mix.png"    = "box-coeur-chocolat-mix.png"
    "Box ronde fleurs rose.png"    = "box-ronde-fleurs-rose.png"
    "Mini box cœur.png"            = "mini-box-coeur.png"
}

foreach ($old in $renames.Keys) {
    if (Test-Path $old) {
        Rename-Item -LiteralPath $old -NewName $renames[$old]
        Write-Host "Renamed: $old -> $($renames[$old])"
    }
}

# Step 2: Update all HTML files
$htmlFiles = @("index.html", "collection.html", "about.html", "contact.html")

$replacements = @{
    "Box cœur Ferrero premium.png" = "box-coeur-ferrero-premium.png"
    "Box cœur rose Ferrero.png"    = "box-coeur-rose-ferrero.png"
    "Box cœur romantique.png"      = "box-coeur-romantique.png"
    "Box cœur Ferrero rouge.png"   = "box-coeur-ferrero-rouge.png"
    "Box cœur love.png"            = "box-coeur-love.png"
    "Box cœur violet.png"          = "box-coeur-violet.png"
    "Box cœur chocolat mix.png"    = "box-coeur-chocolat-mix.png"
    "Box ronde fleurs rose.png"    = "box-ronde-fleurs-rose.png"
    "Box anniversaire etaage.png"  = "box-anniversaire-etage.png"
    "box coeur rouge.png"          = "box-coeur-rouge.png"
    "box coeaur ferrero.png"       = "box-coeur-ferrero.png"
    "box couer red and white.png"  = "box-coeur-rouge-blanc.png"
    "box coeur marriage.png"       = "box-coeur-mariage.png"
    "box ronde ferroro.png"        = "box-ronde-ferrero.png"
    "box ronde snickers.png"       = "box-ronde-snickers.png"
    "choco box etage.png"          = "choco-box-etage.png"
    "Mini box cœur.png"            = "mini-box-coeur.png"
}

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
        foreach ($old in $replacements.Keys) {
            $content = $content.Replace($old, $replacements[$old])
        }
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated HTML: $file"
    }
}

Write-Host ""
Write-Host "ALL DONE. Now run: git add . && git commit -m 'fix images' && git push origin main"
