@echo off

SET fullpath=%~dp0
SET mypath=%fullpath:~0,-1%

call node %mypath%\index.js