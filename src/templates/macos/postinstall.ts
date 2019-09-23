export default (opts) => `#!/bin/bash

LOG_FILE="$HOME/.installer-debug-log.txt"
rm $LOG_FILE || true
echo "Uninstalling previous versions if any..." >> $LOG_FILE
# ./ExManCmd_mac/Contents/MacOS/ExManCmd --remove ${opts.bundleId} || true >> $LOG_FILE 2>&1
# echo "Installing new versions..." >> $LOG_FILE
# ./ExManCmd_mac/Contents/MacOS/ExManCmd --install ./bundle.zxp >> $LOG_FILE 2>&1
# if grep -q Failed "$LOG_FILE"; then
#    echo "Installation failed, please look up the error code above on the following website:\nhttps://helpx.adobe.com/exchange/kb/error-codes.html\nOpening the log file and website." >> $LOG_FILE
#    command -v osascript >/dev/null 2>&1 && osascript -e "display notification \"${opts.name} ${opts.version} failed to install!!\" with title \"${opts.name}\""
#    open $LOG_FILE
#    open https://helpx.adobe.com/exchange/kb/error-codes.html
#    echo "If you still experience issues, please contact us." >> $LOG_FILE
#    exit 1
# fi
echo "Removing previous zxp installer if any..." >> $LOG_FILE
rm -rf "$HOME/Library/Application\ Support/zxpinstaller" || true
echo "Copying new zxp installer if any..." >> $LOG_FILE
cp -r "./ExManCmd_mac $HOME/Library/Application\ Support/zxpinstaller"
echo "Fixing zxp installer permissions..." >> $LOG_FILE
chown -R $USER:staff "$HOME/Library/Application\ Support/zxpinstaller"
echo "Done." >> $LOG_FILE`

// export default (opts) => `#!/bin/bash

// LOG_FILE="$HOME/.installer-debug-log.txt"
// rm $LOG_FILE || true
// echo "Uninstalling previous versions if any..." >> $LOG_FILE
// ./ExManCmd_mac/Contents/MacOS/ExManCmd --remove ${opts.bundleId} || true >> $LOG_FILE 2>&1
// echo "Installing new versions..." >> $LOG_FILE
// ./ExManCmd_mac/Contents/MacOS/ExManCmd --install ./bundle.zxp >> $LOG_FILE 2>&1
// if grep -q Failed "$LOG_FILE"; then
//     echo "Installation failed, please look up the error code above on the following website:\nhttps://helpx.adobe.com/exchange/kb/error-codes.html\nOpening the log file and website." >> $LOG_FILE
//     command -v osascript >/dev/null 2>&1 && osascript -e "display notification \"${opts.name} ${opts.version} failed to install!!\" with title \"${opts.name}\""
//     open $LOG_FILE
//     open https://helpx.adobe.com/exchange/kb/error-codes.html
//     echo "If you still experience issues, please contact us." >> $LOG_FILE
//     exit 1
// fi
// echo "Removing previous zxp installer if any..." >> $LOG_FILE
// rm -rf "$HOME/Library/Application\ Support/zxpinstaller" || true
// echo "Copying new zxp installer if any..." >> $LOG_FILE
// cp -r "./ExManCmd_mac $HOME/Library/Application\ Support/zxpinstaller"
// echo "Fixing zxp installer permissions..." >> $LOG_FILE
// chown -R $USER:staff "$HOME/Library/Application\ Support/zxpinstaller"
// echo "Done." >> $LOG_FILE`