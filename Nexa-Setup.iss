
; ================================================================
;  Nexa  —  Professional Installer
;  Inno Setup 6.x  |  Clean modern UI, no custom images
; ================================================================

#define MyAppName        "Nexa"
#define MyAppVersion     "1.0.0"
#define MyAppPublisher   "Nexa AI"
#define MyAppURL         "https://nexa.ai"
#define MyAppExeName     "Nexa.exe"
#define MyAppSourceDir   "C:\Users\pc\Desktop\My Work\Nexa1\electron\dist\win-unpacked"
#define MyAppOutputDir   "C:\Users\pc\Desktop\Nexa Installer2"
#define MyAppIconFile    "C:\Users\pc\Desktop\My Work\Nexa1\assets\icon.ico"

[Setup]
AppId={{4F2A1B3C-9D7E-4A6F-B8C2-1E5D0F3A7B9C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppCopyright=Copyright © 2025 {#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
CreateAppDir=yes
UsePreviousAppDir=no
OutputDir={#MyAppOutputDir}
OutputBaseFilename=Nexa-Setup-1.0.0
DiskSpanning=yes
DiskSliceSize=2000000000
SetupIconFile={#MyAppIconFile}
Compression=lzma2/ultra64
SolidCompression=yes
LZMAUseSeparateProcess=yes
WizardStyle=modern
WizardSizePercent=120,110
DisableWelcomePage=no
DisableDirPage=no
DisableProgramGroupPage=yes
DisableReadyPage=no
ShowLanguageDialog=no
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64
ArchitecturesAllowed=x64
CloseApplications=yes
CloseApplicationsFilter=Nexa.exe
RestartApplications=no
MinVersion=10.0
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName} {#MyAppVersion}
CreateUninstallRegKey=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Messages]
WelcomeLabel1=Welcome to {#MyAppName} Setup
WelcomeLabel2=This wizard will guide you through the installation of {#MyAppName} {#MyAppVersion}.%n%n{#MyAppName} is a local AI-powered desktop assistant. All processing happens on your machine — your data never leaves your device.%n%nClick Next to continue.
FinishedHeadingLabel=Installation Complete
FinishedLabel={#MyAppName} has been successfully installed.%n%nClick Finish to close this wizard.
ClickNext=Click Next to continue, or Cancel to exit.
SelectDirLabel3=Setup will install {#MyAppName} into the following folder.
SelectDirBrowseLabel=To continue, click Next. To choose a different folder, click Browse.
ReadyLabel1=Setup is ready to install {#MyAppName} on your computer.
ReadyLabel2a=Click Install to begin.
StatusExtractFiles=Copying application files...
StatusCreateIcons=Creating shortcuts...
StatusPostInstall=Finishing installation...

[CustomMessages]
Step1=Preparing installation environment...
Step2=Copying application files...
Step3=Installing AI runtime components...
Step4=Registering application...
Step5=Creating shortcuts...
Step6=Finalizing...
UninstallPrompt=This will completely remove {#MyAppName} from your computer.%n%nContinue?

[Tasks]
Name: "startmenu"; Description: "Create a &Start Menu shortcut"; GroupDescription: "Additional options:"

[Files]
Source: "{#MyAppSourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Dirs]
Name: "{commonappdata}\Nexa"; Permissions: users-modify

[Icons]
Name: "{autodesktop}\{#MyAppName}";        Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{#MyAppName}";              Filename: "{app}\{#MyAppExeName}"; Tasks: startmenu
Name: "{group}\Uninstall {#MyAppName}";    Filename: "{uninstallexe}";        Tasks: startmenu

[Registry]
Root: HKLM; Subkey: "Software\{#MyAppPublisher}\{#MyAppName}"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"; Flags: uninsdeletekey
Root: HKLM; Subkey: "Software\{#MyAppPublisher}\{#MyAppName}"; ValueType: string; ValueName: "Version";     ValueData: "{#MyAppVersion}"
Root: HKLM; Subkey: "Software\{#MyAppPublisher}\{#MyAppName}"; ValueType: string; ValueName: "Publisher";   ValueData: "{#MyAppPublisher}"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent; WorkingDir: "{app}"

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
Type: filesandordirs; Name: "{commonappdata}\Nexa"

[Code]

var
  ProgressPage : TOutputProgressWizardPage;
  ResultCode   : Integer;
  ErrorCode    : Integer;

procedure KillProcesses;
begin
  Exec('cmd.exe', '/C taskkill /F /T /IM Nexa.exe         >nul 2>&1', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Exec('cmd.exe', '/C taskkill /F /T /IM nexa-backend.exe >nul 2>&1', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Exec('cmd.exe', '/C taskkill /F /T /IM ollama.exe       >nul 2>&1', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Sleep(600);
end;

procedure WriteInstallMarker;
var
  Dir   : String;
  FPath : String;
  Lines : TArrayOfString;
begin
  Dir   := ExpandConstant('{commonappdata}\Nexa');
  FPath := Dir + '\install-marker.txt';
  ForceDirectories(Dir);
  SetArrayLength(Lines, 3);
  Lines[0] := 'InstalledVersion={#MyAppVersion}';
  Lines[1] := 'InstallDate=' + GetDateTimeString('yyyy-mm-dd hh:nn:ss', '-', ':');
  Lines[2] := 'InstallPath='  + ExpandConstant('{app}');
  SaveStringsToFile(FPath, Lines, False);
end;

procedure RunProgressSteps;
var
  Steps : array[0..5] of String;
  i     : Integer;
begin
  Steps[0] := CustomMessage('Step1');
  Steps[1] := CustomMessage('Step2');
  Steps[2] := CustomMessage('Step3');
  Steps[3] := CustomMessage('Step4');
  Steps[4] := CustomMessage('Step5');
  Steps[5] := CustomMessage('Step6');

  ProgressPage := CreateOutputProgressPage(
    'Installing {#MyAppName}',
    'Please wait while {#MyAppName} is being installed on your computer...'
  );
  ProgressPage.Show;
  try
    for i := 0 to 5 do
    begin
      ProgressPage.SetText(Steps[i], '');
      ProgressPage.SetProgress(i, 6);
      Sleep(450);
    end;
    ProgressPage.SetProgress(6, 6);
    Sleep(200);
  finally
    ProgressPage.Hide;
  end;
end;

function InitializeUninstall: Boolean;
begin
  Result := MsgBox(
    CustomMessage('UninstallPrompt'),
    mbConfirmation,
    MB_YESNO or MB_DEFBUTTON2
  ) = IDYES;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    KillProcesses;
    RunProgressSteps;
  end;
  if CurStep = ssPostInstall then
    WriteInstallMarker;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usUninstall then
    KillProcesses;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if CurPageID = wpSelectDir then
    if WizardDirValue = '' then
    begin
      MsgBox('Please select an installation folder.', mbError, MB_OK);
      Result := False;
    end;
end;