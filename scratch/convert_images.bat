@echo off
setlocal enabledelayedexpansion

echo Converting candidate images...
for %%f in (public\images\candidates\*.png) do (
    echo Converting %%f...
    call npx sharp-cli -i "%%f" -o public\images\candidates\ --format jpg -q 80
)

echo Converting main images...
for %%f in (public\images\*.png) do (
    echo Converting %%f...
    call npx sharp-cli -i "%%f" -o public\images\ --format jpg -q 80
)

echo Done.
