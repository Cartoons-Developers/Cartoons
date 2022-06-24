:: Cartoons Updater
:: Author: tetradual#1525
:: License: MIT
title Cartoons Updater [Initializing...]

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
echo Doesn't seem like this script is in a Cartoons folder.
pause && exit
:noerror_location

:::::::::::::::::::::::::
:: Post-Initialization ::
:::::::::::::::::::::::::

title Cartoons Updater

if not exist .git ( goto nogit )
:yesgit
echo Cartoons Updater
echo A project from VisualPlugin adapted by the Cartoons Team
echo:
echo Enter 1 to update Cartoons
echo Enter 0 to close the updater
goto wrapperidle
:nogit
echo You have not downloaded Cartoons using the installer... somehow??
echo Please download the installer and run it https://github.com/joeynigro/Cartoons.
pause & exit
:wrapperidle
echo:

:::::::::::::
:: Choices ::
:::::::::::::

set /p CHOICE=Choice:
if "!choice!"=="0" goto exit
if "!choice!"=="1" goto update
echo Time to choose. && goto wrapperidle

:update
cls
pushd "%~dp0"
echo Pulling repository from GitHub...
git pull
cls
echo Cartoons has been updated^^!
start "" "%~dp0"
pause & exit

:exit
pause & exit
