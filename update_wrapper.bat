:: Automatically upgrades an existing W:O install to a new version
:: Author: xomdjl_#1337 (ytpmaker1000@gmail.com)
:: Original idea from 2Epik4u#1904
:: License: MIT

:: Initialize (stop command spam, clean screen, make variables work, set to UTF-8)
@echo off && cls
SETLOCAL ENABLEDELAYEDEXPANSION
chcp 65001 >nul

:: Move to base folder, and make sure it worked (otherwise things would go horribly wrong)
pushd "%~dp0"
if !errorlevel! NEQ 0 goto error_location
if not exist utilities ( goto error_location )
if not exist wrapper ( goto error_location )
if not exist server ( goto error_location )
goto noerror_location
:error_location
echo Doesn't seem like this script is in a Wrapper: Offline folder.
goto end
:gitpullerror
echo ERROR: Could not pull the latest version of the Git
echo repository.
echo:
echo Would you like to try to "reset" the repository? [Y/n]
:gitpullretry
set /p GITRESET= Response: 
if "!gitreset!"=="0" goto end
if /i "!gitreset!"=="y" (
	echo Resetting repository...
	call git reset --hard
	echo Attempting to pull update again...
	call git pull || echo It still failed. You'll have to close the window and try again later. & echo: & pause & exit /B
)
if /i "!gitreset!"=="n" goto endseinfeld
:noerror_location

:: Prevents CTRL+C cancelling and keeps window open when crashing
if "%~1" equ "point_insertion" goto point_insertion
start "" /wait /B "%~F0" point_insertion
exit
:point_insertion

:: patch detection
if exist "patch.jpg" echo no amount of upgrades can fix a patch && goto end

:: Get config.bat
set SUBSCRIPT=y
if not exist utilities\config.bat ( goto error_location )
call utilities\config.bat


title Upgrading Wrapper: Offline
echo Would you like to upgrade?
echo:
echo Press Y to install the update, press N to cancel.
echo:
:installaskretry
set /p INSTALLCHOICE= Response:
echo:
if /i "!installchoice!"=="0" goto end
if /i "!installchoice!"=="y" goto checkforgit
if /i "!installchoice!"=="n" goto end
echo You must answer Yes or No. && goto installaskretry

:checkforgit
if !VERBOSEWRAPPER!==n ( cls )
echo Checking if you downloaded Wrapper: Offline correctly...
if exist .git (
	if !VERBOSEWRAPPER!==n ( cls )
	echo Git folder has been found!
	echo Beginning update...
	echo:
	goto startupdate
) else (
	goto nogit
)

:nogit
if !VERBOSEWRAPPER!==n ( cls )
echo Okay, there's no sign of Wrapper: Offline being
echo cloned through the installer.
PING -n 4 127.0.0.1>nul
echo That means YOU MUST HAVE INSTALLED THIS INCORRECTLY^^!
PING -n 4 127.0.0.1>nul
goto endseinfeld

:startupdate
if !VERBOSEWRAPPER!==n ( cls )
echo Please do not close this window^^!^^!
echo Doing so may ruin your copy of Wrapper: Offline.
echo It's almost certainly NOT frozen, just takes a while.
echo:
:: Save user data
if !VERBOSEWRAPPER!==y ( echo Saving custom settings in temporary file... )
pushd utilities
copy config.bat tmpcfg.bat>nul
popd
if exist "server\store\3a981f5cb2739137\import\*\*.*" (
	set IMPORTEDASSETS=y
	if !VERBOSEWRAPPER!==y ( echo Saving imported assets to temporary files... )
	call utilities\7za.exe a "utilities\misc\temp\importarchive.zip" .\server\store\3a981f5cb2739137\import\*>nul
) else (
	set IMPORTEDASSETS=n
	if !VERBOSEWRAPPER!==Y ( echo Skipping saving the imported assets as it could not detect any. )
)
if !VERBOSEWRAPPER!==y ( echo Pulling latest version of repository from GitHub through Git... )
PING -n 4 127.0.0.1>nul
:: Perform the update
call git pull || goto gitpullerror
:: Bring back user data
if !VERBOSEWRAPPER!==y ( echo Deleting config.bat from repository and replacing it with user's copy... )
pushd utilities
del config.bat
ren tmpcfg.bat config.bat
popd
if !IMPORTEDASSETS!==y (
	if !VERBOSEWRAPPER!==y ( echo Deleting all the imported assets from the repository and replacing it with user's assets... )
	pushd server\store\3a981f5cb2739137
	rd /q /s import
	md import
	popd
	call utilities\7za.exe e "utilities\misc\temp\importarchive.zip" -o"server\store\3a981f5cb2739137\import" -y>nul
	del utilities\misc\temp\importarchive.zip>nul
	del "wrapper\_THEMES\import.xml">nul
	copy "server\store\3a981f5cb2739137\import\theme.xml" "wrapper\_THEMES\import.xml">nul
) else (
	if !VERBOSEWRAPPER!==y ( echo Deleting all the imported assets from the repository... )
	pushd server\store\3a981f5cb2739137
	rd /q /s import
	md import
	pushd import
	echo ^<?xml version="1.0" encoding="utf-8"?^> >>theme.xml
	echo ^<theme id="import" name="Imported Assets" cc_theme_id="import"^> >>theme.xml
	echo 	^<char id="327068788" name="the benson apparition" cc_theme_id="family" thumbnail_url="char-default.png" copyable="Y"^> >>theme.xml
	echo 	^<tags^>family,every,copy,of,wrapper,offline,is,_free,software,but,is,also,_cat:personalized^</tags^> >>theme.xml
	echo 	^</char^> >>theme.xml
	echo:>>theme.xml
	echo ^</theme^> >>theme.xml
	popd
	call utilities\7za.exe a "server\store\3a981f5cb2739137\import\import.zip" "server\store\3a981f5cb2739137\import\theme.xml" >nul
	copy "server\store\3a981f5cb2739137\import\theme.xml" "wrapper\_THEMES\import.xml">nul
)

:: congratulations new version
if !VERBOSEWRAPPER!==n ( cls )
color 20
echo:
echo:
echo Update installed^^!
echo:
goto end

:: seinfeld reference
:endseinfeld
echo NO UPDATE FOR YOU^^!
PING -n 5 127.0.0.1>nul
echo COME BACK, ONE YEAR^^!
PING -n 4 127.0.0.1>nul
:: goes into the normal ending

:: normal end
:end
echo Closing...
pause & exit
