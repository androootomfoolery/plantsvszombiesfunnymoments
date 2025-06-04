(function webpackUniversalModuleDefinition(root, factory) {
	// if(typeof exports === 'object' && typeof module === 'object')
	// 	module.exports = factory();
	// else if(typeof define === 'function' && define.amd)
	// 	define([], factory);
	// else if(typeof exports === 'object')
	// 	exports["Default"] = factory();
	// else
	root["ColorPicker"] = root["ColorPicker"] || {},
  root["ColorPicker"]["Default"] = factory("./src/ts/default-picker.ts"),
  root["tinycolor"] = factory("./node_modules/tinycolor2/tinycolor.js");
  
})(window, function(module_name) {
  return  (function(modules) { // webpackBootstrap
   	// The module cache
   	var installedModules = {};

   	// The require function
   	function __webpack_require__(moduleId) {

   		// Check if module is in cache
   		if(installedModules[moduleId]) {
   			return installedModules[moduleId].exports;
   		}
   		// Create a new module (and put it into the cache)
   		var module = installedModules[moduleId] = {
   			i: moduleId,
   			l: false,
   			exports: {}
   		};

   		// Execute the module function
   		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

   		// Flag the module as loaded
   		module.l = true;

   		// Return the exports of the module
   		return module.exports;
   	}


   	// expose the modules object (__webpack_modules__)
   	__webpack_require__.m = modules;

   	// expose the module cache
   	__webpack_require__.c = installedModules;

   	// define getter function for harmony exports
   	__webpack_require__.d = function(exports, name, getter) {
   		if(!__webpack_require__.o(exports, name)) {
   			Object.defineProperty(exports, name, { enumerable: true, get: getter });
   		}
   	};

   	// define __esModule on exports
   	__webpack_require__.r = function(exports) {
   		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
   			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
   		}
   		Object.defineProperty(exports, '__esModule', { value: true });
   	};

   	// create a fake namespace object
   	// mode & 1: value is a module id, require it
   	// mode & 2: merge all properties of value into the ns
   	// mode & 4: return value when already ns object
   	// mode & 8|1: behave like require
   	__webpack_require__.t = function(value, mode) {
   		if(mode & 1) value = __webpack_require__(value);
   		if(mode & 8) return value;
   		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
   		var ns = Object.create(null);
   		__webpack_require__.r(ns);
   		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
   		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
   		return ns;
   	};

   	// getDefaultExport function for compatibility with non-harmony modules
   	__webpack_require__.n = function(module) {
   		var getter = module && module.__esModule ?
   			function getDefault() { return module['default']; } :
   			function getModuleExports() { return module; };
   		__webpack_require__.d(getter, 'a', getter);
   		return getter;
   	};

   	// Object.prototype.hasOwnProperty.call
   	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

   	// __webpack_public_path__
   	__webpack_require__.p = "";


   	// Load entry module and return exports
   	return __webpack_require__(__webpack_require__.s = module_name);
  })
/************************************************************************/
({



/***/ "./node_modules/deepmerge/dist/umd.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/umd.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(global, factory) {
    true ? module.exports = factory() : undefined;
}(this, (function() {
    'use strict';
    var isMergeableObject = function isMergeableObject(value) {
        return isNonNullObject(value) && !isSpecial(value)
    };

    function isNonNullObject(value) {
        return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
        var stringValue = Object.prototype.toString.call(value);
        return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value)
    }
    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
        return Array.isArray(val) ? [] : {}
    }

    function cloneUnlessOtherwiseSpecified(value, optionsArgument) {
        var clone = !optionsArgument || optionsArgument.clone !== false;
        return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
    }

    function defaultArrayMerge(target, source, optionsArgument) {
        return target.concat(source).map(function(element) {
            return cloneUnlessOtherwiseSpecified(element, optionsArgument)
        })
    }

    function mergeObject(target, source, optionsArgument) {
        var destination = {};
        if (isMergeableObject(target)) {
            Object.keys(target).forEach(function(key) {
                destination[key] = cloneUnlessOtherwiseSpecified(target[key], optionsArgument);
            });
        }
        Object.keys(source).forEach(function(key) {
            if (!isMergeableObject(source[key]) || !target[key]) {
                destination[key] = cloneUnlessOtherwiseSpecified(source[key], optionsArgument);
            } else {
                destination[key] = deepmerge(target[key], source[key], optionsArgument);
            }
        });
        return destination
    }

    function deepmerge(target, source, optionsArgument) {
        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var options = optionsArgument || {
            arrayMerge: defaultArrayMerge
        };
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
        if (!sourceAndTargetTypesMatch) {
            return cloneUnlessOtherwiseSpecified(source, optionsArgument)
        } else if (sourceIsArray) {
            var arrayMerge = options.arrayMerge || defaultArrayMerge;
            return arrayMerge(target, source, optionsArgument)
        } else {
            return mergeObject(target, source, optionsArgument)
        }
    }
    deepmerge.all = function deepmergeAll(array, optionsArgument) {
        if (!Array.isArray(array)) {
            throw new Error('first argument should be an array')
        }
        return array.reduce(function(prev, next) {
            return deepmerge(prev, next, optionsArgument)
        }, {})
    };
    var deepmerge_1 = deepmerge;
    return deepmerge_1;
})));
//# sourceURL=webpack://ColorPicker.Default/./node_modules/deepmerge/dist/umd.js?

/***/ }),


/***/ "./node_modules/nearest-color/nearestColor.js":

/*!****************************************************!*\
  !*** ./node_modules/nearest-color/nearestColor.js ***!
  \****************************************************/
/*! no static exports found */
/***/
(function(module, exports, __webpack_require__) {
  /* WEBPACK VAR INJECTION */
  (function(module) {
    (function(context) {
      /**
       * Defines an available color.
       *
       * @typedef {Object} ColorSpec
       * @property {string=} name A name for the color, e.g., 'red'
       * @property {string} source The hex-based color string, e.g., '#FF0'
       * @property {RGB} rgb The {@link RGB} color values
       */
      /**
       * Describes a matched color.
       *
       * @typedef {Object} ColorMatch
       * @property {string} name The name of the matched color, e.g., 'red'
       * @property {string} value The hex-based color string, e.g., '#FF0'
       * @property {RGB} rgb The {@link RGB} color values.
       */
      /**
       * Provides the RGB breakdown of a color.
       *
       * @typedef {Object} RGB
       * @property {number} r The red component, from 0 to 255
       * @property {number} g The green component, from 0 to 255
       * @property {number} b The blue component, from 0 to 255
       */
      /**
       * Gets the nearest color, from the given list of {@link ColorSpec} objects
       * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
       *
       * Probably you wouldn't call this method directly. Instead you'd get a custom
       * color matcher by calling {@link nearestColor.from}.
       *
       * @public
       * @param {RGB|string} needle Either an {@link RGB} color or a hex-based
       *     string representing one, e.g., '#FF0'
       * @param {Array.<ColorSpec>=} colors An optional list of available colors
       *     (defaults to {@link nearestColor.DEFAULT_COLORS})
       * @return {ColorMatch|string} If the colors in the provided list had names,
       *     then a {@link ColorMatch} object with the name and (hex) value of the
       *     nearest color from the list. Otherwise, simply the hex value.
       *
       * @example
       * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
       * nearestColor('#f11');                   // => '#f00'
       * nearestColor('#f88');                   // => '#f80'
       * nearestColor('#ffe');                   // => '#ff0'
       * nearestColor('#efe');                   // => '#ff0'
       * nearestColor('#abc');                   // => '#808'
       * nearestColor('red');                    // => '#f00'
       * nearestColor('foo');                    // => throws
       */
      function nearestColor(needle, colors) {
        needle = parseColor(needle);
        if (!needle) {
          return null;
        }
        var distanceSq,
          minDistanceSq = Infinity,
          rgb,
          value;
        colors || (colors = nearestColor.DEFAULT_COLORS);
        for (var i = 0; i < colors.length; ++i) {
          rgb = colors[i].rgb;
          distanceSq = (Math.pow(needle.r - rgb.r, 2) + Math.pow(needle.g - rgb.g, 2) + Math.pow(needle.b - rgb.b, 2));
          if (distanceSq < minDistanceSq) {
            minDistanceSq = distanceSq;
            value = colors[i];
          }
        }
        if (value.name) {
          return {
            name: value.name,
            value: value.source,
            rgb: value.rgb,
            distance: Math.sqrt(minDistanceSq)
          };
        }
        return value.source;
      }
      /**
       * Provides a matcher to find the nearest color based on the provided list of
       * available colors.
       *
       * @public
       * @param {Array.<string>|Object} availableColors An array of hex-based color
       *     strings, or an object mapping color *names* to hex values.
       * @return {function(string):ColorMatch|string} A function with the same
       *     behavior as {@link nearestColor}, but with the list of colors
       *     predefined.
       *
       * @example
       * var colors = {
       *   'maroon': '#800',
       *   'light yellow': { r: 255, g: 255, b: 51 },
       *   'pale blue': '#def',
       *   'white': 'fff'
       * };
       *
       * var bgColors = [
       *   '#eee',
       *   '#444'
       * ];
       *
       * var invalidColors = {
       *   'invalid': 'foo'
       * };
       *
       * var getColor = nearestColor.from(colors);
       * var getBGColor = getColor.from(bgColors);
       * var getAnyColor = nearestColor.from(colors).or(bgColors);
       *
       * getColor('ffe');
       * // => { name: 'white', value: 'fff', rgb: { r: 255, g: 255, b: 255 }, distance: 17}
       *
       * getColor('#f00');
       * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
       *
       * getColor('#ff0');
       * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
       *
       * getBGColor('#fff'); // => '#eee'
       * getBGColor('#000'); // => '#444'
       *
       * getAnyColor('#f00');
       * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
       *
       * getAnyColor('#888'); // => '#444'
       *
       * nearestColor.from(invalidColors); // => throws
       */
      nearestColor.from = function from(availableColors) {
        var colors = mapColors(availableColors),
          nearestColorBase = nearestColor;
        var matcher = function nearestColor(hex) {
          return nearestColorBase(hex, colors);
        };
        // Keep the 'from' method, to support changing the list of available colors
        // multiple times without needing to keep a reference to the original
        // nearestColor function.
        matcher.from = from;
        // Also provide a way to combine multiple color lists.
        matcher.or = function or(alternateColors) {
          var extendedColors = colors.concat(mapColors(alternateColors));
          return nearestColor.from(extendedColors);
        };
        return matcher;
      };
      /**
       * Given either an array or object of colors, returns an array of
       * {@link ColorSpec} objects (with {@link RGB} values).
       *
       * @private
       * @param {Array.<string>|Object} colors An array of hex-based color strings, or
       *     an object mapping color *names* to hex values.
       * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
       *     representing the same colors passed in.
       */
      function mapColors(colors) {
        if (colors instanceof Array) {
          return colors.map(function(color) {
            return createColorSpec(color);
          });
        }
        return Object.keys(colors).map(function(name) {
          return createColorSpec(colors[name], name);
        });
      };
      /**
       * Parses a color from a string.
       *
       * @private
       * @param {RGB|string} source
       * @return {RGB}
       *
       * @example
       * parseColor({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
       * parseColor('#f00');                  // => { r: 255, g: 0, b: 0 }
       * parseColor('#04fbc8');               // => { r: 4, g: 251, b: 200 }
       * parseColor('#FF0');                  // => { r: 255, g: 255, b: 0 }
       * parseColor('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
       * parseColor('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
       * parseColor('aqua');                  // => { r: 0, g: 255, b: 255 }
       * parseColor('fff');                   // => { r: 255, g: 255, b: 255 }
       * parseColor('foo');                   // => throws
       */
      function parseColor(source) {
        var red, green, blue;
        if (typeof source === 'object') {
          return source;
        }
        if (source in nearestColor.STANDARD_COLORS) {
          return parseColor(nearestColor.STANDARD_COLORS[source]);
        }
        var hexMatch = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);
        if (hexMatch) {
          hexMatch = hexMatch[1];
          if (hexMatch.length === 3) {
            hexMatch = [
              hexMatch.charAt(0) + hexMatch.charAt(0),
              hexMatch.charAt(1) + hexMatch.charAt(1),
              hexMatch.charAt(2) + hexMatch.charAt(2)
            ];
          } else {
            hexMatch = [
              hexMatch.substring(0, 2),
              hexMatch.substring(2, 4),
              hexMatch.substring(4, 6)
            ];
          }
          red = parseInt(hexMatch[0], 16);
          green = parseInt(hexMatch[1], 16);
          blue = parseInt(hexMatch[2], 16);
          return {
            r: red,
            g: green,
            b: blue
          };
        }
        var rgbMatch = source.match(/^rgb\\(\\s*(\\d{1,3}%?),\\s*(\\d{1,3}%?),\\s*(\\d{1,3}%?)\\s*\\)$/i);
        if (rgbMatch) {
          red = parseComponentValue(rgbMatch[1]);
          green = parseComponentValue(rgbMatch[2]);
          blue = parseComponentValue(rgbMatch[3]);
          return {
            r: red,
            g: green,
            b: blue
          };
        }
        throw Error('"' + source + '" is not a valid color');
      }
      /**
       * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
       *
       * @private
       * @param {string|RGB} input
       * @param {string=} name
       * @return {ColorSpec}
       *
       * @example
       * createColorSpec('#800'); // => {
       *   source: '#800',
       *   rgb: { r: 136, g: 0, b: 0 }
       * }
       *
       * createColorSpec('#800', 'maroon'); // => {
       *   name: 'maroon',
       *   source: '#800',
       *   rgb: { r: 136, g: 0, b: 0 }
       * }
       */
      function createColorSpec(input, name) {
        var color = {};
        if (name) {
          color.name = name;
        }
        if (typeof input === 'string') {
          color.source = input;
          color.rgb = parseColor(input);
        } else if (typeof input === 'object') {
          // This is for if/when we're concatenating lists of colors.
          if (input.source) {
            return createColorSpec(input.source, input.name);
          }
          color.rgb = input;
          color.source = rgbToHex(input);
        }
        return color;
      }
      /**
       * Parses a value between 0-255 from a string.
       *
       * @private
       * @param {string} string
       * @return {number}
       *
       * @example
       * parseComponentValue('100');  // => 100
       * parseComponentValue('100%'); // => 255
       * parseComponentValue('50%');  // => 128
       */
      function parseComponentValue(string) {
        if (string.charAt(string.length - 1) === '%') {
          return Math.round(parseInt(string, 10) * 255 / 100);
        }
        return Number(string);
      }
      /**
       * Converts an {@link RGB} color to its hex representation.
       *
       * @private
       * @param {RGB} rgb
       * @return {string}
       *
       * @example
       * rgbToHex({ r: 255, g: 128, b: 0 }); // => '#ff8000'
       */
      function rgbToHex(rgb) {
        return '#' + leadingZero(rgb.r.toString(16)) + leadingZero(rgb.g.toString(16)) + leadingZero(rgb.b.toString(16));
      }
      /**
       * Puts a 0 in front of a numeric string if it's only one digit. Otherwise
       * nothing (just returns the value passed in).
       *
       * @private
       * @param {string} value
       * @return
       *
       * @example
       * leadingZero('1');  // => '01'
       * leadingZero('12'); // => '12'
       */
      function leadingZero(value) {
        if (value.length === 1) {
          value = '0' + value;
        }
        return value;
      }
      /**
       * A map from the names of standard CSS colors to their hex values.
       */
      nearestColor.STANDARD_COLORS = {
        aqua: '#0ff',
        black: '#000',
        blue: '#00f',
        fuchsia: '#f0f',
        gray: '#808080',
        green: '#008000',
        lime: '#0f0',
        maroon: '#800000',
        navy: '#000080',
        olive: '#808000',
        orange: '#ffa500',
        purple: '#800080',
        red: '#f00',
        silver: '#c0c0c0',
        teal: '#008080',
        white: '#fff',
        yellow: '#ff0'
      };
      /**
       * Default colors. Comprises the colors of the rainbow (good ol' ROY G. BIV).
       * This list will be used for calls to {@nearestColor} that don't specify a list
       * of available colors to match.
       */
      nearestColor.DEFAULT_COLORS = mapColors(['#f00', // r
        '#f80', // o
        '#ff0', // y
        '#0f0', // g
        '#00f', // b
        '#008', // i
        '#808' // v
      ]);
      nearestColor.VERSION = '0.4.4';
      if (typeof module === 'object' && module && module.exports) {
        module.exports = nearestColor;
      } else {
        context.nearestColor = nearestColor;
      }
    }(this));
    /* WEBPACK VAR INJECTION */
  }.call(this, __webpack_require__( /*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))
  //# sourceURL=webpack://ColorPicker.Default/./node_modules/nearest-color/nearestColor.js?");
  /***/
}),

/***/

"./node_modules/tinycolor2/tinycolor.js":
/*!**********************************************!*\
!*** ./node_modules/tinycolor2/tinycolor.js ***!
\**********************************************/
/*! no static exports found */
/***/
(function(module, exports, __webpack_require__) {
  var __WEBPACK_AMD_DEFINE_RESULT__;// TinyColor v1.4.1
  // https://github.com/bgrins/TinyColor
  // Brian Grinstead, MIT License
  (function(Math) {
    var trimLeft = /^\\s+/,
    trimRight = /\\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

    function tinycolor(color, opts) {
      color = (color) ? color : '';
      opts = opts || {};
      // If input is already a tinycolor, return itself
      if (color instanceof tinycolor) {
        return color;
      }
      // If we are called as a function, call using new instead
      if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
      }
      var rgb = inputToRGB(color);
      this._originalInput = color,
        this._r = rgb.r,
        this._g = rgb.g,
        this._b = rgb.b,
        this._a = rgb.a,
        this._roundA = mathRound(100 * this._a) / 100,
        this._format = opts.format || rgb.format;
      this._gradientType = opts.gradientType;
      // Don't let the range of [0,255] come back in [0,1].
      // Potentially lose a little bit of precision here, but will fix issues where
      // .5 gets interpreted as half of the total, instead of half of 1
      // If it was supposed to be 128, this was already taken care of by `inputToRgb`
      if (this._r < 1) {
        this._r = mathRound(this._r);
      }
      if (this._g < 1) {
        this._g = mathRound(this._g);
      }
      if (this._b < 1) {
        this._b = mathRound(this._b);
      }
      this._ok = rgb.ok;
      this._tc_id = tinyCounter++;
    }
    tinycolor.prototype = {
    isDark: function() {
      return this.getBrightness() < 128;
    },
    isLight: function() {
      return !this.isDark();
    },
    isValid: function() {
      return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
      return this._format;
    },
    getAlpha: function() {
      return this._a;
    },
    getBrightness: function() {
      //http://www.w3.org/TR/AERT#color-contrast
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
      //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
      var rgb = this.toRgb();
      var RsRGB, GsRGB, BsRGB, R, G, B;
      RsRGB = rgb.r / 255;
      GsRGB = rgb.g / 255;
      BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
      } else {
      R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);
      }
      if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
      } else {
      G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);
      }
      if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
      } else {
      B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);
      }
      return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
      this._a = boundAlpha(value);
      this._roundA = mathRound(100 * this._a) / 100;
      return this;
    },
    toHsv: function() {
      var hsv = rgbToHsv(this._r, this._g, this._b);
      return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v,
      a: this._a
      };
    },
    toHsvString: function() {
      var hsv = rgbToHsv(this._r, this._g, this._b);
      var h = mathRound(hsv.h * 360),
      s = mathRound(hsv.s * 100),
      v = mathRound(hsv.v * 100);
      return (this._a == 1) ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
    },
    toHsl: function() {
      var hsl = rgbToHsl(this._r, this._g, this._b);
      return {
      h: hsl.h * 360,
      s: hsl.s,
      l: hsl.l,
      a: this._a
      };
    },
    toHslString: function() {
      var hsl = rgbToHsl(this._r, this._g, this._b);
      var h = mathRound(hsl.h * 360),
      s = mathRound(hsl.s * 100),
      l = mathRound(hsl.l * 100);
      return (this._a == 1) ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
    },
    toHex: function(allow3Char) {
      return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
      return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
      return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
      return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
      return {
      r: mathRound(this._r),
      g: mathRound(this._g),
      b: mathRound(this._b),
      a: this._a
      };
    },
    toRgbString: function() {
      return (this._a == 1) ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
      return {
      r: mathRound(bound01(this._r, 255) * 100) + "%",
      g: mathRound(bound01(this._g, 255) * 100) + "%",
      b: mathRound(bound01(this._b, 255) * 100) + "%",
      a: this._a
      };
    },
    toPercentageRgbString: function() {
      return (this._a == 1) ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
      if (this._a === 0) {
      return "transparent";
      }
      if (this._a < 1) {
      return false;
      }
      return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
      var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
      var secondHex8String = hex8String;
      var gradientType = this._gradientType ? "GradientType = 1, " : "";
      if (secondColor) {
      var s = tinycolor(secondColor);
      secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
      }
      return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
    },
    toString: function(format) {
      var formatSet = !!format;
      format = format || this._format;
      var formattedString = false;
      var hasAlpha = this._a < 1 && this._a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
      if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === "name" && this._a === 0) {
        return this.toName();
      }
      return this.toRgbString();
      }
      if (format === "rgb") {
      formattedString = this.toRgbString();
      }
      if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
      }
      if (format === "hex3") {
      formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
      formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
      formattedString = this.toHex8String();
      }
      if (format === "name") {
      formattedString = this.toName();
      }
      if (format === "hsl") {
      formattedString = this.toHslString();
      }
      if (format === "hsv") {
      formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    },
    clone: function() {
      return tinycolor(this.toString());
    },
    _applyModification: function(fn, args) {
      var color = fn.apply(null, [this].concat([].slice.call(args)));
      this._r = color._r;
      this._g = color._g;
      this._b = color._b;
      this.setAlpha(color._a);
      return this;
    },
    lighten: function() {
      return this._applyModification(lighten, arguments);
    },
    brighten: function() {
      return this._applyModification(brighten, arguments);
    },
    darken: function() {
      return this._applyModification(darken, arguments);
    },
    desaturate: function() {
      return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
      return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
      return this._applyModification(greyscale, arguments);
    },
    spin: function() {
      return this._applyModification(spin, arguments);
    },
    _applyCombination: function(fn, args) {
      return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
      return this._applyCombination(analogous, arguments);
    },
    complement: function() {
      return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
      return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
      return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
      return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
      return this._applyCombination(tetrad, arguments);
    }
    };
    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
      if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
          if (color.hasOwnProperty(i)) {
            if (i === "a") {
            newColor[i] = color[i];
            } else {
            newColor[i] = convertToPercentage(color[i]);
            }
          }
        }
        color = newColor;
      }
      return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {
      var rgb = {
        r: 0,
        g: 0,
        b: 0
      };
      var a = 1;
      var s = null;
      var v = null;
      var l = null;
      var ok = false;
      var format = false;
      if (typeof color == "string") {
        color = stringInputToObject(color);
      }
      if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
        } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format = "hsl";
        }
        if (color.hasOwnProperty("a")) {
        a = color.a;
        }
      }
      a = boundAlpha(a);
      return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
      };
    }

    // Conversion Functions
    // --------------------
    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b) {
      return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
      };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {
      r = bound01(r, 255);
      g = bound01(g, 255);
      b = bound01(b, 255);
      var max = mathMax(r, g, b),
        min = mathMin(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        }
        h /= 6;
      }
      return {
        h: h,
        s: s,
        l: l
      };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
      var r, g, b;
      h = bound01(h, 360);
      s = bound01(s, 100);
      l = bound01(l, 100);

      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return {
        r: r * 255,
        g: g * 255,
        b: b * 255
      };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {
      r = bound01(r, 255);
      g = bound01(g, 255);
      b = bound01(b, 255);
      var max = mathMax(r, g, b),
        min = mathMin(r, g, b);
      var h, s, v = max;
      var d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max == min) {
        h = 0; // achromatic
      } else {
        switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        }
        h /= 6;
      }
      return {
        h: h,
        s: s,
        v: v
      };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hsvToRgb(h, s, v) {
      h = bound01(h, 360) * 6;
      s = bound01(s, 100);
      v = bound01(v, 100);
      var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];
      return {
        r: r * 255,
        g: g * 255,
        b: b * 255
      };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {
      var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
      ];
      // Return a 3 character hex if possible
      if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
      }
      return hex.join("");
    }

    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b are contained in the set [0, 255] and
    // a in [0, 1]. Returns a 4 or 8 character rgba hex
    function rgbaToHex(r, g, b, a, allow4Char) {
      var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
      ];
      // Return a 4 character hex if possible
      if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
      }
      return hex.join("");
    }

    // `rgbaToArgbHex`
    // Converts an RGBA color to an ARGB Hex8 string
    // Rarely used, but required for "toFilter()"
    function rgbaToArgbHex(r, g, b, a) {
      var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
      ];
      return hex.join("");
    }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function(color1, color2) {
      if (!color1 || !color2) {
        return false;
      }
      return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };

    tinycolor.random = function() {
      return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
      });
    };

    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
    function desaturate(color, amount) {
      placeholdersAmountnt = (amount === 0) ? 0 : (amount || 10);
      var hsl = tinycolor(color).toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return tinycolor(hsl);
    }

    function saturate(color, amount) {
      amount = (amount === 0) ? 0 : (amount || 10);
      var hsl = tinycolor(color).toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return tinycolor(hsl);
    }

    function greyscale(color) {
      return tinycolor(color).desaturate(100);
    }

    function lighten(color, amount) {
      amount = (amount === 0) ? 0 : (amount || 10);
      var hsl = tinycolor(color).toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return tinycolor(hsl);
    }

    function brighten(color, amount) {
      amount = (amount === 0) ? 0 : (amount || 10);
      var rgb = tinycolor(color).toRgb();
      rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
      rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
      rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
      return tinycolor(rgb);
    }

    function darken(color, amount) {
      amount = (amount === 0) ? 0 : (amount || 10);
      var hsl = tinycolor(color).toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return tinycolor(hsl);
    }
    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
      var hsl = tinycolor(color).toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
    function complement(color) {
      var hsl = tinycolor(color).toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return tinycolor(hsl);
    }

    function triad(color) {
      var hsl = tinycolor(color).toHsl();
      var h = hsl.h;
      return [
        tinycolor(color),
        tinycolor({
        h: (h + 120) % 360,
        s: hsl.s,
        l: hsl.l
        }),
        tinycolor({
        h: (h + 240) % 360,
        s: hsl.s,
        l: hsl.l
        })
      ];
    }

    function tetrad(color) {
      var hsl = tinycolor(color).toHsl();
      var h = hsl.h;
      return [
        tinycolor(color),
        tinycolor({
        h: (h + 90) % 360,
        s: hsl.s,
        l: hsl.l
        }),
        tinycolor({
        h: (h + 180) % 360,
        s: hsl.s,
        l: hsl.l
        }),
        tinycolor({
        h: (h + 270) % 360,
        s: hsl.s,
        l: hsl.l
        })
      ];
    }

    function splitcomplement(color) {
      var hsl = tinycolor(color).toHsl();
      var h = hsl.h;
      return [
        tinycolor(color),
        tinycolor({
        h: (h + 72) % 360,
        s: hsl.s,
        l: hsl.l
        }),
        tinycolor({
        h: (h + 216) % 360,
        s: hsl.s,
        l: hsl.l
        })
      ];
    }

    function analogous(color, results, slices) {
      results = results || 6;
      slices = slices || 30;
      var hsl = tinycolor(color).toHsl();
      var part = 360 / slices;
      var ret = [tinycolor(color)];
      for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
      }
      return ret;
    }

    function monochromatic(color, results) {
      results = results || 6;
      var hsv = tinycolor(color).toHsv();
      var h = hsv.h,
        s = hsv.s,
        v = hsv.v;
      var ret = [];
      var modification = 1 / results;
      while (results--) {
        ret.push(tinycolor({
        h: h,
        s: s,
        v: v
        }));
        v = (v + modification) % 1;
      }
      return ret;
    }

    // Utility Functions
    // ---------------------
    tinycolor.mix = function(color1, color2, amount) {
      amount = (amount === 0) ? 0 : (amount || 50);
      var rgb1 = tinycolor(color1).toRgb();
      var rgb2 = tinycolor(color2).toRgb();
      var p = amount / 100;
      var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
      };
      return tinycolor(rgba);
    };

    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
    // `contrast`
    // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
    tinycolor.readability = function(color1, color2) {
      var c1 = tinycolor(color1);
      var c2 = tinycolor(color2);
      return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
    };

    // `isReadable`
    // Ensure that foreground and background color combinations meet WCAG2 guidelines.
    // The third argument is an optional Object.
    //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
    //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
    // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
    tinycolor.isReadable = function(color1, color2, wcag2) {
      var readability = tinycolor.readability(color1, color2);
      var wcag2Parms, out;
      out = false;
      wcag2Parms = validateWCAG2Parms(wcag2);
      switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
        out = readability >= 4.5;
        break;
        case "AAlarge":
        out = readability >= 3;
        break;
        case "AAAsmall":
        out = readability >= 7;
        break;
      }
      return out;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // Optionally returns Black or White if the most readable color is unreadable.
    // *Example*
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
    tinycolor.mostReadable = function(baseColor, colorList, args) {
      var bestColor = null;
      var bestScore = 0;
      var readability;
      var includeFallbackColors, level, size;
      args = args || {};
      includeFallbackColors = args.includeFallbackColors;
      level = args.level;
      size = args.size;
      for (var i = 0; i < colorList.length; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
        bestScore = readability;
        bestColor = tinycolor(colorList[i]);
        }
      }
      if (tinycolor.isReadable(baseColor, bestColor, {
        "level": level,
        "size": size
        }) || !includeFallbackColors) {
        return bestColor;
      } else {
        args.includeFallbackColors = false;
        return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
      }
    };

    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
      aliceblue: "f0f8ff",
      antiquewhite: "faebd7",
      aqua: "0ff",
      aquamarine: "7fffd4",
      azure: "f0ffff",
      beige: "f5f5dc",
      bisque: "ffe4c4",
      black: "000",
      blanchedalmond: "ffebcd",
      blue: "00f",
      blueviolet: "8a2be2",
      brown: "a52a2a",
      burlywood: "deb887",
      burntsienna: "ea7e5d",
      cadetblue: "5f9ea0",
      chartreuse: "7fff00",
      chocolate: "d2691e",
      coral: "ff7f50",
      cornflowerblue: "6495ed",
      cornsilk: "fff8dc",
      crimson: "dc143c",
      cyan: "0ff",
      darkblue: "00008b",
      darkcyan: "008b8b",
      darkgoldenrod: "b8860b",
      darkgray: "a9a9a9",
      darkgreen: "006400",
      darkgrey: "a9a9a9",
      darkkhaki: "bdb76b",
      darkmagenta: "8b008b",
      darkolivegreen: "556b2f",
      darkorange: "ff8c00",
      darkorchid: "9932cc",
      darkred: "8b0000",
      darksalmon: "e9967a",
      darkseagreen: "8fbc8f",
      darkslateblue: "483d8b",
      darkslategray: "2f4f4f",
      darkslategrey: "2f4f4f",
      darkturquoise: "00ced1",
      darkviolet: "9400d3",
      deeppink: "ff1493",
      deepskyblue: "00bfff",
      dimgray: "696969",
      dimgrey: "696969",
      dodgerblue: "1e90ff",
      firebrick: "b22222",
      floralwhite: "fffaf0",
      forestgreen: "228b22",
      fuchsia: "f0f",
      gainsboro: "dcdcdc",
      ghostwhite: "f8f8ff",
      gold: "ffd700",
      goldenrod: "daa520",
      gray: "808080",
      green: "008000",
      greenyellow: "adff2f",
      grey: "808080",
      honeydew: "f0fff0",
      hotpink: "ff69b4",
      indianred: "cd5c5c",
      indigo: "4b0082",
      ivory: "fffff0",
      khaki: "f0e68c",
      lavender: "e6e6fa",
      lavenderblush: "fff0f5",
      lawngreen: "7cfc00",
      lemonchiffon: "fffacd",
      lightblue: "add8e6",
      lightcoral: "f08080",
      lightcyan: "e0ffff",
      lightgoldenrodyellow: "fafad2",
      lightgray: "d3d3d3",
      lightgreen: "90ee90",
      lightgrey: "d3d3d3",
      lightpink: "ffb6c1",
      lightsalmon: "ffa07a",
      lightseagreen: "20b2aa",
      lightskyblue: "87cefa",
      lightslategray: "789",
      lightslategrey: "789",
      lightsteelblue: "b0c4de",
      lightyellow: "ffffe0",
      lime: "0f0",
      limegreen: "32cd32",
      linen: "faf0e6",
      magenta: "f0f",
      maroon: "800000",
      mediumaquamarine: "66cdaa",
      mediumblue: "0000cd",
      mediumorchid: "ba55d3",
      mediumpurple: "9370db",
      mediumseagreen: "3cb371",
      mediumslateblue: "7b68ee",
      mediumspringgreen: "00fa9a",
      mediumturquoise: "48d1cc",
      mediumvioletred: "c71585",
      midnightblue: "191970",
      mintcream: "f5fffa",
      mistyrose: "ffe4e1",
      moccasin: "ffe4b5",
      navajowhite: "ffdead",
      navy: "000080",
      oldlace: "fdf5e6",
      olive: "808000",
      olivedrab: "6b8e23",
      orange: "ffa500",
      orangered: "ff4500",
      orchid: "da70d6",
      palegoldenrod: "eee8aa",
      palegreen: "98fb98",
      paleturquoise: "afeeee",
      palevioletred: "db7093",
      papayawhip: "ffefd5",
      peachpuff: "ffdab9",
      peru: "cd853f",
      pink: "ffc0cb",
      plum: "dda0dd",
      powderblue: "b0e0e6",
      purple: "800080",
      rebeccapurple: "663399",
      red: "f00",
      rosybrown: "bc8f8f",
      royalblue: "4169e1",
      saddlebrown: "8b4513",
      salmon: "fa8072",
      sandybrown: "f4a460",
      seagreen: "2e8b57",
      seashell: "fff5ee",
      sienna: "a0522d",
      silver: "c0c0c0",
      skyblue: "87ceeb",
      slateblue: "6a5acd",
      slategray: "708090",
      slategrey: "708090",
      snow: "fffafa",
      springgreen: "00ff7f",
      steelblue: "4682b4",
      tan: "d2b48c",
      teal: "008080",
      thistle: "d8bfd8",
      tomato: "ff6347",
      turquoise: "40e0d0",
      violet: "ee82ee",
      wheat: "f5deb3",
      white: "fff",
      whitesmoke: "f5f5f5",
      yellow: "ff0",
      yellowgreen: "9acd32"
    };
    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);
    // Utilities
    // ---------
    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
      var flipped = {};
      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          flipped[o[i]] = i;
        }
      }
      return flipped;
    }
    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
      a = parseFloat(a);
      if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
      }
      return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
      if (isOnePointZero(n)) {
        n = "100%";
      }
      var processPercent = isPercentage(n);
      n = mathMin(max, mathMax(0, parseFloat(n)));
      // Automatically convert percentage into number
      if (processPercent) {
        n = parseInt(n * max, 10) / 100;
      }
      // Handle floating point rounding errors
      if ((Math.abs(n - max) < 0.000001)) {
        return 1;
      }
      // Convert into [0, 1] range if it isn't already
      return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
      return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
      return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
      return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
      return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
      return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
      if (n <= 1) {
        n = (n * 100) + "%";
      }
      return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
      return Math.round(parseFloat(d) * 255).toString(16);
    }

    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
      return (parseIntFromHex(h) / 255);
    }

    var matchers = (function() {
      // <http://www.w3.org/TR/css3-values/#integers>
      var CSS_INTEGER = "[-\\+]?\\d+%?";
      // <http://www.w3.org/TR/css3-values/#number-value>
      var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
      // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
      var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
      // Actual matching.
      // Parentheses and commas are optional, but not required.
      // Whitespace can take the place of commas or opening paren
      var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
      var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
      return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
      };
    })();

    // `isValidCSSUnit`
    // Take in a single string / number and check to see if it looks like a CSS unit
    // (see `matchers` above for definition).
    function isValidCSSUnit(color) {
      return !!matchers.CSS_UNIT.exec(color);
    }

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {
      color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
      var named = false;
      if (names[color]) {
        color = names[color];
        named = true;
      } else if (color == 'transparent') {
        return {
          r: 0,
          g: 0,
          b: 0,
          a: 0,
          format: "name"
        };
      }
      // Try to match string input using regular expressions.
      // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
      // Just return an object and let the conversion functions handle that.
      // This way the result will be the same whether the tinycolor is initialized with string or object.
      var match;
      if ((match = matchers.rgb.exec(color))) {
        return {
        r: match[1],
        g: match[2],
        b: match[3]
        };
      }
      if ((match = matchers.rgba.exec(color))) {
        return {
        r: match[1],
        g: match[2],
        b: match[3],
        a: match[4]
        };
      }
      if ((match = matchers.hsl.exec(color))) {
        return {
        h: match[1],
        s: match[2],
        l: match[3]
        };
      }
      if ((match = matchers.hsla.exec(color))) {
        return {
        h: match[1],
        s: match[2],
        l: match[3],
        a: match[4]
        };
      }
      if ((match = matchers.hsv.exec(color))) {
        return {
        h: match[1],
        s: match[2],
        v: match[3]
        };
      }
      if ((match = matchers.hsva.exec(color))) {
        return {
        h: match[1],
        s: match[2],
        v: match[3],
        a: match[4]
        };
      }
      if ((match = matchers.hex8.exec(color))) {
        return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
        };
      }
      if ((match = matchers.hex6.exec(color))) {
        return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
        };
      }
      if ((match = matchers.hex4.exec(color))) {
        return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3]),
        a: convertHexToDecimal(match[4] + '' + match[4]),
        format: named ? "name" : "hex8"
        };
      }
      if ((match = matchers.hex3.exec(color))) {
        return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3]),
        format: named ? "name" : "hex"
        };
      }
      return false;
    }

    function validateWCAG2Parms(parms) {
      // return valid WCAG2 parms for isReadable.
      // If input parms are invalid, return {"level":"AA", "size":"small"}
      var level, size;
      parms = parms || {
        "level": "AA",
        "size": "small"
      };
      level = (parms.level || "AA").toUpperCase();
      size = (parms.size || "small").toLowerCase();
      if (level !== "AA" && level !== "AAA") {
        level = "AA";
      }
      if (size !== "small" && size !== "large") {
        size = "small";
      }
      return {
        "level": level,
        "size": size
      };
    }

    // Node: Export function
    if (typeof module !== "undefined" && module.exports) {
      module.exports = tinycolor;
    }

    // AMD/requirejs: Define the module
    else if (true) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return tinycolor;
      }).call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }

    // Browser: Expose to window
    else {}
  })(Math);

//# sourceURL=webpack://ColorPicker.Default/./node_modules/tinycolor2/tinycolor.js?");
/***/
}),

/***/

"./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
!*** (webpack)/buildin/module.js ***!
\***********************************/
/*! no static exports found */

/***/

(function(module, exports) {
  module.exports = function(module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function() {};
    module.paths = [];
    // module.parent = undefined by default
    if (!module.children) module.children = [];
    Object.defineProperty(module, "loaded", {
    enumerable: true,
    get: function() {
      return module.l;
    }
    });
    Object.defineProperty(module, "id", {
    enumerable: true,
    get: function() {
      return module.i;
    }
    });
    module.webpackPolyfill = 1;
  }
  return module;
  };
  //# sourceURL=webpack://ColorPicker.Default/(webpack)/buildin/module.js?");
  /***/
}),

/***/

"./src/ts/default-picker.ts":

/*!**********************************!*\
!*** ./src/ts/default-picker.ts ***!
\**********************************/
/*! no static exports found */
/***/
(function(module, exports, __webpack_require__) {
  "use strict";
  var __extends = (this && this.__extends) || (function() {
    var extendStatics = Object.setPrototypeOf || ({
      __proto__: []
      }
      instanceof Array && function(d, b) {
      d.__proto__ = b;
      }) || function(d, b) {
      for (var p in b)
      if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var colorpicker_1 = __webpack_require__( /*! ./model/colorpicker */ "./src/ts/model/colorpicker.ts");
  var color_1 = __webpack_require__( /*! ./model/color */ "./src/ts/model/color.ts");
  var tsdom_1 = __webpack_require__( /*! ./model/tsdom */ "./src/ts/model/tsdom.ts");
  var nearestColor = __webpack_require__( /*! nearest-color */ "./node_modules/nearest-color/nearestColor.js");
  var DefaultPicker = /** @class */ (function(_super) {
  __extends(DefaultPicker, _super);

  function DefaultPicker() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  DefaultPicker.prototype.buildLayout = function() {
    var _this = this;
    if (this.options.hexOnly) {
      this.options.history.placeholdersAmount = 9;
      this.options.format = 'hex';
    }
    this.picker = tsdom_1.TsDom.create('div').addClass('colorpicker').addClass('colorpicker-default').attr('id', this.id);
    var body = tsdom_1.TsDom.create('div').addClass('colorpicker-default__body'),
    footer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__info');
    if (this.options.hideInfo) {
      footer.addClass('colorpicker-default__info--hidden');
    }
    // build spectrum block
    this.spectrumContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__spectrum-container');
    this.spectrumCanvas = tsdom_1.TsDom.create('canvas').addClass('colorpicker-default__spectrum-canvas');
    this.spectrumCursor = tsdom_1.TsDom.create('div').addClass('colorpicker-default__spectrum-cursor');
    this.spectrumContainer.append(this.spectrumCanvas).append(this.spectrumCursor);
    // build hue block
    this.hueContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__hue-container');
    this.hueCanvas = tsdom_1.TsDom.create('canvas').addClass('colorpicker-default__hue-canvas');
    this.hueCursor = tsdom_1.TsDom.create('div').addClass('colorpicker-default__hue-cursor');
    this.hueContainer.append(this.hueCanvas).append(this.hueCursor);
    // build opacity block
    this.opacityContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__opacity-container');
    this.opacityCanvas = tsdom_1.TsDom.create('canvas').addClass('colorpicker-default__opacity-canvas');
    this.opacityCursor = tsdom_1.TsDom.create('div').addClass('colorpicker-default__opacity-cursor');
    // build hex input
    var hexInputContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__hex-input-container'),
    hexText = tsdom_1.TsDom.create('div').addClass('colorpicker-default__hex-text').text('hex');
    this.hexInput = tsdom_1.TsDom.create('input').addClass('colorpicker-default__hex-input').attr('maxlength', 7);
    hexInputContainer.append(this.hexInput).append(hexText);
    // build red input
    var rInputContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__r-input-container'),
    rText = tsdom_1.TsDom.create('div').addClass('colorpicker-default__r-text').text('r');
    this.rInput = tsdom_1.TsDom.create('input').addClass('colorpicker-default__r-input').attr('maxlength', 3);
    rInputContainer.append(this.rInput).append(rText);
    // build green input
    var gInputContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__g-input-container'),
    gText = tsdom_1.TsDom.create('div').addClass('colorpicker-default__g-text').text('g');
    this.gInput = tsdom_1.TsDom.create('input').addClass('colorpicker-default__g-input').attr('maxlength', 3);
    gInputContainer.append(this.gInput).append(gText);
    // build blue input
    var bInputContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__b-input-container'),
    bText = tsdom_1.TsDom.create('div').addClass('colorpicker-default__b-text').text('b');
    this.bInput = tsdom_1.TsDom.create('input').addClass('colorpicker-default__b-input').attr('maxlength', 3);
    bInputContainer.append(this.bInput).append(bText);
    // build opacity input
    var aInputContainer = tsdom_1.TsDom.create('div').addClass('colorpicker-default__a-input-container');
    this.aInput = tsdom_1.TsDom.create('input').addClass('colorpicker-default__a-input').attr('maxlength', 4);
    var aText = tsdom_1.TsDom.create('div').addClass('colorpicker-default__a-text').text('a');
    aInputContainer.append(this.aInput).append(aText);
    this.history = tsdom_1.TsDom.create('div').addClass('colorpicker-default__history');
    if (this.options.history.hidden) {
      this.history.addClass('is-hidden');
    }
    var addHistoryItem = tsdom_1.TsDom.create('div').addClass('colorpicker-default__history-item').addClass('is-add-new');
    this.history.append(addHistoryItem);
    this.options.history.colors.forEach(function(color) {
    var historyItem = tsdom_1.TsDom.create('div').addClass('colorpicker-default__history-item').addClass('has-color').css('background', color).attr('data-history-color', (new color_1.Color(color).rgba));
    _this.history.append(historyItem);
    });
    for (var i = 0; i < this.options.history.placeholdersAmount - this.options.history.colors.length; i++) {
      var emptyHistoryItem = tsdom_1.TsDom.create('div').addClass('colorpicker-default__history-item').addClass('is-empty').attr('data-history-color', '');
      this.history.append(emptyHistoryItem);
    }
    this.opacityContainer.append(this.opacityCanvas).append(this.opacityCursor);
    body.append(this.spectrumContainer).append(this.hueContainer).append(this.opacityContainer);
    footer.append(hexInputContainer).append(rInputContainer).append(gInputContainer).append(bInputContainer).append(aInputContainer);
    this.picker.append(body).append(footer).append(this.history);
  };
  DefaultPicker.prototype.bindEvents = function() {
    var _this = this;
    var self = this;
    this.spectrumCursor.on('dragstart', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });

    this.spectrumContainer.on('mousedown', function(e) {
      if (e.which != 1) {
        return;
      }
      _this.initDragObject(e, self.spectrumCursor, self.spectrumCanvas);
      _this.processCursorPosition(_this.spectrumCursor, _this.spectrumCanvas, _this.dragObject.shiftX, _this.dragObject.shiftY);
      _this.spectrumColor = _this.setCursorColorFromCursorPosition(_this.spectrumCursor, _this.spectrumCanvas, _this.dragObject.shiftX, _this.dragObject.shiftY);
      _this.setOpacityGradientAndCursorColor();
      _this.setColorValuesToInputs();
      _this.dispatchColorChangedEvent();
    });

    this.hueContainer.on('mousedown', function(e) {
      if (e.which != 1) {
        return;
      }
      _this.initDragObject(e, _this.hueCursor, _this.hueCanvas);
      _this.dragObject.processShiftX = false;
      _this.processCursorPosition(self.hueCursor, self.hueCanvas, self.dragObject.shiftX, self.dragObject.shiftY, self.dragObject.processShiftX);
      _this.hueColor = _this.setCursorColorFromCursorPosition(self.hueCursor, self.hueCanvas, self.dragObject.shiftX, self.dragObject.shiftY);
      _this.fillSpectrumCanvas();
      var cursorCoords = _this.getCursorCoords(_this.spectrumCursor);
      _this.spectrumColor = _this.setCursorColorFromCursorPosition(self.spectrumCursor, self.spectrumCanvas, cursorCoords.shiftX, cursorCoords.shiftY);
      _this.fillOpacityCanvas();
      _this.setOpacityGradientAndCursorColor();
      _this.setColorValuesToInputs();
      _this.dispatchColorChangedEvent();
    });

    this.opacityContainer.on('mousedown', function(e) {
      if (e.which != 1) {
        return;
      }
      _this.initDragObject(e, _this.opacityCursor, _this.opacityCanvas);
      _this.dragObject.processShiftX = false;
      _this.processCursorPosition(self.opacityCursor, self.opacityCanvas, self.dragObject.shiftX, self.dragObject.shiftY, self.dragObject.processShiftX);
      _this.changeAInputValue(self.dragObject.shiftY);
      _this.setCursorColorFromCursorPosition(self.opacityCursor, self.opacityCanvas, self.dragObject.shiftX, self.dragObject.shiftY, +_this.aInput.val());
      _this.dispatchColorChangedEvent();
    });

    this.hexInput.on('keyup', function(e) {
      var value = _this.hexInput.val();
      var isValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
      if (isValid) {
        _this.spectrumColor = color_1.Color.process(value);
        _this.setHueCursorPosition();
        _this.fillSpectrumCanvas();
        _this.fillOpacityCanvas();
        _this.setSpectrumCursorPositionByColor(_this.spectrumColor);
        _this.setOpacityGradientAndCursorColor();
        _this.rInput.val(_this.spectrumColor.source.rgba.r);
        _this.gInput.val(_this.spectrumColor.source.rgba.g);
        _this.bInput.val(_this.spectrumColor.source.rgba.b);
        _this.dispatchColorChangedEvent();
      }
    });

    this.rInput.on('keyup', function(e) {
      _this.onChangeInputValue(_this.rInput);
    });

    this.gInput.on('keyup', function(e) {
      _this.onChangeInputValue(_this.gInput);
    });

    this.bInput.on('keyup', function(e) {
      _this.onChangeInputValue(_this.bInput);
    });

    this.aInput.on('keyup', function(e) {
      var opacity = _this.aInput.val();
      var isValid = opacity.match(/^\\d*(\\.\\d+)?$/);
      if (isValid && (opacity >= 0 && opacity <= 1)) {
        _this.setOpacityCursorPosition(opacity);
        _this.dispatchColorChangedEvent();
      }
    });

    tsdom_1.TsDom.select(document).on('mousemove', function(e) {
      if (!_this.dragObject) {
        return;
      }
      var shiftX = _this.dragObject.shiftX;
      var shiftY = _this.dragObject.shiftY;
      if (_this.dragObject.processShiftX) {
        var moveX = e.clientX - _this.dragObject.downX;
        shiftX = moveX + _this.dragObject.shiftX;
      }
      if (_this.dragObject.processShiftY) {
        var moveY = e.clientY - _this.dragObject.downY;
        shiftY = moveY + _this.dragObject.shiftY;
      }
      _this.processCursorPosition(_this.dragObject.elements.cursor, _this.dragObject.elements.canvas, shiftX, shiftY, _this.dragObject.processShiftX, _this.dragObject.processShiftY);
      // If drag main cursor
      if (_this.dragObject.elements.cursor.hasClass('colorpicker-default__spectrum-cursor')) {
        _this.spectrumColor = _this.setCursorColorFromCursorPosition(_this.spectrumCursor, _this.spectrumCanvas, shiftX, shiftY);
        _this.setOpacityGradientAndCursorColor();
        _this.setColorValuesToInputs();
        _this.dispatchColorChangedEvent();
      } else if (_this.dragObject.elements.cursor.hasClass('colorpicker-default__hue-cursor')) {
        _this.hueColor = _this.setCursorColorFromCursorPosition(self.hueCursor, self.hueCanvas, shiftX, shiftY);
        _this.fillSpectrumCanvas();
        var cursorCoords = _this.getCursorCoords(_this.spectrumCursor);
        _this.spectrumColor = _this.setCursorColorFromCursorPosition(self.spectrumCursor, self.spectrumCanvas, cursorCoords.shiftX, cursorCoords.shiftY);
        _this.fillOpacityCanvas();
        _this.setOpacityGradientAndCursorColor();
        _this.setColorValuesToInputs();
        _this.dispatchColorChangedEvent();
      } else if (_this.dragObject.elements.cursor.hasClass('colorpicker-default__opacity-cursor')) {
        _this.changeAInputValue(shiftY);
        _this.setCursorColorFromCursorPosition(self.opacityCursor, self.opacityCanvas, shiftX, shiftY, +_this.aInput.val());
        _this.dispatchColorChangedEvent();
      }
    }).on('mouseup', function(e) {
      _this.dragObject = null;
    });

    this.history.find('.is-add-new').on('click', function(e) {
      var currentColor = _this.getColorObject().rgba;
      var isAdded = false;
      if (_this.history.find('.is-empty').length()) {
        _this.history.find('.is-empty').each(function(item) {
        var element = tsdom_1.TsDom.select(item);
        var isColorAlreadyAdded = _this.history.find('[data-history-color="' + currentColor + '"]').length();
        if (isColorAlreadyAdded) {
          isAdded = true;
        }
        if (!element.data('history-color') && !isAdded) {
          isAdded = true;
          element.css('background', currentColor).attr('data-history-color', currentColor).removeClass('is-empty').addClass('has-color');
        }
        });
      } else {
        var isColorAlreadyAdded = _this.history.find('[data-history-color="' + currentColor + '"]').length();
        if (!isColorAlreadyAdded) {
        var newHistoryItem = tsdom_1.TsDom.create('div').addClass('colorpicker-default__history-item').addClass('has-color').css('background', currentColor).attr('data-history-color', currentColor);
        _this.history.append(newHistoryItem);
        }
      }
    });

    this.history.on('click', function(e) {
      var item = tsdom_1.TsDom.select(e.target);
      if (item.hasClass('has-color')) {
        var color = item.data('history-color');
        _this.setColor(color);
        _this.dispatchColorChangedEvent();
      }
    });

    this.picker.on('contextmenu', function(e) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    });
  };
  DefaultPicker.prototype.refresh = function() {};

  DefaultPicker.prototype.destroy = function() {
    this.unBindCommonEvents();
    this.picker.remove();
    this.anchor.off('focus');
    this.anchor.off('click');
  };

  /**
   * Change r,g,b input
   * @param {TsDom} input
   */
  DefaultPicker.prototype.onChangeInputValue = function(input) {
    var value = +input.val();
    if (value >= 0 && value <= 255) {
      this.spectrumColor = color_1.Color.process(this.getColorFromInputs());
      this.setHueCursorPosition();
      this.fillSpectrumCanvas();
      this.fillOpacityCanvas();
      this.spectrumColor = this.setSpectrumCursorPositionByColor(this.spectrumColor);
      this.hexInput.val(this.spectrumColor.hex);
      this.setOpacityGradientAndCursorColor();
      this.dispatchColorChangedEvent();
    }
  };

  DefaultPicker.prototype.getColorFromInputs = function() {
    return 'rgba(' + this.rInput.val() + ', ' + this.gInput.val() + ', ' + this.bInput.val() + ', ' + this.aInput.val() + ')';
  };

  DefaultPicker.prototype.getCursorCoords = function(cursor) {
    return {
      shiftX: cursor.offset().left + Math.floor(cursor.width() / 2),
      shiftY: cursor.offset().top + Math.floor(cursor.height() / 2)
    };
  };

  DefaultPicker.prototype.setOpacityGradientAndCursorColor = function() {
    var opacity = +this.aInput.val();
    var shiftY = +(this.opacityCanvas.height() * opacity).toFixed(0) - (this.opacityCursor.height() / 2);
    var shiftX = (this.opacityCanvas.width() / 2) - (this.opacityCursor.width() / 2);
    this.fillOpacityCanvas();
    this.setCursorColorFromCursorPosition(this.opacityCursor, this.opacityCanvas, shiftX, shiftY, opacity);
  };

  DefaultPicker.prototype.initDragObject = function(e, cursor, canvas) {
    e.stopPropagation();
    e.preventDefault();
    if (e.which != 1) {
      return;
    }
    var shiftX = e.clientX - canvas.position().left - Math.floor(cursor.width() / 2),
    shiftY = e.clientY - canvas.position().top - Math.floor(cursor.height() / 2);
    this.dragObject = {
      elements: {
        cursor: cursor,
        canvas: canvas
      },
      downX: e.clientX,
      downY: e.clientY,
      shiftX: shiftX,
      shiftY: shiftY,
      processShiftX: true,
      processShiftY: true
    };
  };

  DefaultPicker.prototype.update = function() {
    if (this.options.hexOnly) {
      this.picker.addClass('colorpicker-default--hex-only');
    }
    if (!this.options.color) {
      this.options.color = this.options.defaultColor;
    }
    if (color_1.Color.process(this.options.color).isValid()) {
      this.processUpdate();
    }
  };

  DefaultPicker.prototype.processUpdate = function() {
    this.spectrumColor = color_1.Color.process(this.options.color);
    this.currentColor = color_1.Color.process(this.options.color);
    this.aInput.val(this.spectrumColor.source.rgba.a);
    this.setColorValuesToInputs();
    // important, with and height from css properties don't match
    // you need to set width and height manually to attributes
    this.spectrumCanvas.attr('width', this.spectrumCanvas.width()).attr('height', this.spectrumCanvas.height());
    this.spectrumCanvas.get().getContext('2d').clearRect(0, 0, this.spectrumCanvas.width(), this.spectrumCanvas.height());
    this.hueCanvas.attr('width', this.hueCanvas.width()).attr('height', this.hueCanvas.height());
    this.opacityCanvas.attr('width', this.opacityCanvas.width()).attr('height', this.opacityCanvas.height());
    this.fillHueCanvas();
    this.setHueCursorPosition();
    this.fillSpectrumCanvas();
    this.fillOpacityCanvas();
    this.setSpectrumCursorPositionByColor(this.spectrumColor);
    this.setOpacityCursorPosition(this.spectrumColor.source.rgba.a);
  };

  DefaultPicker.prototype.getColor = function() {
    var color = this.spectrumColor ? color_1.Color.process(this.getColorFromInputs()) : color_1.Color.process(this.options.color);
    if (this.aInput.val()) {
      color.setOpacity(this.aInput.val());
    }
    return color.format(this.options.format);
  };

  DefaultPicker.prototype.getColorObject = function() {
    return this.spectrumColor ? color_1.Color.process(this.getColorFromInputs()) : color_1.Color.process(this.options.color);
  };

  DefaultPicker.prototype.setSpectrumCursorPositionByColor = function(color) {
    var canvasWidth = this.spectrumCanvas.width();
    var canvasHeight = this.spectrumCanvas.height();
    var hsvColors = color.format('source').hsv;
    var shiftX = Math.floor((canvasWidth / 100) * hsvColors.s);
    var shiftY = canvasHeight - Math.floor((canvasHeight / 100) * hsvColors.v);
    shiftX = shiftX - this.spectrumCursor.width() / 2;
    shiftY = shiftY - this.spectrumCursor.height() / 2;
    this.processCursorPosition(this.spectrumCursor, this.spectrumCanvas, shiftX, shiftY);
    return this.setCursorColorFromCursorPosition(this.spectrumCursor, this.spectrumCanvas, shiftX, shiftY);
  };

  DefaultPicker.prototype.setHueCursorPosition = function() {
    var hueCanvas = this.picker.find('.colorpicker-default__hue-canvas');
    var canvasHeight = hueCanvas.height();
    var canvasContext = hueCanvas.get().getContext('2d');
    var colors = [];
    var heightOffsets = {};
    for (var i = 0; i < canvasHeight; i++) {
      var colorData = canvasContext.getImageData(0, i, 1, 1).data;
      var hexColor = color_1.Color.process("rgb(" + colorData[0] + ", " + colorData[1] + ", " + colorData[2] + ")").format('hex');
      colors.push(hexColor);
      heightOffsets[hexColor] = i;
    }
    this.options.hueColors.forEach(function(hueColor) {
    colors.push(hueColor.color);
    heightOffsets[hueColor.color] = Math.ceil((canvasHeight / 100) * (hueColor.offset * 100));
    });
    var nearestColorInstance = nearestColor.from(colors);
    var nearestColorValue = nearestColorInstance(this.currentColor.hex);
    this.hueColor = color_1.Color.process(nearestColorValue);
    var shiftY = heightOffsets[nearestColorValue];
    var hueCursor = this.picker.find('.colorpicker-default__hue-cursor');
    var shiftX = Math.ceil(hueCanvas.width() / 2) - Math.ceil(hueCursor.width() / 2);
    this.processCursorPosition(hueCursor, hueCanvas, shiftX, shiftY);
    return this.setCursorColorFromCursorPosition(hueCursor, hueCanvas, shiftX, shiftY);
  };

  DefaultPicker.prototype.setOpacityCursorPosition = function(opacity) {
    var shiftY = +(this.opacityCanvas.height() * opacity).toFixed(0);
    shiftY = shiftY - (this.opacityCursor.height() / 2);
    var shiftX = Math.ceil(this.opacityCanvas.width() / 2) - Math.ceil(this.opacityCursor.width() / 2);
    this.processCursorPosition(this.opacityCursor, this.opacityCanvas, shiftX, shiftY);
    return this.setCursorColorFromCursorPosition(this.opacityCursor, this.opacityCanvas, shiftX, shiftY, +this.aInput.val());
  };

  DefaultPicker.prototype.fillSpectrumCanvas = function() {
    var canvasWidth = this.spectrumCanvas.width();
    var canvasHeight = this.spectrumCanvas.height();
    var canvasContext = this.spectrumCanvas.get().getContext('2d');
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    var whiteGradient = canvasContext.createLinearGradient(0, 0, canvasWidth, 0);
    whiteGradient.addColorStop(0, "#fff");
    whiteGradient.addColorStop(.01, "#fff");
    whiteGradient.addColorStop(.99, this.hueColor.rgb);
    whiteGradient.addColorStop(1, this.hueColor.rgb);
    canvasContext.fillStyle = whiteGradient;
    canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
    var blackGradient = canvasContext.createLinearGradient(0, 0, 0, canvasHeight);
    blackGradient.addColorStop(.01, "transparent");
    blackGradient.addColorStop(.99, "#000");
    blackGradient.addColorStop(1, "#000");
    canvasContext.fillStyle = blackGradient;
    canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  DefaultPicker.prototype.fillHueCanvas = function() {
    var canvasContext = this.hueCanvas.get().getContext('2d'),
    multipleGradient = canvasContext.createLinearGradient(0, 0, 0, this.hueCanvas.height());
    this.options.hueColors.forEach(function(node) {
      multipleGradient.addColorStop(node.offset, node.color);
    });
    canvasContext.fillStyle = multipleGradient;
    canvasContext.fillRect(0, 0, this.hueCanvas.width(), this.hueCanvas.height());
  };

  DefaultPicker.prototype.fillOpacityCanvas = function() {
    var canvasContext = this.opacityCanvas.get().getContext('2d');
    canvasContext.clearRect(0, 0, this.opacityCanvas.width(), this.opacityCanvas.height());
    var opacityGradient = canvasContext.createLinearGradient(0, 0, 0, this.opacityCanvas.height());
    opacityGradient.addColorStop(0, "transparent");
    opacityGradient.addColorStop(1, this.spectrumColor.rgb);
    canvasContext.fillStyle = opacityGradient;
    canvasContext.fillRect(0, 0, this.opacityCanvas.width(), this.opacityCanvas.height());
  };

  DefaultPicker.prototype.setCursorColorFromCursorPosition = function(cursor, canvas, shiftX, shiftY, opacity) {
    if (opacity === void 0) {
      opacity = 1;
    }
    var canvasContext = canvas.get().getContext('2d'),
    cursorOffsetLeft = Math.ceil(cursor.width() / 2) + shiftX,
    cursorOffsetTop = Math.ceil(cursor.height() / 2) + shiftY;
    if (cursorOffsetLeft <= 0 || (shiftX === 0)) {
      cursorOffsetLeft = 0;
    }
    if (cursorOffsetTop <= 0 || (shiftY === 0)) {
      cursorOffsetTop = 0;
    }
    if (cursorOffsetLeft >= canvas.width()) {
      cursorOffsetLeft = canvas.width() - 1;
    }
    if (cursorOffsetTop >= canvas.height()) {
      cursorOffsetTop = canvas.height() - 1;
    }
    var colorData = canvasContext.getImageData(cursorOffsetLeft, cursorOffsetTop, 1, 1).data;
    var tmpColor = 'rgba(' + colorData[0] + ', ' + colorData[1] + ', ' + colorData[2] + ', ' + opacity + ')';
    var color = color_1.Color.process(tmpColor);
    cursor.css('background-color', color.rgba);
    return color;
  };

  DefaultPicker.prototype.dispatchColorChangedEvent = function() {
    tsdom_1.TsDom.select(this.cssId).trigger('colorpicker:color-change', {
    color: this.getColor().toString()
    });
  };

  DefaultPicker.prototype.processCursorPosition = function(cursor, canvas, shiftX, shiftY, processShiftX, processShiftY) {
    if (processShiftX === void 0) {
      processShiftX = true;
    }
    if (processShiftY === void 0) {
      processShiftY = true;
    }
    if (processShiftX) {
      var divX = cursor.width() / 2;
      if ((shiftX + divX) < 0) {
        if (shiftX <= -divX) {
          shiftX = -divX;
        }
      }
      if (shiftX > (canvas.width() - divX)) {
        shiftX = canvas.width() - divX;
      }
    } else {
      shiftX = Math.ceil(canvas.width() / 2) - Math.ceil(cursor.width() / 2);
    }
    if (processShiftY) {
      var divY = cursor.height() / 2;
      if ((shiftY + divY) < 0) {
        if (shiftY <= -divY) {
        shiftY = -divY;
        }
      }
      if (shiftY > (canvas.height() - divY)) {
        shiftY = canvas.height() - divY;
      }
    } else {
      shiftY = Math.ceil(canvas.height() / 2) - Math.ceil(cursor.height() / 2);
    }
    cursor.css('left', shiftX + 'px');
    cursor.css('top', shiftY + 'px');
  };

  DefaultPicker.prototype.changeAInputValue = function(shiftY) {
    var opacity = +((shiftY / this.opacityCanvas.height()).toFixed(2));
    if (opacity <= 0) {
      opacity = 0;
    } else if (opacity >= 1) {
      opacity = 1;
    }
    this.aInput.val(opacity);
  };

  DefaultPicker.prototype.setColorValuesToInputs = function() {
    var color = this.spectrumColor,
    hexColor = color.hex,
    rgbaColor = color.source.rgba;
    this.hexInput.val(hexColor);
    this.rInput.val(rgbaColor.r);
    this.gInput.val(rgbaColor.g);
    this.bInput.val(rgbaColor.b);
  };

  DefaultPicker.prototype.getPickerCssClassName = function() {
    return 'colorpicker-default';
  };

  DefaultPicker.prototype.getDefaultOptions = function() {
    return {
      defaultColor: '#f00',
      hueColors: [{
        offset: 0,
        color: '#ff0000'
      }, {
        offset: .17,
        color: '#ff00ff'
      }, {
        offset: .33,
        color: '#0000ff'
      }, {
        offset: .5,
        color: '#00ffff'
      }, {
        offset: .67,
        color: '#00ff00'
      }, {
        offset: .83,
        color: '#ffff00'
      }, {
        offset: 1,
        color: '#ff0000'
      }]
    };
  };

  return DefaultPicker;

  }(colorpicker_1.ColorPicker));

  module.exports = DefaultPicker;
  //# sourceURL=webpack://ColorPicker.Default/./src/ts/default-picker.ts?");
  /***/
}),

/***/

"./src/ts/model/color.ts":

/*!*******************************!*\
!*** ./src/ts/model/color.ts ***!
\*******************************/

/*! no static exports found */

/***/

(function(module, exports, __webpack_require__) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var tinycolor = __webpack_require__( /*! tinycolor2 */ "./node_modules/tinycolor2/tinycolor.js");
  var Color = /** @class */ (function() {
  
    function Color(color) {
      this.color = color;
      this.normalize();
    }

    Color.prototype.normalize = function() {
      var color = tinycolor(this.color);
      var opacity = color.getAlpha();
      var rawRgb = color.toRgb();
      var rawHsl = color.toHsl();
      var rawHsv = color.toHsv();
      color.setAlpha(1);
      this.rgb = color.toRgbString();
      this.rgba = "rgba(" + rawRgb.r + ", " + rawRgb.g + ", " + rawRgb.b + ", " + opacity + ")";
      this.hex = color.toHexString();
      this.hsl = color.toHslString();
      this.hsla = "hsla(" + Math.floor(rawHsl.h) + ", " + Math.floor(rawHsl.s * 100) + "%, " + Math.floor(rawHsl.l * 100) + "%, " + opacity + ")";
      this.hsv = color.toHsvString();
      this.hsva = '';
      this.source = {
      rgba: {
        r: rawRgb.r,
        g: rawRgb.g,
        b: rawRgb.b,
        a: opacity,
      },
      hsla: {
        h: Math.floor(rawHsl.h),
        s: Math.floor(rawHsl.s * 100),
        l: Math.floor(rawHsl.l * 100),
        a: opacity
      },
      hsv: {
        h: Math.floor(rawHsv.h),
        s: Math.floor(rawHsv.s * 100),
        v: Math.floor(rawHsv.v * 100),
        a: opacity
      }
      };
      /*console.log(this.rgb);
      console.log(this.rgba);
      console.log(this.hex);
      console.log(this.hsl);
      console.log(this.hsla);
      console.log(this.hsv);
      console.log(this.source);*/
    };

    Color.prototype.format = function(format) {
      if (format === 'rgb') {
        return this.rgb;
      } else if (format === 'rgba') {
        return this.rgba;
      } else if (format === 'hex') {
        return this.hex;
      } else if (format === 'hsl') {
        return this.hsl;
      } else if (format === 'hsla') {
        return this.hsla;
      } else if (format === 'source') {
        return this.source;
      }
      return this.hex;
    };

    Color.prototype.setOpacity = function(opacity) {
      this.rgba = 'rgba(' + this.source.rgba.r + ', ' + this.source.rgba.g + ', ' + this.source.rgba.b + ', ' + opacity + ')';
      this.hsla = 'hsla(' + this.source.hsla.h + ', ' + this.source.hsla.s + '%, ' + this.source.hsla.l + '%, ' + opacity + ')';
      this.source.rgba.a = opacity;
      this.source.hsla.a = opacity;
    };

    Color.prototype.isValid = function() {
      return tinycolor(this.color).isValid();
    };

    Color.process = function(color) {
      return new Color(color);
    };

    return Color;
  }());

  exports.Color = Color;

  //# sourceURL=webpack://ColorPicker.Default/./src/ts/model/color.ts?");
  /***/
}),

/***/


"./src/ts/model/colorpicker.ts":

/*!*************************************!*\
!*** ./src/ts/model/colorpicker.ts ***!
\*************************************/

/*! no static exports found */

/***/

(function(module, exports, __webpack_require__) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var tsdom_1 = __webpack_require__( /*! ./tsdom */ "./src/ts/model/tsdom.ts");
  var deepmerge = __webpack_require__( /*! deepmerge */ "./node_modules/deepmerge/dist/umd.js");
  var helper_1 = __webpack_require__( /*! ./helper */ "./src/ts/model/helper.ts");
  var picker_position_1 = __webpack_require__( /*! ./picker-position */ "./src/ts/model/picker-position.ts");

  var ColorPicker = /** @class */ (function() {

    function ColorPicker(anchor, options) {
      if (options === void 0) {
        options = {};
      }
      this.options = {
        color: '',
        hexOnly: false,
        inline: false,
        placement: 'bottom',
        format: 'rgba',
        customClass: '',
        size: 'default',
        arrow: true,
        anchor: {
          hidden: false,
          cssProperty: 'color' // background-color, color
        },
        animation: 'slide-in',
        hideInfo: false,
        history: {
          hidden: false,
          placeholdersAmount: 10,
          colors: []
        }
      };
      this.events = {
        change: function(color) {}
      };
      var overwriteMerge = function(destinationArray, sourceArray, options) {
        return sourceArray;
      };
      this.anchor = tsdom_1.TsDom.select(anchor);
      this.id = 'colorpicker' + '-' + helper_1._uniqueId();
      this.anchorId = this.id + '-anchor';
      this.cssId = '#' + this.id;
      this.cssAnchorId = '#' + this.anchorId;
      this.options = deepmerge.all([this.options, this.getDefaultOptions(), ColorPicker.globalOptions, options], {
        arrayMerge: overwriteMerge
      });
      this.document = tsdom_1.TsDom.select(document);
      this.initPicker();
      this.update();
      this.initAnchor();
    }

    ColorPicker.prototype.setColor = function(color) {
      this.options.color = color;
      this.update();
    };

    ColorPicker.prototype.show = function() {
      this.bindCommonEvents();
      this.picker.removeClass(this.options.animation).addClass(this.options.animation).addClass('is-opened').addClass('colorpicker--position-' + this.options.placement);
      this.detectPickerPosition();
      this.afterShow();
    };

    ColorPicker.prototype.hide = function() {
      if (!this.picker.hasClass('is-opened')) {
        return;
      }
      this.pickerPosition.destroy();
      this.unBindCommonEvents();
      this.picker.removeClass('is-opened');
      this.anchor.get(0).blur(); // unfocus input
    };

    ColorPicker.prototype.unBindCommonEvents = function() {
      if (!this.options.inline) {
        this.document.off('mousedown');
      }
    };

    ColorPicker.prototype.on = function(eventName, eventCallback) {
      this.events[eventName] = eventCallback;
    };

    ColorPicker.prototype.setAnchorCssProperty = function(cssProperty) {
      this.options.anchor.cssProperty = cssProperty;
    };

    ColorPicker.prototype.setPlacement = function(placement) {
      this.options.placement = placement;
    };

    ColorPicker.setGlobalOptions = function(options) {
      ColorPicker.globalOptions = options;
    };

    ColorPicker.prototype.initPicker = function() {
      this.buildLayout();
      this.picker.addClass(this.getPickerCssClassName() + '--size-' + this.options.size);
      // hide arrow on picker
      if (!this.options.arrow) {
        this.picker.addClass('colorpicker--no-arrow');
      }
      this.addCustomClass();
      if (this.options.inline) {
        if (this.anchor.parent().hasClass('colorpicker-input')) {
          this.anchor.parent().insertAfter(this.picker);
        } else {
          this.anchor.insertAfter(this.picker);
        }
        this.anchor.addClass('colorpicker-anchor--inline');
        this.picker.addClass('colorpicker--inline');
      } else {
        tsdom_1.TsDom.select('body').append(this.picker);
      }
      this.bindEvents();
    };

    ColorPicker.prototype.bindCommonEvents = function() {
      var _this = this;
      if (!this.options.inline) {
        this.document.on('mousedown', function(e) {
          var picker = tsdom_1.TsDom.select(e.target).closest('.colorpicker');
          if ((!picker.length() || picker.attr('id') !== _this.picker.attr('id')) && (e.target !== _this.anchor.get(0))) {
          _this.hide();
          }
        });
      }
    };

    ColorPicker.prototype.initAnchor = function() {
      var _this = this;
      var self = this;
      var callback = function(e) {
        self.hideAllActivePickers();
        self.show();
        e.stopPropagation();
      };
      this.anchor.addClass('colorpicker-anchor');
      if (this.options.anchor.hidden) {
        this.anchor.hide();
      }
      if (this.anchor.is('input')) {
        this.anchor.val(self.getColor().toString()).on('input', function(e) {
          _this.setColor(_this.anchor.val());
          _this.updateAnchorColor(e, false);
        });
        var anchorInInput = this.anchor.parent().find('[data-color]');
        if (anchorInInput.length()) {
          anchorInInput.css('background', self.getColor());
        }
        if (!this.options.inline) {
          this.anchor.on('focus', callback);
        }
      } else {
        if (this.anchor.find('[data-color]').length()) {
          this.anchor.find('[data-color]').css('background', self.getColor());
        } else {
          this.anchor.css(self.options.anchor.cssProperty, self.getColor());
        }
        if (!this.options.inline) {
          this.anchor.on('click', callback);
        }
      }
      this.picker.on('colorpicker:color-change', function(e) {
        _this.updateAnchorColor(e);
      });
      this.picker.on('colorpicker:hide', function(e) {
        _this.hide();
      });
    };

    ColorPicker.prototype.updateAnchorColor = function(e, updateValue) {
      if (e === void 0) {
        e = null;
      }
      if (updateValue === void 0) {
        updateValue = true;
      }
      var self = this;
      if (e.detail.enableHidePicker && self.options.hideAfterColorChange && !this.options.inline) {
        self.hide();
      }
      var dataColor = null;
      if (updateValue) {
        this.anchor.val(self.getColor().toString());
      }
      if (this.anchor.parent().hasClass('colorpicker-input')) {
        dataColor = this.anchor.parent().find('[data-color]');
      } else {
        dataColor = this.anchor.find('[data-color]');
      }
      if (dataColor.length()) {
        dataColor.css('background-color', self.getColor());
      } else {
        if (!this.anchor.is('input')) {
          this.anchor.css(self.options.anchor.cssProperty, self.getColor());
        }
      }
      this.events['change'].apply(self, [self.getColorObject()]);
    };

    ColorPicker.prototype.hideAllActivePickers = function() {
      tsdom_1.TsDom.select(".colorpicker.is-opened:not(" + this.cssId + "):not(.colorpicker--inline)").trigger('colorpicker:hide');
    };

    ColorPicker.prototype.addCustomClass = function() {
      this.picker.addClass(this.options.customClass);
    };

    ColorPicker.prototype.detectPickerPosition = function() {
      var _this = this;
      this.pickerPosition = new picker_position_1.PickerPosition(this.anchor, this.picker, this.options.placement, this.options.arrow);
      this.pickerPosition.process();
      this.picker.on('colorpicker:refresh-position', function(e) {
        _this.pickerPosition.process();
      });
    };

    ColorPicker.prototype.dispatchColorChangedEvent = function(enableHidePicker) {
      if (enableHidePicker === void 0) {
        enableHidePicker = true;
      }
      this.picker.trigger('colorpicker:color-change', {
        color: this.getColor(),
        enableHidePicker: enableHidePicker
      });
    };

    ColorPicker.prototype.dispatchRefreshPositionEvent = function() {
      this.picker.trigger('colorpicker:refresh-position');
    };

    ColorPicker.prototype.afterShow = function() {};
    ColorPicker.globalOptions = {};
    return ColorPicker;
  }());

  exports.ColorPicker = ColorPicker;

  //# sourceURL=webpack://ColorPicker.Default/./src/ts/model/colorpicker.ts?");

  /***/
}),

/***/

"./src/ts/model/helper.ts":

/*!********************************!*\
!*** ./src/ts/model/helper.ts ***!
\********************************/

/*! no static exports found */

/***/

(function(module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _uniqueId(idLength) {
    if (idLength === void 0) {
      idLength = 16;
    }
    return Math.random().toString(36).substr(2, idLength);
  }

  exports._uniqueId = _uniqueId;
  //# sourceURL=webpack://ColorPicker.Default/./src/ts/model/helper.ts?");
  /***/
}),

/***/

"./src/ts/model/picker-position.ts":

/*!*****************************************!*\
!*** ./src/ts/model/picker-position.ts ***!
\*****************************************/

/*! no static exports found */

/***/

(function(module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var tsdom_1 = __webpack_require__( /*! ./tsdom */ "./src/ts/model/tsdom.ts");

  var PickerPosition = /** @class */ (function() {

  function PickerPosition(selector, picker, defaultPlacement, arrow) {
    this.selector = selector;
    this.picker = picker;
    this.defaultPlacement = defaultPlacement;
    this.arrow = arrow;
    var self = this;
    var scrollParent = this.getScrollParent(this.selector.get());
    this.processHandler = function(e) {
      return self.process();
    };
    this.scrollParent = tsdom_1.TsDom.select(scrollParent);
    this.scrollParent.on('scroll', this.processHandler);
    this.window = tsdom_1.TsDom.select(window);
    this.window.on('scroll', this.processHandler);
  }

  PickerPosition.prototype.process = function() {
    var pickerId = this.picker.attr('id'),
    arrow = tsdom_1.TsDom.select('#' + pickerId + ':after'),
    arrowWidth = arrow.width(),
    arrowHeight = arrow.height(),
    selectorWidth = this.selector.width(),
    selectorHeight = this.selector.height(),
    selectorPositionTop = this.selector.position().top,
    selectorPositionLeft = this.selector.position().left,
    pickerWidth = this.picker.width(),
    pickerHeight = this.picker.height(),
    defaultPlacement = 'bottom',
    result = this.defaultPlacement.split('-'),
    arrowBorderWidth = arrowWidth / 2;
    if (result.length > 1) {
      defaultPlacement = result[0];
    } else {
      defaultPlacement = this.defaultPlacement;
    }
    if (defaultPlacement === 'bottom') {
      var pickerPositionTop = selectorPositionTop + selectorHeight + arrowHeight;
      var pickerPositionLeft = 0;
      if ((selectorPositionLeft + pickerWidth) < tsdom_1.TsDom.select(window).width()) { // arrow left position
        pickerPositionLeft = selectorPositionLeft;
        this.picker.removeClass('is-arrow-right').addClass('is-arrow-left');
        var arrowLeftPosition = arrow.css('left');
        var arrowAreaWidth = arrowLeftPosition + arrow.width() + Math.ceil(arrowLeftPosition / 2);
        if (selectorWidth < arrowAreaWidth) { // centering left arrow
          pickerPositionLeft = pickerPositionLeft - Math.ceil((arrowLeftPosition + (arrowBorderWidth / 2)) - (selectorWidth / 2));
        }
      } else { // arrow right position
        pickerPositionLeft = (selectorPositionLeft + selectorWidth) - pickerWidth;
        this.picker.removeClass('is-arrow-left').addClass('is-arrow-right');
        var arrowRightPosition = arrow.css('right');
        var arrowAreaWidth = arrowRightPosition + arrow.width() + Math.ceil(arrowRightPosition / 2);
        if (selectorWidth < arrowAreaWidth) {
          // 2px is hack fix for arrow with right position
          pickerPositionLeft = pickerPositionLeft + 3 + ((arrowRightPosition + (arrowBorderWidth / 2)) - (selectorWidth / 2));
        }
      }
      this.picker.css('top', pickerPositionTop + 'px');
      this.picker.css('left', pickerPositionLeft + 'px');
    } else if (defaultPlacement === 'top') {
      var pickerPositionTop = selectorPositionTop - pickerHeight - arrowHeight;
      var pickerPositionLeft = 0;
      if ((selectorPositionLeft + pickerWidth) < tsdom_1.TsDom.select(window).width()) { // arrow left position
        pickerPositionLeft = selectorPositionLeft;
        this.picker.css('left', pickerPositionLeft + 'px');
        this.picker.removeClass('is-arrow-right').addClass('is-arrow-left');
        var arrowLeftPosition = arrow.css('left');
        var arrowAreaWidth = arrowLeftPosition + arrow.width() + Math.ceil(arrowLeftPosition / 2);
        if (selectorWidth < arrowAreaWidth) { // centering left arrow
          pickerPositionLeft = pickerPositionLeft - Math.ceil((arrowLeftPosition + (arrowBorderWidth / 2)) - (selectorWidth / 2));
        }
      } else { // arrow right position
        pickerPositionLeft = (selectorPositionLeft + selectorWidth) - pickerWidth;
        this.picker.removeClass('is-arrow-left').addClass('is-arrow-right');
        var arrowRightPosition = arrow.css('right');
        var arrowAreaWidth = arrowRightPosition + arrow.width() + Math.ceil(arrowRightPosition / 2);
        if (selectorWidth < arrowAreaWidth) {
          // 2px is hack fix for arrow with right position
          pickerPositionLeft = pickerPositionLeft + 3 + ((arrowRightPosition + (arrowBorderWidth / 2)) - (selectorWidth / 2));
        }
      }
      this.picker.css('top', pickerPositionTop + 'px');
      this.picker.css('left', pickerPositionLeft + 'px');
    } else if (defaultPlacement === 'left') {
      var pickerPositionTop = selectorPositionTop;
      var pickerPositionLeft = selectorPositionLeft - pickerWidth - arrowWidth;
      if ((selectorPositionTop + pickerHeight) < tsdom_1.TsDom.select(window).height()) { // arrow top position
        this.picker.removeClass('is-arrow-bottom').addClass('is-arrow-top');
        var arrowTopPosition = arrow.css('top');
        var arrowAreaHeight = arrowTopPosition + arrowHeight + Math.ceil(arrowTopPosition / 2);
        if (selectorHeight < arrowAreaHeight) { // centering left arrow
        pickerPositionTop = pickerPositionTop - Math.ceil((arrowTopPosition + (arrowBorderWidth / 2)) - (selectorHeight / 2));
        }
      } else { // arrow bottom position
        pickerPositionTop = (selectorPositionTop + selectorHeight) - pickerHeight;
        this.picker.removeClass('is-arrow-top').addClass('is-arrow-bottom');
        var arrowBottomPosition = arrow.css('bottom');
        var arrowAreaHeight = arrowBottomPosition + arrow.height() + Math.ceil(arrowBottomPosition / 2);
        if (selectorHeight < arrowAreaHeight) {
          // 4px is hack fix for arrow with bottom position
          pickerPositionTop = pickerPositionTop + 4 + ((arrowBottomPosition + (arrowBorderWidth / 2)) - (selectorHeight / 2));
        }
      }
      this.picker.css('top', pickerPositionTop + 'px');
      this.picker.css('left', pickerPositionLeft + 'px');
    } else if (defaultPlacement === 'right') {
      var pickerPositionTop = selectorPositionTop;
      var pickerPositionLeft = selectorPositionLeft + selectorWidth + arrowWidth;
      if ((selectorPositionTop + pickerHeight) < tsdom_1.TsDom.select(window).height()) { // arrow top position
        this.picker.removeClass('is-arrow-bottom').addClass('is-arrow-top');
        var arrowTopPosition = arrow.css('top');
        var arrowAreaHeight = arrowTopPosition + arrowHeight + Math.ceil(arrowTopPosition / 2);
        if (selectorHeight < arrowAreaHeight) { // centering left arrow
          pickerPositionTop = pickerPositionTop - Math.ceil((arrowTopPosition + (arrowBorderWidth / 2)) - (selectorHeight / 2));
        }
      } else { // arrow bottom position
        pickerPositionTop = (selectorPositionTop + selectorHeight) - pickerHeight;
        this.picker.removeClass('is-arrow-top').addClass('is-arrow-bottom');
        var arrowBottomPosition = arrow.css('bottom');
        var arrowAreaHeight = arrowBottomPosition + arrow.height() + Math.ceil(arrowBottomPosition / 2);
        if (selectorHeight < arrowAreaHeight) {
          // 4px is hack fix for arrow with bottom position
          pickerPositionTop = pickerPositionTop + 4 + ((arrowBottomPosition + (arrowBorderWidth / 2)) - (selectorHeight / 2));
        }
      }
      this.picker.css('top', pickerPositionTop + 'px');
      this.picker.css('left', pickerPositionLeft + 'px');
    }
  };

  PickerPosition.prototype.destroy = function() {
    this.scrollParent.off('scroll');
    this.window.off('scroll');
  };

  PickerPosition.prototype.getScrollParent = function(node) {
    var regex = /(auto|scroll)/;
    var parents = function(_node, ps) {
      if (_node.parentNode === null) {
        return ps;
      }
      return parents(_node.parentNode, ps.concat([_node]));
    };

    var style = function(_node, prop) {
      return getComputedStyle(_node, null).getPropertyValue(prop);
    };

    var overflow = function(_node) {
      return style(_node, 'overflow') + style(_node, 'overflow-y') + style(_node, 'overflow-x');
    };

    var scroll = function(_node) {
      return regex.test(overflow(_node));
    };

    /* eslint-disable consistent-return */
    var scrollParent = function(_node) {
      if (!(_node instanceof HTMLElement || _node instanceof SVGElement)) {
        return;
      }
      var ps = parents(_node.parentNode, []);
      for (var i = 0; i < ps.length; i += 1) {
        if (scroll(ps[i])) {
        return ps[i];
        }
      }
      return document.scrollingElement || document.documentElement;
    };
    return scrollParent(node);
  };

  return PickerPosition;

  }());

  exports.PickerPosition = PickerPosition;
  //# sourceURL=webpack://ColorPicker.Default/./src/ts/model/picker-position.ts?");
  /***/
}),

/***/

"./src/ts/model/tsdom.ts":


  /*!*******************************!*\
  !*** ./src/ts/model/tsdom.ts ***!
  \*******************************/

  /*! no static exports found */

  /***/

  (function(module, exports, __webpack_require__) {

    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var TsDom = /** @class */ (function() {

    /**
     * Initialize selector
     *
     * @param {any | string} selector
     * @param {HTMLElement | Document} context
     */
    function TsDom(selector, context) {
      // Nodes collection array
      this.nodes = [];
      /**
       * Pseudo selector for current node
       *
       * @type {string}
       */
      this.pseudoSelector = '';
      this.callbacks = {};
      if (!context) {
        context = document;
      }
      if (typeof selector === 'string') {
        if (selector[0] === '<' && selector[selector.length - 1] === ">") {
          this.nodes = [TsDom.createNode(selector)];
        } else {
          if (selector.search(/(:before|:after)$/gi) !== -1) {
          var found = selector.match(/(:before|:after)$/gi);
          selector = selector.split(found[0])[0];
          this.pseudoSelector = found[0];
          }
          // Query DOM
          this.nodes = [].slice.call(context.querySelectorAll(selector));
        }
      } else if (selector instanceof NodeList) {
        this.nodes = selector.length > 1 ? [].slice.call(selector) : [selector];
      } else if (selector instanceof HTMLDocument || selector instanceof Window || selector instanceof HTMLElement) {
        this.nodes = [selector];
      }
    }

    TsDom.select = function(selector, context) {
      return new TsDom(selector, context);
    };

    TsDom.create = function(nodeName) {
      return new TsDom(TsDom.createNode(nodeName));
    };

    TsDom.prototype.attr = function(attrName, attrValue) {
      if (attrValue != undefined) {
        this.each(this.nodes, function(node) {
          node.setAttribute(attrName, attrValue);
        });
        return this;
      }
      return this.getLastNode().getAttribute(attrName);
    };

    /**
     * Append content to nodes
     *
     * @param {HTMLElement} content
     */
    TsDom.prototype.append = function(content) {
      var element;
      if (content instanceof TsDom) {
        element = content.get();
      } else {
        element = content;
      }
      this.each(this.nodes, function(node) {
        node.appendChild(element);
      });
      return this;
    };

    TsDom.prototype.parent = function() {
      return new TsDom(this.getLastNode().parentNode);
    };

    /**
     * Iteration per elements
     *
     * @param {HTMLElement[]} nodes
     * @param {Function} callback
     * @returns {TsDom}
     */
    TsDom.prototype.each = function(nodes, callback) {
      if (nodes instanceof Function) {
        callback = nodes;
        nodes = this.nodes;
      }
      for (var i = 0; i < nodes.length; i++) {
        callback.call(this.nodes[i], this.nodes[i], i);
      }
      return this;
    };

    TsDom.prototype.hasClass = function(className) {
      return this.getLastNode().classList.contains(className);
    };

    /**
     * Add css classes to element
     *
     * @param {string} className
     * @returns {TsDom}
     */
    TsDom.prototype.addClass = function(className) {
      if (className) {
        var cssClasses_1 = className.split(' ');
        this.each(this.nodes, function(node) {
          for (var classIndex in cssClasses_1) {
            node.classList.add(cssClasses_1[classIndex]);
          }
        });
      }
      return this;
    };

    /**
     * Remove css classes from element
     *
     * @param {string} className
     * @returns {TsDom}
     */
    TsDom.prototype.removeClass = function(className) {
      var cssClasses = className.split(' ');
      this.each(this.nodes, function(node) {
        for (var classIndex in cssClasses) {
          node.classList.remove(cssClasses[classIndex]);
        }
      });
      return this;
    };

    TsDom.prototype.html = function(content) {
      this.each(this.nodes, function(node) {
        node.innerHTML = content;
      });
    };

    TsDom.prototype.find = function(selector) {
      return new TsDom(selector, this.getLastNode());
    };

    TsDom.prototype.trigger = function(eventName, detail) {
      var event = new CustomEvent(eventName, {
        detail: detail
      });
      this.each(this.nodes, function(node) {
        node.dispatchEvent(event);
      });
      return this;
    };

    TsDom.prototype.text = function(text) {
      this.each(this.nodes, function(node) {
        node.innerText = text;
      });
      return this;
    };

    /**
     * Set ot Get css property from element
     *
     * @param styleName
     * @param value
     * @returns {any}
     */
    TsDom.prototype.css = function(styleName, value) {
      if (typeof value == 'undefined') {
        var node = this.getLastNode();
        var result = null;
        styleName = TsDom.convertToJsProperty(styleName);
        if ((typeof node.getBoundingClientRect === "function") && !this.pseudoSelector) {
          result = node.getBoundingClientRect()[styleName];
        }
        if (!result) {
          var value_1 = getComputedStyle(node, this.pseudoSelector)[styleName];
          if (value_1.search('px')) {
            result = parseInt(value_1, 10);
          }
        }
        if (isNaN(result)) {
          throw 'Undefined css property: ' + styleName;
        }
        return result;
      } else {
        if (this.nodes.length > 1) {
          this.each(this.nodes, function(node) {
            node.style[styleName] = value;
          });
        } else {
          this.nodes[0].style[styleName] = value;
        }
      }
      return this;
    };

    /**
     * Add event listener to element
     *
     * @param {string} eventName
     * @param {Function} callback
     * @returns {TsDom}
     */
    TsDom.prototype.on = function(eventName, callback) {
      var _this = this;
      this.each(this.nodes, function(node) {
        var callbackFn = function(e) {
          callback.call(node, e);
        };
        _this.callbacks[eventName] = callbackFn;
        node.addEventListener(eventName, callbackFn);
      });
      return this;
    };

    TsDom.prototype.off = function(eventName) {
      var callbackFn = this.callbacks[eventName];
      this.each(this.nodes, function(node) {
        node.removeEventListener(eventName, callbackFn, false);
      });
      return this;
    };

    TsDom.prototype.val = function(value) {
      if (typeof value === 'undefined') {
        return this.getLastNode().value;
      }
      this.each(this.nodes, function(node) {
        node.value = value;
      });
      return this;
    };

    /**
     * Check node type
     *
     * @param {string} tagName
     * @returns {boolean}
     */
    TsDom.prototype.is = function(tagName) {
      return this.getLastNode().tagName.toLowerCase() === tagName;
    };

    TsDom.prototype.get = function(index) {
      if (index === void 0) {
        index = 0;
      }
      return this.nodes[index];
    };

    TsDom.prototype.length = function() {
      return this.nodes.length;
    };

    TsDom.prototype.hide = function() {
      this.each(this.nodes, function(node) {
        TsDom.select(node).css('display', 'none');
      });
      return this;
    };

    TsDom.prototype.show = function() {
      this.each(this.nodes, function(node) {
        TsDom.select(node).css('display', '');
      });
      return this;
    };

    TsDom.prototype.empty = function() {
      this.each(this.nodes, function(node) {
        TsDom.select(node).get().innerHTML = '';
      });
      return this;
    };

    TsDom.prototype.remove = function() {
      this.each(this.nodes, function(node) {
        node.remove();
      });
    };

    TsDom.prototype.insertBefore = function(data) {
      var element = this.resolveElement(data);
      this.each(this.nodes, function(node) {
        node.parentNode.insertBefore(element, element.previousSibling);
      });
      return this;
    };

    TsDom.prototype.insertAfter = function(contents) {
      var element = this.resolveElement(contents);
      this.each(this.nodes, function(node) {
        node.parentNode.insertBefore(element, node.nextSibling);
      });
      return this;
    };

    TsDom.prototype.resolveElement = function(contents) {
      var element;
      if (TsDom.isHtml(contents)) {
        element = TsDom.createNode(contents);
      } else if (contents instanceof HTMLElement) {
        element = contents;
      } else if (contents instanceof TsDom) {
        element = contents.get();
      }
      return element;
    };

    TsDom.prototype.closest = function(selector) {
      return TsDom.select(this.getLastNode().closest(selector));
    };

    TsDom.prototype.data = function(dataName) {
      return this.attr('data-' + dataName);
    };

    TsDom.prototype.width = function(value) {
      if (value !== undefined) {
        this.css('width', value);
        return this;
      }
      if (this.getLastNode() === window) {
        return parseInt(this.getLastNode().innerWidth, 10);
      }
      var width = this.css('width').toString();
      var result = null;
      if (width.search('px')) {
        result = parseInt(this.css('width'), 10);
      } else {
        result = width;
      }
      return result;
    };

    TsDom.prototype.height = function(value) {
      if (value !== undefined) {
        this.css('height', value);
        return this;
      }
      if (this.getLastNode() === window) {
        return parseInt(this.getLastNode().innerHeight, 10);
      }
      return parseInt(this.css('height'), 10);
    };

    TsDom.prototype.position = function() {
      return {
        top: Number(this.getLastNode().getBoundingClientRect().top),
        bottom: Number(this.getLastNode().getBoundingClientRect().bottom),
        left: Number(this.getLastNode().getBoundingClientRect().left),
        right: Number(this.getLastNode().getBoundingClientRect().right),
      };
    };

    TsDom.prototype.offset = function() {
      return {
        top: Number(this.getLastNode().offsetTop),
        left: Number(this.getLastNode().offsetLeft)
      };
    };

    TsDom.createNode = function(nodeName) {
      if (nodeName[0] === '<' && nodeName[nodeName.length - 1] === ">") {
        var element = document.createElement('div');
        element.innerHTML = nodeName;
        return element.firstChild;
      } else {
        return document.createElement(nodeName);
      }
    };

    TsDom.isHtml = function(text) {
      return text[0] === '<' && text[text.length - 1] === ">";
    };


    /**
     * Make css property notation to javascript property notation
     *
     * @param {string} propertyName
     * @returns {string}
     */
    TsDom.convertToJsProperty = function(propertyName) {
      propertyName = propertyName.toLowerCase().replace('-', ' ');
      propertyName = propertyName.replace(/(^| )(\\w)/g, function(x) {
        return x.toUpperCase();
      });
      propertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
      return propertyName.replace(' ', '');
    };

    /**
     *
     * @returns {any}
     */
    TsDom.prototype.getLastNode = function() {
      return this.nodes[this.nodes.length - 1];
    };

    return TsDom;

  }());

  exports.TsDom = TsDom;

  //# sourceURL=webpack://ColorPicker.Default/./src/ts/model/tsdom.ts?");

  /***/

})

/******/
});

});