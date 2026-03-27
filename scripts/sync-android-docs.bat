@echo off
:: Generates Android API docs with Dokka and copies them into the website.
::
:: Usage (from anywhere):
::   cd c:\watt\eidkit\website
::   scripts\sync-android-docs.bat

setlocal

:: Resolve absolute paths
pushd "%~dp0\.."
set WEBSITE_DIR=%CD%
popd

pushd "%~dp0\..\..\eidkit-android"
set ANDROID_SDK_DIR=%CD%
popd

set OUTPUT_DIR=%WEBSITE_DIR%\static\android-api\latest
set DOKKA_OUT=%ANDROID_SDK_DIR%\sdk\build\dokka\html

echo =^> Android SDK: %ANDROID_SDK_DIR%
echo =^> Output:      %OUTPUT_DIR%

:: --- 1. Run Dokka ---
echo.
echo =^> Running Dokka...
cd /d "%ANDROID_SDK_DIR%"
call gradlew.bat :sdk:dokkaHtml
if errorlevel 1 (
    echo ERROR: Dokka failed
    exit /b 1
)

if not exist "%DOKKA_OUT%" (
    echo ERROR: Dokka output not found at %DOKKA_OUT%
    exit /b 1
)

:: --- 2. Copy to static\ ---
echo.
echo =^> Copying to %OUTPUT_DIR%...
if exist "%OUTPUT_DIR%" rmdir /s /q "%OUTPUT_DIR%"
mkdir "%OUTPUT_DIR%"
xcopy /e /i /q "%DOKKA_OUT%\*" "%OUTPUT_DIR%\"

echo.
echo Done! Docs available at:
echo   http://localhost:3000/android-api/latest/index.html

endlocal
