export default (opts) => `#!/bin/bash
LOG_FILE="$HOME/.installer-debug-log.txt"
rm -f "$LOG_FILE" || true
echo "Uninstalling previous versions if any..." >> "$LOG_FILE"
./ExManCmd_mac/Contents/MacOS/ExManCmd --remove ${opts.bundleId} || true >> "$LOG_FILE" 2>&1
echo "Installing new versions..." >> "$LOG_FILE"
./ExManCmd_mac/Contents/MacOS/ExManCmd --install ./bundle.zxp >> "$LOG_FILE" 2>&1
if grep -q Failed "$LOG_FILE"; then
    echo "Installation failed, please look up the error code above on the following website:\nhttps://helpx.adobe.com/exchange/kb/error-codes.html\nOpening the log file and website." >> "$LOG_FILE"
    open "$LOG_FILE"
    open https://helpx.adobe.com/exchange/kb/error-codes.html
    echo "If you still experience issues, please contact us." >> "$LOG_FILE"
    exit 1
fi
echo "Done." >> "$LOG_FILE"`