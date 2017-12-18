export default (opts) => `#!/bin/bash

rm $HOME/.installer-debug-log.txt || true
echo "Running installer..." > $HOME/.installer-debug-log.txt

// remove if already exists
rm -rf "/Library/Application Support/Adobe/CS4 ServiceManager/extensions/${opts.bundleId}" || true
rm -rf "/Library/Application Support/Adobe/CS5 ServiceManager/extensions/${opts.bundleId}" || true
rm -rf "/Library/Application Support/Adobe/CS5.5 ServiceManager/extensions/${opts.bundleId}" || true
rm -rf "/Library/Application Support/Adobe/CS6 ServiceManager/extensions/${opts.bundleId}" || true

// install extension
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS4 ServiceManager/extensions/${opts.bundleId}" >> $HOME/.installer-debug-log.txt 2>&1
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS5 ServiceManager/extensions/${opts.bundleId}" >> $HOME/.installer-debug-log.txt 2>&1
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS5.5 ServiceManager/extensions/${opts.bundleId}" >> $HOME/.installer-debug-log.txt 2>&1
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS6 ServiceManager/extensions/${opts.bundleId}" >> $HOME/.installer-debug-log.txt 2>&1

echo "Done." >> $HOME/.installer-debug-log.txt
`