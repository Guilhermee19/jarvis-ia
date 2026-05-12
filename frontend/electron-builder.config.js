/**
 * Electron Builder Configuration
 * Configura como o app será empacotado para distribuição
 */
module.exports = {
  appId: 'com.jarvis.ia',
  productName: 'Jarvis IA',
  copyright: 'Copyright © 2026',
  
  directories: {
    output: 'out',
    buildResources: 'build',
  },
  
  files: [
    'dist/**/*',
    'dist-electron/**/*',
    'package.json',
  ],
  
  extraResources: [
    {
      from: '../backend',
      to: 'backend',
      filter: ['**/*', '!**/__pycache__', '!**/*.pyc', '!**/ui/**'],
    },
  ],
  
  win: {
    target: ['nsis', 'portable'],
    icon: 'build/icon.ico',
    artifactName: '${productName}-${version}-${arch}.${ext}',
  },
  
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Jarvis IA',
  },
  
  portable: {
    artifactName: '${productName}-${version}-portable.${ext}',
  },
  
  mac: {
    target: ['dmg', 'zip'],
    icon: 'build/icon.icns',
    category: 'public.app-category.productivity',
  },
  
  linux: {
    target: ['AppImage', 'deb'],
    icon: 'build/icon.png',
    category: 'Utility',
  },
  
  // Publish configuration (para auto-update futuro)
  publish: null,
};
