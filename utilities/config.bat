setlocal
if "%SUBSCRIPT%"=="" ( start notepad.exe "%CD%\%~nx0" & exit )
endlocal

:: verbose
set VERBOSEWRAPPER=n

:: skip check depends
set SKIPCHECKDEPENDS=y

:: skip depend install
set SKIPDEPENDINSTALL=n

:: dev mode
set DEVMODE=n

:: dry run
set DRYRUN=n

:: port
set PORT=4343

:: headless mode
set APPCHROMIUM=y

:: fullscreen mode
set FULLSCREEN=n
