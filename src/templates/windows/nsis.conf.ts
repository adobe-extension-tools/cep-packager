export default (opts) => `!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "${opts.name}"
BrandingText "${opts.name}"
OutFile "${opts.windows.dest}"
SetCompressor /SOLID lzma
InstallDir "$PLUGINSDIR"

!define MUI_ABORTWARNING
!define MUI_WELCOMEFINISHPAGE_BITMAP "${opts.windows.resources}/leftimage.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${opts.windows.resources}/leftimage.bmp"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${opts.windows.resources}/headerimage.bmp"
!define MUI_HEADERIMAGE_UNBITMAP "${opts.windows.resources}/headerimage.bmp"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${opts.name}.$\\r$\\n$\\r$\\nClick Next to continue."
!define MUI_ICON "${opts.windows.resources}/icon.ico"

!insertmacro MUI_PAGE_LICENSE "${opts.windows.resources}/LICENSE.txt"
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

Function .onInit
	InitPluginsDir
FunctionEnd

Section "Application" SecApplication
	SetShellVarContext all
	SetOutPath "$PLUGINSDIR"
	File /r "${opts.paths.windowsInstallerFiles}/*"
	ExecWait '"$PLUGINSDIR\\ExManCmd_win\\ExManCmd.exe" /install bundle.zxp' $0
	\${If} $0 U>= 0x80010000
		MessageBox mb_iconstop "Error during installation: $0. Please look up the error code above on the following website: https://helpx.adobe.com/exchange/kb/error-codes.html"
		Abort  
	\${EndIf}
SectionEnd
`
