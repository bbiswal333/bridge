; -- Bridge Installer --

[Setup]
AppName=Bridge
AppVersion=0.9.2
DefaultDirName={userappdata}\bridge
DisableDirPage=true
DisableProgramGroupPage=true
DefaultGroupName=Bridge
Compression=lzma2
SolidCompression=yes
OutputDir=/

[Tasks]
Name: startup; Description: "Automatically run Bridge on Startup"; GroupDescription: "Autostart"

[Files]
Source: "build\win\*"; DestDir: "{userappdata}\bridge"; Flags: recursesubdirs

[UninstallDelete]
Type: filesandordirs; Name: "{userappdata}\bridge"

[Icons]
Name: "{group}\Bridge"; Filename: "{userappdata}\bridge\nw.exe"
Name: "{group}\Uninstall Brige"; Filename: "{uninstallexe}"
Name: "{commonstartup}\Bridge"; Filename: "{userappdata}\bridge\nw.exe"; Tasks: startup

[Run]
Filename: "{userappdata}\bridge\nw.exe"; Flags: nowait

