module.exports = {
  preset: 'react-native',

  // Extend the preset's transform to also cover .jsx files (preset only covers .js/.ts/.tsx)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Allow Babel to transform ALL react-native-* and @react-* packages (many ship as ESM)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@react-native-firebase|@react-navigation|react-native-.*|@rneui)/)',
  ],

  // Map static assets to a stub
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|ttf|otf|woff|woff2|eot)$':
      '<rootDir>/__mocks__/fileMock.js',
  },

  // Mock all native modules before tests run
  setupFiles: ['<rootDir>/__mocks__/setup.js'],

  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
