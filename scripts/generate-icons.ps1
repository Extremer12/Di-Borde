Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\assets\images\Emblema Rojo Circular con D.png"
$outDir = Join-Path $PSScriptRoot "..\public\icons"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

function Resize-And-Save($source, [int]$w, [int]$h, [string]$outName, [bool]$maskable = $false) {
    $targetPath = Join-Path $outDir $outName
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($maskable) {
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 28, 25, 23))
        $g.FillRectangle($brush, 0, 0, $w, $h)
        $brush.Dispose()
        $padX = [int]($w * 0.12)
        $padY = [int]($h * 0.12)
        $drawW = $w - ($padX * 2)
        $drawH = $h - ($padY * 2)
        $g.DrawImage($source, $padX, $padY, $drawW, $drawH)
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.DrawImage($source, 0, 0, $w, $h)
    }

    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $outName ($($w)x$($h))"
}

Resize-And-Save $src 192 192 "icon-192.png" $false
Resize-And-Save $src 512 512 "icon-512.png" $false
Resize-And-Save $src 192 192 "icon-maskable-192.png" $true
Resize-And-Save $src 512 512 "icon-maskable-512.png" $true
Resize-And-Save $src 180 180 "apple-touch-icon.png" $false
Resize-And-Save $src 32 32 "favicon-32x32.png" $false
Resize-And-Save $src 16 16 "favicon-16x16.png" $false

$src.Dispose()
Write-Host "All PWA icons generated successfully."
