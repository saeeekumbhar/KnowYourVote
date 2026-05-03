Write-Output "Directory Breakdown (excluding node_modules and .git):"
$dirs = Get-ChildItem -Directory
foreach ($dir in $dirs) {
    if ($dir.Name -ne "node_modules" -and $dir.Name -ne ".git") {
        $size = (Get-ChildItem -Path $dir.FullName -Recurse -File | Measure-Object -Property Length -Sum).Sum
        $sizeMB = [Math]::Round($size / 1MB, 2)
        Write-Output "$($dir.Name): $sizeMB MB"
    }
}
Write-Output ""
Write-Output "Top 20 Largest Files:"
Get-ChildItem -Recurse -File | ForEach-Object {
    if ($_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git") {
        $_
    }
} | Sort-Object Length -Descending | Select-Object @{Name='File';Expression={$_.FullName.Replace($PWD.Path, "")}}, @{Name='SizeMB';Expression={[Math]::Round($_.Length / 1MB, 2)}} -First 20 | Format-Table -AutoSize
