; -- Bridge Installer --

[Setup]
AppName=Bridge
AppVersion=0.2
DefaultDirName={userappdata}\bridge
DisableDirPage=true
DisableProgramGroupPage=true
DefaultGroupName=Bridge
Compression=lzma2
SolidCompression=yes
OutputDir=/

[Files]
Source: "build\win\*"; DestDir: "{userappdata}\bridge"; Flags: recursesubdirs

[UninstallDelete]
Type: filesandordirs; Name: "{userappdata}\bridge"

[Icons]
Name: "{group}\Bridge"; Filename: "{userappdata}\bridge\nw.exe"
Name: "{group}\Uninstall Brige"; Filename: "{uninstallexe}"

[Run]
Filename: "{userappdata}\bridge\nw.exe"; Flags: nowait

