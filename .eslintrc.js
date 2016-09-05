module.exports = {
  'extends': 'airbnb',
  'installedESLint': true,
  'plugins': [
    'react',
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-console": ["error", { allow: ["warn", "error", "log"] }]
  },
  "parserOptions":{
    "ecmaFeatures":{
      "experimentalObjectRestSpread" :true
    }
  }

};
