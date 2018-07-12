module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "rules": {
      "semi": [2, "never"],
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/forbid-prop-types": "off"
    },
    "env": {
      "jest": true,
      "browser": true,
    }
};