module.exports = {
    "extends": "standard",
    "plugins": [
    	"react"
    ],
    "parserOptions": {
	    "ecmaFeatures": {
	      "jsx": true
	    }
	},
	"rules": {
	    "react/jsx-uses-react": "error",
	    "react/jsx-uses-vars": "error",
	    "semi": ["error", "always"],
	    "indent": ["error", "tab"],
	    "no-tabs": 0
	  },

};