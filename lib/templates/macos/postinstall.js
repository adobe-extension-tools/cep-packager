"use strict";
exports.__esModule = true;
exports["default"] = function (opts) { return "#!/bin/bash\necho \"Removing previous zxp installer if any...\"\nrm -rf \"$HOME/Library/Application Support/zxpinstaller\" || true\necho \"Copying new zxp installer if any...\"\ncp -r \"./ExManCmd_mac $HOME/Library/Application Support/zxpinstaller\"\necho \"Fixing zxp installer permissions...\"\nchown -R $USER:staff \"$HOME/Library/Application Support/zxpinstaller\"\necho \"Done.\""; };
