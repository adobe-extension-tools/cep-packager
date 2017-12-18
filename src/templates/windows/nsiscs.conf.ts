export default (opts) => `!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "${opts.name}"
BrandingText "${opts.name}"
OutFile "${opts.windows.dest}"
SetCompressor /SOLID lzma
InstallDir "C:\Program Files (x86)\Common Files\Adobe\CEPServiceManager4\extensions\${opts.bundleId}"

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
  SetOutPath "$INSTDIR"
  RMDir /r $INSTDIR
  File /r "${opts.paths.windowsInstallerFiles}/*"
SectionEnd
`
