export default (opts) => `#!/bin/bash

rm $HOME/.installer-debug-log.txt || true
echo "Running installer..." > $HOME/.installer-debug-log.txt

// remove if already exists
rm -rf "/Library/Application Support/Adobe/CS4ServiceManager/extensions/${opts.bundleId}" || true
rm -rf "/Library/Application Support/Adobe/CS5ServiceManager/extensions/${opts.bundleId}" || true
rm -rf "/Library/Application Support/Adobe/CS5.5ServiceManager/extensions/${opts.bundleId}" || true
rm -rf "/Library/Application Support/Adobe/CS6ServiceManager/extensions/${opts.bundleId}" || true

// install extension
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS4ServiceManager/extensions/${opts.bundleId}" || true
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS5ServiceManager/extensions/${opts.bundleId}" || true
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS5.5ServiceManager/extensions/${opts.bundleId}" || true
unzip ./bundle.zxp -d "/Library/Application Support/Adobe/CS6ServiceManager/extensions/${opts.bundleId}" || true

echo "Done." >> $HOME/.installer-debug-log.txt
`