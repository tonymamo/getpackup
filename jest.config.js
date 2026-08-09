module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
    '^worker-loader!.*$': '<rootDir>/__mocks__/worker-loader-mock.js',
    '^@cms/(.*)$': '<rootDir>/src/cms/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@components$': '<rootDir>/src/components/index.tsx',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@images/(.*)$': '<rootDir>/src/images/$1',
    '^@redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@templates/(.*)$': '<rootDir>/src/templates/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@views/(.*)$': '<rootDir>/src/views/$1',
  },
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public', 'cypress/*'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  globals: {
    __PATH_PREFIX__: '',
    'ts-jest': {
      // Type errors are caught by `tsc --noEmit` separately; per-file ts-jest
      // type-checking resolves some styled-components generics differently
      // than a whole-program compile and produces false positives.
      isolatedModules: true,
    },
  },
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/loadershim.js'],
  setupFilesAfterEnv: ['<rootDir>/setup-test-env.js'],
};
