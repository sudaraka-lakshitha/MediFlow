param(
    [Parameter(Mandatory=$true)][string]$BuildTools,
    [Parameter(Mandatory=$true)][string]$AndroidJar,
    [string]$JavaBin = 'C:\Program Files\Java\jdk-21.0.10\bin'
)
$ErrorActionPreference = 'Stop'
$project = $PSScriptRoot
$build = Join-Path $project 'build'
$signing = Join-Path $project 'signing'
New-Item -ItemType Directory -Force $build, $signing, "$build/classes", "$build/dex" | Out-Null
function Check-Exit { if ($LASTEXITCODE -ne 0) { throw "Android build tool failed: $LASTEXITCODE" } }
& "$BuildTools/aapt2.exe" compile --dir "$project/res" -o "$build/resources.zip"
Check-Exit
& "$BuildTools/aapt2.exe" link -o "$build/unsigned.apk" --manifest "$project/AndroidManifest.xml" -I $AndroidJar "$build/resources.zip"
Check-Exit
& "$JavaBin/javac.exe" --release 8 -classpath $AndroidJar -d "$build/classes" "$project/src/com/mediflow/pharmacy/MainActivity.java"
Check-Exit
& "$JavaBin/jar.exe" --create --file "$build/classes.jar" -C "$build/classes" .
Check-Exit
& "$JavaBin/java.exe" -cp "$BuildTools/lib/d8.jar" com.android.tools.r8.D8 --release --min-api 23 --lib $AndroidJar --output "$build/dex" "$build/classes.jar"
Check-Exit
& "$JavaBin/jar.exe" --update --file "$build/unsigned.apk" -C "$build/dex" classes.dex
Check-Exit
& "$BuildTools/zipalign.exe" -f -p 4 "$build/unsigned.apk" "$build/aligned.apk"
Check-Exit

# Persist the private signing identity locally for compatible future updates.
# Both files are ignored by Git and must never be distributed with the APK.
$key = Join-Path $signing 'mediflow-release.p12'
$passwordFile = Join-Path $signing 'password.txt'
if (!(Test-Path -LiteralPath $key)) {
    if (Test-Path -LiteralPath $passwordFile) { throw 'Incomplete signing identity: recover it before rebuilding.' }
    $random = New-Object byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Fill($random)
    [IO.File]::WriteAllText($passwordFile, [Convert]::ToBase64String($random))
    & "$JavaBin/keytool.exe" -genkeypair -keystore $key -storetype PKCS12 -storepass:file $passwordFile -keypass:file $passwordFile -alias mediflow -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=MediFlow Android'
    Check-Exit
}
if (!(Test-Path -LiteralPath $passwordFile)) { throw 'Signing password missing; recover it before rebuilding.' }
& "$JavaBin/java.exe" -jar "$BuildTools/lib/apksigner.jar" sign --ks $key --ks-key-alias mediflow --ks-pass "file:$passwordFile" --out "$build/MediFlow.apk" "$build/aligned.apk"
Check-Exit
& "$JavaBin/java.exe" -jar "$BuildTools/lib/apksigner.jar" verify --verbose "$build/MediFlow.apk"
Check-Exit
& "$BuildTools/zipalign.exe" -c -v 4 "$build/MediFlow.apk"
Check-Exit
Get-FileHash "$build/MediFlow.apk" -Algorithm SHA256
Get-Item "$build/MediFlow.apk" | Select-Object FullName, Length
