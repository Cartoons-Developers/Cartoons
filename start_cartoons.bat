:: Cartoons Launcher
:: Author: benson#0411
:: Project Runner: GoTest334#9880
:: License: MIT
title Cartoons [Initializing...]

::::::::::::::::::::
:: Initialization ::
::::::::::::::::::::

:: Stop commands from spamming stuff, cleans up the screen
@echo off && cls

:: Lets variables work or something idk im not a nerd
SETLOCAL ENABLEDELAYEDEXPANSION

:: Make sure we're starting in the correct folder, and that it worked (otherwise things would go horribly wrong)
pushd "%~dp0"
if !errorlevel! NEQ 0 goto error_location
if not exist utilities ( goto error_location )
if not exist wrapper ( goto error_location )
if not exist server ( goto error_location )
goto noerror_location
:error_location
echo Doesn't seem like this script is in a Cartppms folder.
pause && exit
:noerror_location

:: patch detection
if exist "patch.jpg" goto patched

:: Prevents CTRL+C cancelling (please close with 0) and keeps window open when crashing
if "%~1" equ "point_insertion" goto point_insertion
start "" /wait /B "%~F0" point_insertion
exit

:point_insertion

:: Check *again* because it seems like sometimes it doesn't go into dp0 the first time???
pushd "%~dp0"
if !errorlevel! NEQ 0 goto error_location
if not exist utilities ( goto error_location )
if not exist wrapper ( goto error_location )
if not exist server ( goto error_location )

:: Welcome, Director Ford!
echo Cartoons
echo A project from VisualPlugin adapted by Cartoons team
echo Version !WRAPPER_VER!
echo:

:: Confirm measurements to proceed.
set SUBSCRIPT=y
echo Loading settings...
if not exist utilities\config.bat ( goto configmissing )
call utilities\config.bat
echo:
if !VERBOSEWRAPPER!==y ( echo Verbose mode activated. && echo:)
goto configavailable

:: Restore config
:configmissing
echo Settings are missing for some reason?
echo Restoring...
goto configcopy
:returnfromconfigcopy
if not exist utilities\config.bat ( echo Something is horribly wrong. You may be in a read-only system/admin folder. & pause & exit )
call utilities\config.bat
:configavailable

:: check for updates
pushd "%~dp0"
if !AUTOUPDATE!==y ( 
	pushd "%~dp0"
	if exist .git (
		echo Updating...
		call utilities\PortableGit\bin\git.exe checkout main
		call utilities\PortableGit\bin\git.exe fetch --all
		call utilities\PortableGit\bin\git.exe reset --hard origin/main
		PING -n 3 127.0.0.1>nul
		cls
	) else (
		echo Git not found. Skipping update.
		PING -n 3 127.0.0.1>nul
		cls
	)
) else (
	echo Auto-updating is off. Skipping update.
	PING -n 3 127.0.0.1>nul
	cls
)

::::::::::::::::::::::
:: Starting Wrapper ::
::::::::::::::::::::::

title Cartoons [Loading...]

:: Close existing node apps
:: Hopefully fixes EADDRINUSE errors??
if !VERBOSEWRAPPER!==y (
	echo Closing any existing node apps...
	if !DRYRUN!==n ( TASKKILL /IM node.exe /F )
	echo:
) else (
	if !DRYRUN!==n ( TASKKILL /IM node.exe /F 2>nul )
)

:: Start Node.js
echo Loading Node.js...
pushd utilities
if !VERBOSEWRAPPER!==y (
	if !DRYRUN!==n (
		start /MIN open_nodejs.bat
	)
) else (
	if !DRYRUN!==n (
		start SilentCMD open_nodejs.bat
	)
)
popd

:: Pause to allow startup
:: Prevents the video list opening too fast
PING -n 6 127.0.0.1>nul

:: Open Wrapper in preferred browser
if !INCLUDEDCHROMIUM!==n (
	if !CUSTOMBROWSER!==n (
		echo Opening Cartoons in your default browser...
		if !DRYRUN!==n ( start http://localhost:4343 )
	) else (
		echo Opening Cartoons in your set browser...
		echo If this does not work, you may have set the path wrong.
		if !DRYRUN!==n ( start !CUSTOMBROWSER! http://localhost:4343 )
	)
) else (
	echo Opening Cartoons using included Chromium...
	pushd utilities\ungoogled-chromium
	if !APPCHROMIUM!==y (
		if !DRYRUN!==n ( start chrome.exe --allow-outdated-plugins --user-data-dir=the_profile --app=http://localhost:4343 )
	) else (
		if !DRYRUN!==n ( start chrome.exe --allow-outdated-plugins --user-data-dir=the_profile http://localhost:4343 )
	)
	popd
)

echo Cartoons has been started^^! The video list should now be open.

::::::::::::::::
:: Post-Start ::
::::::::::::::::

title Cartoons
if !VERBOSEWRAPPER!==y ( goto wrapperstarted )
:wrapperstartedcls
cls
:wrapperstarted

echo:
echo Cartoons running
echo A project from VisualPlugin adapted by the Cartoons team
echo:
if !VERBOSEWRAPPER!==n ( echo DON'T CLOSE THIS WINDOW^^! Use the quit option ^(0^) when you're done. )
if !VERBOSEWRAPPER!==y ( echo Verbose mode is on, see the two extra CMD windows for extra output. )
if !DRYRUN!==y ( echo Don't forget, nothing actually happened, this was a dry run. )
if !JUSTIMPORTED!==y ( echo Note: You'll need to reload the editor for your file to appear. )
:: Hello, code wanderer. Enjoy seeing all the secret options easily instead of finding them yourself.
echo:
echo Enter 1 to reopen the video list
echo Enter ? to open the FAQ
echo Enter clr to clean up the screen
echo Enter 0 to close Cartoons
set /a _rand=(!RANDOM!*67/32768)+1
if !_rand!==25 echo Enter things you think'll show a secret if you're feeling adventurous
:wrapperidle
echo:
set /p CHOICE=Choice:
if "!choice!"=="0" goto exitwrapperconfirm
set FUCKOFF=n
if "!choice!"=="1" goto reopen_webpage
if "!choice!"=="?" goto open_faq
if /i "!choice!"=="clr" goto wrapperstartedcls
if /i "!choice!"=="cls" goto wrapperstartedcls
if /i "!choice!"=="clear" goto wrapperstartedcls
:: dev options
if /i "!choice!"=="amnesia" goto wipe_save
if /i "!choice!"=="restart" goto restart
if /i "!choice!"=="folder" goto open_files
echo Time to choose. && goto wrapperidle

:reopen_webpage
if !INCLUDEDCHROMIUM!==n (
	if !CUSTOMBROWSER!==n (
		echo Opening Cartoons in your default browser...
		start http://localhost:4343
	) else (
		echo Opening Cartoons in your set browser...
		start !CUSTOMBROWSER! http://localhost:4343 >nul
	)
) else (
	echo Opening Cartoons using included Chromium...
	pushd utilities\ungoogled-chromium
	if !APPCHROMIUM!==y (
		start chrome.exe --allow-outdated-plugins --user-data-dir=the_profile --app=http://localhost:4343 >nul
	) else (
		start chrome.exe --allow-outdated-plugins --user-data-dir=the_profile http://localhost:4343 >nul
	)
	popd
)
goto wrapperidle

:open_files
pushd ..
echo Opening the Cartoons folder...
start explorer.exe Cartoons
popd
goto wrapperidle

:open_faq
echo Opening the FAQ...
start notepad.exe FAQ.md
goto wrapperidle

:wipe_save
call utilities\reset_install.bat
if !errorlevel! equ 1 goto wrapperidle
:: flows straight to restart below

:restart
TASKKILL /IM node.exe /F
start "" /wait /B "%~F0" point_insertion
exit

:exitwrapperconfirm
echo:
echo Are you sure you want to quit Cartoons?
echo Be sure to save all your work.
echo Type Y to quit, and N to go back.
:exitwrapperretry
set /p EXITCHOICE= Response:
echo:
if /i "!exitchoice!"=="y" goto point_extraction
if /i "!exitchoice!"=="yes" goto point_extraction
if /i "!exitchoice!"=="n" goto wrapperstartedcls
if /i "!exitchoice!"=="no" goto wrapperstartedcls
if /i "!exitchoice!"=="with style" goto exitwithstyle
echo You must answer Yes or No. && goto exitwrapperretry

:point_extraction

title Cartoons [Shutting down...]

:: Shut down Node.js
if !VERBOSEWRAPPER!==y (
	if !DRYRUN!==n ( TASKKILL /IM node.exe /F )
	echo:
) else (
	if !DRYRUN!==n ( TASKKILL /IM node.exe /F 2>nul )
)

:: This is where I get off.
echo Cartoons has been shut down.
if !FUCKOFF!==y ( echo You're a good listener. )
echo This window will now close.
if !INCLUDEDCHROMIUM!==y (
	echo You can close the web browser now.
)
echo Open start_cartoons.bat again to start W:O again.
if !DRYRUN!==y ( echo Go wet your run next time. ) 
pause & exit

:configcopy
if not exist utilities ( md utilities )
echo :: Cartoons Config>> utilities\config.bat
echo :: This file is modified by settings.bat. It is not organized, but comments for each setting have been added.>> utilities\config.bat
echo :: You should be using settings.bat, and not touching this. Offline relies on this file remaining consistent, and it's easy to mess that up.>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Opens this file in Notepad when run>> utilities\config.bat
echo setlocal>> utilities\config.bat
echo if "%%SUBSCRIPT%%"=="" ( pushd "%~dp0" ^& start notepad.exe config.bat ^& exit )>> utilities\config.bat
echo endlocal>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Shows exactly Offline is doing, and never clears the screen. Useful for development and troubleshooting. Default: n>> utilities\config.bat
echo set VERBOSEWRAPPER=n>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Won't check for dependencies (flash, node, etc) and goes straight to launching. Useful for speedy launching post-install. Default: n>> utilities\config.bat
echo set SKIPCHECKDEPENDS=n>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Won't install dependencies, regardless of check results. Overridden by SKIPCHECKDEPENDS. Mostly useless, why did I add this again? Default: n>> utilities\config.bat
echo set SKIPDEPENDINSTALL=n>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Opens Offline in an included copy of ungoogled-chromium. Allows continued use of Flash as modern browsers disable it. Default: y>> utilities\config.bat
echo set INCLUDEDCHROMIUM=y>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Opens INCLUDEDCHROMIUM in headless mode. Looks pretty nice. Overrides CUSTOMBROWSER and BROWSER_TYPE. Default: y>> utilities\config.bat
echo set APPCHROMIUM=y>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Opens Offline in a browser of the user's choice. Needs to be a path to a browser executable in quotes. Default: n>> utilities\config.bat
echo set CUSTOMBROWSER=n>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Lets the launcher know what browser framework is being used. Mostly used by the Flash installer. Accepts "chrome", "firefox", and "n". Default: n>> utilities\config.bat
echo set BROWSER_TYPE=chrome>> utilities\config.bat
echo:>> utilities\config.bat
echo :: Runs through all of the scripts code, while never launching or installing anything. Useful for development. Default: n>> utilities\config.bat
echo set DRYRUN=n>> utilities\config.bat
echo:>> utilities\config.bat
echo :: auto update (what do you think it does, obvious)>> utilities\config.bat
echo set AUTOUPDATE=y>> utilities\config.bat
echo:>> utilities\config.bat
echo :: discord rpc>> utilities\config.bat
echo set RPC=n>> utilities\config.bat
echo:>> utilities\config.bat
goto returnfromconfigcopy
