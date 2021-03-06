module.exports = {
  name: 'WingsMax',
  version: '2.2.0',
  description: 'A WingsChain Wallet in your Browser',
  author: 'coredev@wingschain.cc',
  manifest_version: 2,
  icons: { '16': 'icons/16.png', '128': 'icons/128.png' },
  permissions: [
    '<all_urls>',
    '*://*/*',
    'activeTab',
    'tabs',
    'background',
    'unlimitedStorage',
    'storage'
  ],
  browser_action: {
    default_title: 'WingsMax',
    default_popup: 'pages/popup.html'
  },
  background: {
    persistent: false,
    page: 'pages/background.html'
  },
  content_scripts: [{
    js: ['js/inject.js'],
    run_at: 'document_end',
    matches: ['<all_urls>'],
    all_frames: true
  }],
  content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'',
  web_accessible_resources: ['panel.html', 'js/content.js']
}
