var os = require('os')
var childProcess = require('child_process')
var readline = require('readline');

if (os.platform() === 'darwin') {
  try {
    childProcess.execSync('type makensis')
  } catch (err) {
    console.log('makensis is not installed! Please install it in order to create windows installers by running:\n\tbrew install makensis')
    try {
      childProcess.execSync('type brew')
    } catch (err) {
      console.log('homebrew is not installed! Please install it in order to install makensis by running:\n\truby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"')
    }
  }
} else {
  console.log('Just a heads up that you cannot create macOS installers on Windows.')
}
