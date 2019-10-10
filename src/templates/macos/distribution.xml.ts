import * as path from 'path'

export default (opts) => `<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="1">
  <pkg-ref id="${opts.bundleId}"/>
  <options customize="never" require-scripts="false"/>
  <domains enable_currentUserHome="true" enable_localSystem="true" />
  <choices-outline>
    <line choice="${opts.bundleId}"/>
  </choices-outline>
  <choice id="${opts.bundleId}" visible="false" title="${opts.name}" start_selected="true">
    <pkg-ref id="${opts.bundleId}" />
  </choice>
  <pkg-ref id="${opts.bundleId}" version="${opts.version}" onConclusion="none">${encodeURI(path.basename(opts.paths.macOsInstallerFile))}</pkg-ref>
  <welcome mime-type="text/html" file="WELCOME.html"/>
  <license mime-type="text/html" file="LICENSE.html"/>
  <background file="background.png" alignment="bottomleft" scaling="none"/>
  <title>${opts.name}</title>
</installer-gui-script>
`
