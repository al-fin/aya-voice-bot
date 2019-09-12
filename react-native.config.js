// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-gesture-handler': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink
      },
    },
  },
};