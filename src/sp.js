

// ***** File: \js\banner.js *****

/*!
 * Snowplow - The world's most powerful web analytics platform
 *
 * @description JavaScript tracker for Snowplow
 * @version     0.13.0
 * @author      Alex Dean, Simon Andersson, Anthon Pang
 * @copyright   Anthon Pang, Snowplow Analytics Ltd
 * @license     Simplified BSD
 */

/*
 * For technical documentation:
 * https://github.com/snowplow/snowplow/wiki/javascript-tracker
 *
 * For the setup guide:
 * https://github.com/snowplow/snowplow/wiki/javascript-tracker-setup
 * /

/*
 * Browser [In]Compatibility
 * - minimum required ECMAScript: ECMA-262, edition 3
 *
 * Incompatible with these (and earlier) versions of:
 * - IE4 - try..catch and for..in introduced in IE5
 * - IE5 - named anonymous functions, array.push, encodeURIComponent, decodeURIComponent, and getElementsByTagName introduced in IE5.5
 * - Firefox 1.0 and Netscape 8.x - FF1.5 adds array.indexOf, among other things
 * - Mozilla 1.7 and Netscape 6.x-7.x
 * - Netscape 4.8
 * - Opera 6 - Error object (and Presto) introduced in Opera 7
 * - Opera 7
 */



// ***** File: \js\lib\json.js *****

/*
 * json2.js
 *
 * @description Creates a global JSON2 object
 * @version     N/A
 * @author      Douglas Crockford (https://github.com/douglascrockford)
 * @license     Public Domain
 * @link        https://github.com/douglascrockford/JSON-js/raw/master/json2.js
 *
 * Modifications:
 * - None
 */

/*jslint evil: true, regexp: false, bitwise: true */
/*global JSON2 */
/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON2, "\\", apply,
	call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	lastIndex, length, parse, prototype, push, replace, slice, stringify,
	test, toJSON, toString, valueOf,
	objectToJSON
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (!this.JSON2) {
	this.JSON2 = {};
}

(function () {
	"use strict";

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	function objectToJSON(value, key) {
		var objectType = Object.prototype.toString.apply(value);

		if (objectType === '[object Date]') {
			return isFinite(value.valueOf()) ?
					value.getUTCFullYear()     + '-' +
					f(value.getUTCMonth() + 1) + '-' +
					f(value.getUTCDate())      + 'T' +
					f(value.getUTCHours())     + ':' +
					f(value.getUTCMinutes())   + ':' +
					f(value.getUTCSeconds())   + 'Z' : null;
		}

		if (objectType === '[object String]' ||
				objectType === '[object Number]' ||
				objectType === '[object Boolean]') {
			return value.valueOf();
		}

		if (objectType !== '[object Array]' &&
				typeof value.toJSON === 'function') {
			return value.toJSON(key);
		}

		return value;
	}

	var cx = new RegExp('[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', 'g'),
	// hack: workaround Snort false positive (sid 8443)
		pattern = '\\\\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]',
		escapable = new RegExp('[' + pattern, 'g'),
		gap,
		indent,
		meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;

	function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ? c :
					'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}

	function str(key, holder) {

// Produce a string from holder[key].

		var i,          // The loop counter.
			k,          // The member key.
			v,          // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object') {
			value = objectToJSON(value, key);
		}

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

// What happens next depends on the value's type.

		switch (typeof value) {
		case 'string':
			return quote(value);

		case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

			return isFinite(value) ? String(value) : 'null';

		case 'boolean':
		case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

			return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

		case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

			if (!value) {
				return 'null';
			}

// Make an array to hold the partial results of stringifying this object value.

			gap += indent;
			partial = [];

// Is the value an array?

			if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

				v = partial.length === 0 ? '[]' : gap ?
						'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
						'[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

// If the replacer is an array, use it to select the members to be stringified.

			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === 'string') {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {

// Otherwise, iterate through all of the keys in the object.

				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

			v = partial.length === 0 ? '{}' : gap ?
					'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
					'{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}

// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON2.stringify !== 'function') {
		JSON2.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
					(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

			return str('', {'': value});
		};
	}

// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON2.parse !== 'function') {
		JSON2.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if ((new RegExp('^[\\],:{}\\s]*$'))
					.test(text.replace(new RegExp('\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})', 'g'), '@')
						.replace(new RegExp('"[^"\\\\\n\r]*"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?', 'g'), ']')
						.replace(new RegExp('(?:^|:|,)(?:\\s*\\[)+', 'g'), ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function' ?
						walk({'': j}, '') : j;
			}

// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}());



// ***** File: \js\lib\jstz.js *****

/*
 * jstz.js
 *
 * @description Makes a robust determination of a user's timezone
 * @version     2012-05-10
 * @author      Jon Nylander (https://bitbucket.org/pellepim)
 * @license     MIT
 * @link        https://bitbucket.org/pellepim/jstimezonedetect/raw/f83d5a26fa638f7cc528430005761febb20ae447/detect_timezone.js
 *
 * Modifications:
 * - None
 */

/*jslint undef: true */
/*global console*/
/*global exports*/
/*version 2012-05-10*/

(function(root) {
  /**
   * Namespace to hold all the code for timezone detection.
   */
  var jstz = (function () {
      'use strict';
      var HEMISPHERE_SOUTH = 's',

          /**
           * Gets the offset in minutes from UTC for a certain date.
           * @param {Date} date
           * @returns {Number}
           */
          get_date_offset = function (date) {
              var offset = -date.getTimezoneOffset();
              return (offset !== null ? offset : 0);
          },

          get_january_offset = function () {
              return get_date_offset(new Date(2010, 0, 1, 0, 0, 0, 0));
          },

          get_june_offset = function () {
              return get_date_offset(new Date(2010, 5, 1, 0, 0, 0, 0));
          },

          /**
           * Private method.
           * Checks whether a given date is in daylight savings time.
           * If the date supplied is after june, we assume that we're checking
           * for southern hemisphere DST.
           * @param {Date} date
           * @returns {Boolean}
           */
          date_is_dst = function (date) {
              var base_offset = ((date.getMonth() > 5 ? get_june_offset()
                                                  : get_january_offset())),
                  date_offset = get_date_offset(date);

              return (base_offset - date_offset) !== 0;
          },

          /**
           * This function does some basic calculations to create information about
           * the user's timezone.
           *
           * Returns a key that can be used to do lookups in jstz.olson.timezones.
           *
           * @returns {String}
           */

          lookup_key = function () {
              var january_offset = get_january_offset(),
                  june_offset = get_june_offset(),
                  diff = get_january_offset() - get_june_offset();

              if (diff < 0) {
                  return january_offset + ",1";
              } else if (diff > 0) {
                  return june_offset + ",1," + HEMISPHERE_SOUTH;
              }

              return january_offset + ",0";
          },

          /**
           * Uses get_timezone_info() to formulate a key to use in the olson.timezones dictionary.
           *
           * Returns a primitive object on the format:
           * {'timezone': TimeZone, 'key' : 'the key used to find the TimeZone object'}
           *
           * @returns Object
           */
          determine = function () {
              var key = lookup_key();
              return new jstz.TimeZone(jstz.olson.timezones[key]);
          };

      return {
          determine_timezone : function () {
              if (typeof console !== 'undefined') {
                  console.log("jstz.determine_timezone() is deprecated and will be removed in an upcoming version. Please use jstz.determine() instead.");
              }
              return determine();
          },
          determine: determine,
          date_is_dst : date_is_dst
      };
  }());

  /**
   * Simple object to perform ambiguity check and to return name of time zone.
   */
  jstz.TimeZone = function (tz_name) {
      'use strict';
      var timezone_name = null,

          name = function () {
              return timezone_name;
          },

          /**
           * Checks if a timezone has possible ambiguities. I.e timezones that are similar.
           *
           * For example, if the preliminary scan determines that we're in America/Denver.
           * We double check here that we're really there and not in America/Mazatlan.
           *
           * This is done by checking known dates for when daylight savings start for different
           * timezones during 2010 and 2011.
           */
          ambiguity_check = function () {
              var ambiguity_list = jstz.olson.ambiguity_list[timezone_name],
                  length = ambiguity_list.length,
                  i = 0,
                  tz = ambiguity_list[0];

              for (; i < length; i += 1) {
                  tz = ambiguity_list[i];

                  if (jstz.date_is_dst(jstz.olson.dst_start_dates[tz])) {
                      timezone_name = tz;
                      return;
                  }
              }
          },

          /**
           * Checks if it is possible that the timezone is ambiguous.
           */
          is_ambiguous = function () {
              return typeof (jstz.olson.ambiguity_list[timezone_name]) !== 'undefined';
          };



      timezone_name = tz_name;
      if (is_ambiguous()) {
          ambiguity_check();
      }

      return {
          name: name
      };
  };

  jstz.olson = {};

  /*
   * The keys in this dictionary are comma separated as such:
   *
   * First the offset compared to UTC time in minutes.
   *
   * Then a flag which is 0 if the timezone does not take daylight savings into account and 1 if it
   * does.
   *
   * Thirdly an optional 's' signifies that the timezone is in the southern hemisphere,
   * only interesting for timezones with DST.
   *
   * The mapped arrays is used for constructing the jstz.TimeZone object from within
   * jstz.determine_timezone();
   */
  jstz.olson.timezones = {
      '-720,0'   : 'Etc/GMT+12',
      '-660,0'   : 'Pacific/Pago_Pago',
      '-600,1'   : 'America/Adak',
      '-600,0'   : 'Pacific/Honolulu',
      '-570,0'   : 'Pacific/Marquesas',
      '-540,0'   : 'Pacific/Gambier',
      '-540,1'   : 'America/Anchorage',
      '-480,1'   : 'America/Los_Angeles',
      '-480,0'   : 'Pacific/Pitcairn',
      '-420,0'   : 'America/Phoenix',
      '-420,1'   : 'America/Denver',
      '-360,0'   : 'America/Guatemala',
      '-360,1'   : 'America/Chicago',
      '-360,1,s' : 'Pacific/Easter',
      '-300,0'   : 'America/Bogota',
      '-300,1'   : 'America/New_York',
      '-270,0'   : 'America/Caracas',
      '-240,1'   : 'America/Halifax',
      '-240,0'   : 'America/Santo_Domingo',
      '-240,1,s' : 'America/Asuncion',
      '-210,1'   : 'America/St_Johns',
      '-180,1'   : 'America/Godthab',
      '-180,0'   : 'America/Argentina/Buenos_Aires',
      '-180,1,s' : 'America/Montevideo',
      '-120,0'   : 'America/Noronha',
      '-120,1'   : 'Etc/GMT+2',
      '-60,1'    : 'Atlantic/Azores',
      '-60,0'    : 'Atlantic/Cape_Verde',
      '0,0'      : 'Etc/UTC',
      '0,1'      : 'Europe/London',
      '60,1'     : 'Europe/Berlin',
      '60,0'     : 'Africa/Lagos',
      '60,1,s'   : 'Africa/Windhoek',
      '120,1'    : 'Asia/Beirut',
      '120,0'    : 'Africa/Johannesburg',
      '180,1'    : 'Europe/Moscow',
      '180,0'    : 'Asia/Baghdad',
      '210,1'    : 'Asia/Tehran',
      '240,0'    : 'Asia/Dubai',
      '240,1'    : 'Asia/Yerevan',
      '270,0'    : 'Asia/Kabul',
      '300,1'    : 'Asia/Yekaterinburg',
      '300,0'    : 'Asia/Karachi',
      '330,0'    : 'Asia/Kolkata',
      '345,0'    : 'Asia/Kathmandu',
      '360,0'    : 'Asia/Dhaka',
      '360,1'    : 'Asia/Omsk',
      '390,0'    : 'Asia/Rangoon',
      '420,1'    : 'Asia/Krasnoyarsk',
      '420,0'    : 'Asia/Jakarta',
      '480,0'    : 'Asia/Shanghai',
      '480,1'    : 'Asia/Irkutsk',
      '525,0'    : 'Australia/Eucla',
      '525,1,s'  : 'Australia/Eucla',
      '540,1'    : 'Asia/Yakutsk',
      '540,0'    : 'Asia/Tokyo',
      '570,0'    : 'Australia/Darwin',
      '570,1,s'  : 'Australia/Adelaide',
      '600,0'    : 'Australia/Brisbane',
      '600,1'    : 'Asia/Vladivostok',
      '600,1,s'  : 'Australia/Sydney',
      '630,1,s'  : 'Australia/Lord_Howe',
      '660,1'    : 'Asia/Kamchatka',
      '660,0'    : 'Pacific/Noumea',
      '690,0'    : 'Pacific/Norfolk',
      '720,1,s'  : 'Pacific/Auckland',
      '720,0'    : 'Pacific/Tarawa',
      '765,1,s'  : 'Pacific/Chatham',
      '780,0'    : 'Pacific/Tongatapu',
      '780,1,s'  : 'Pacific/Apia',
      '840,0'    : 'Pacific/Kiritimati'
  };


  /**
   * This object contains information on when daylight savings starts for
   * different timezones.
   *
   * The list is short for a reason. Often we do not have to be very specific
   * to single out the correct timezone. But when we do, this list comes in
   * handy.
   *
   * Each value is a date denoting when daylight savings starts for that timezone.
   */
  jstz.olson.dst_start_dates = {
      'America/Denver' : new Date(2011, 2, 13, 3, 0, 0, 0),
      'America/Mazatlan' : new Date(2011, 3, 3, 3, 0, 0, 0),
      'America/Chicago' : new Date(2011, 2, 13, 3, 0, 0, 0),
      'America/Mexico_City' : new Date(2011, 3, 3, 3, 0, 0, 0),
      'Atlantic/Stanley' : new Date(2011, 8, 4, 7, 0, 0, 0),
      'America/Asuncion' : new Date(2011, 9, 2, 3, 0, 0, 0),
      'America/Santiago' : new Date(2011, 9, 9, 3, 0, 0, 0),
      'America/Campo_Grande' : new Date(2011, 9, 16, 5, 0, 0, 0),
      'America/Montevideo' : new Date(2011, 9, 2, 3, 0, 0, 0),
      'America/Sao_Paulo' : new Date(2011, 9, 16, 5, 0, 0, 0),
      'America/Los_Angeles' : new Date(2011, 2, 13, 8, 0, 0, 0),
      'America/Santa_Isabel' : new Date(2011, 3, 5, 8, 0, 0, 0),
      'America/Havana' : new Date(2011, 2, 13, 2, 0, 0, 0),
      'America/New_York' : new Date(2011, 2, 13, 7, 0, 0, 0),
      'Asia/Gaza' : new Date(2011, 2, 26, 23, 0, 0, 0),
      'Asia/Beirut' : new Date(2011, 2, 27, 1, 0, 0, 0),
      'Europe/Minsk' : new Date(2011, 2, 27, 2, 0, 0, 0),
      'Europe/Helsinki' : new Date(2011, 2, 27, 4, 0, 0, 0),
      'Europe/Istanbul' : new Date(2011, 2, 28, 5, 0, 0, 0),
      'Asia/Damascus' : new Date(2011, 3, 1, 2, 0, 0, 0),
      'Asia/Jerusalem' : new Date(2011, 3, 1, 6, 0, 0, 0),
      'Africa/Cairo' : new Date(2010, 3, 30, 4, 0, 0, 0),
      'Asia/Yerevan' : new Date(2011, 2, 27, 4, 0, 0, 0),
      'Asia/Baku'    : new Date(2011, 2, 27, 8, 0, 0, 0),
      'Pacific/Auckland' : new Date(2011, 8, 26, 7, 0, 0, 0),
      'Pacific/Fiji' : new Date(2010, 11, 29, 23, 0, 0, 0),
      'America/Halifax' : new Date(2011, 2, 13, 6, 0, 0, 0),
      'America/Goose_Bay' : new Date(2011, 2, 13, 2, 1, 0, 0),
      'America/Miquelon' : new Date(2011, 2, 13, 5, 0, 0, 0),
      'America/Godthab' : new Date(2011, 2, 27, 1, 0, 0, 0)
  };

  /**
   * The keys in this object are timezones that we know may be ambiguous after
   * a preliminary scan through the olson_tz object.
   *
   * The array of timezones to compare must be in the order that daylight savings
   * starts for the regions.
   */
  jstz.olson.ambiguity_list = {
      'America/Denver' : ['America/Denver', 'America/Mazatlan'],
      'America/Chicago' : ['America/Chicago', 'America/Mexico_City'],
      'America/Asuncion' : ['Atlantic/Stanley', 'America/Asuncion', 'America/Santiago', 'America/Campo_Grande'],
      'America/Montevideo' : ['America/Montevideo', 'America/Sao_Paulo'],
      'Asia/Beirut' : ['Asia/Gaza', 'Asia/Beirut', 'Europe/Minsk', 'Europe/Helsinki', 'Europe/Istanbul', 'Asia/Damascus', 'Asia/Jerusalem', 'Africa/Cairo'],
      'Asia/Yerevan' : ['Asia/Yerevan', 'Asia/Baku'],
      'Pacific/Auckland' : ['Pacific/Auckland', 'Pacific/Fiji'],
      'America/Los_Angeles' : ['America/Los_Angeles', 'America/Santa_Isabel'],
      'America/New_York' : ['America/Havana', 'America/New_York'],
      'America/Halifax' : ['America/Goose_Bay', 'America/Halifax'],
      'America/Godthab' : ['America/Miquelon', 'America/Godthab']
  };

  if (typeof exports !== 'undefined') {
    exports.jstz = jstz;
  } else {
    root.jstz = jstz;
  }
})(this);



// ***** File: \js\init.js *****

/*
 * JavaScript tracker for Snowplow: init.js
 * 
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright 
 * 2012-2014 Snowplow Analytics Ltd. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are 
 * met: 
 *
 * * Redistributions of source code must retain the above copyright 
 *   notice, this list of conditions and the following disclaimer. 
 *
 * * Redistributions in binary form must reproduce the above copyright 
 *   notice, this list of conditions and the following disclaimer in the 
 *   documentation and/or other materials provided with the distribution. 
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// SnowPlow Asynchronous Queue
var _snaq = _snaq || [];

/**
 * SnowPlow namespace.
 * Add classes and functions in this namespace.
 */
var SnowPlow = SnowPlow || function() {
	var windowAlias = window;
	return {

		/* Tracker identifier with version */
		version: 'js-0.13.0', // Update banner.js too

		expireDateTime: null,

		/* Plugins */
		plugins: {},

		/* DOM Ready */
		hasLoaded: false,
		registeredOnLoadHandlers: [],

		/* Alias frequently used globals for added minification */
		documentAlias: document,
		windowAlias: windowAlias,
		navigatorAlias: navigator,
		screenAlias: screen,

		/* Encode */
		encodeWrapper: windowAlias.encodeURIComponent,

		/* Decode */
		decodeWrapper: windowAlias.decodeURIComponent,

		/* decodeUrl */
		decodeUrl: unescape,

		/* Asynchronous tracker */
		asyncTracker: null
	}
}();



// ***** File: \js\helpers.js *****

/*
 * JavaScript tracker for Snowplow: helpers.js
 * 
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright 
 * 2012-2014 Snowplow Analytics Ltd. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are 
 * met: 
 *
 * * Redistributions of source code must retain the above copyright 
 *   notice, this list of conditions and the following disclaimer. 
 *
 * * Redistributions in binary form must reproduce the above copyright 
 *   notice, this list of conditions and the following disclaimer in the 
 *   documentation and/or other materials provided with the distribution. 
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Is property defined?
 */
SnowPlow.isDefined = function (property) {
	return typeof property !== 'undefined';
}

/**
 * Is property null?
 */
SnowPlow.isNotNull = function (property) {
	return property !== null;
}

/*
 * Is property a function?
 */
SnowPlow.isFunction = function (property) {
	return typeof property === 'function';
}

/*
 * Is property an array?
 */
SnowPlow.isArray = ('isArray' in Array) ? 
	Array.isArray : 
	function (value) {
		return Object.prototype.toString.call(value) === '[object Array]';
	}

/*
 * Is property an empty array?
 */
SnowPlow.isEmptyArray = function (property) {
	return SnowPlow.isArray(property) && property.length < 1;
}

/*
 * Is property an object?
 *
 * @return bool Returns true if property is null, an Object, or subclass of Object (i.e., an instanceof String, Date, etc.)
 */
SnowPlow.isObject = function (property) {
	return typeof property === 'object';
}

/*
 * Is property a JSON?
 */
SnowPlow.isJson = function (property) {
	return (SnowPlow.isDefined(property) && SnowPlow.isNotNull(property) && property.constructor === {}.constructor);
}

/*
 * Is property a non-empty JSON?
 */
SnowPlow.isNonEmptyJson = function (property) {
	return SnowPlow.isJson(property) && property !== {};
}

/*
 * Is property a string?
 */
SnowPlow.isString = function (property) {
	return typeof property === 'string' || property instanceof String;
}

/*
 * Is property a non-empty string?
 */
SnowPlow.isNonEmptyString = function (property) {
	return SnowPlow.isString(property) && property !== '';
}

/*
 * Is property a date?
 */
SnowPlow.isDate = function (property) {
	return Object.prototype.toString.call(property) === "[object Date]";
}

/*
 * UTF-8 encoding
 */
SnowPlow.encodeUtf8 = function (argString) {
	return SnowPlow.decodeUrl(SnowPlow.encodeWrapper(argString));
}

/**
 * Cleans up the page title
 */
SnowPlow.fixupTitle = function (title) {
	if (!SnowPlow.isString(title)) {
		title = title.text || '';

		var tmp = SnowPlow.documentAlias.getElementsByTagName('title');
		if (tmp && SnowPlow.isDefined(tmp[0])) {
			title = tmp[0].text;
		}
	}
	return title;
}

/*
 * Extract hostname from URL
 */
SnowPlow.getHostName = function (url) {
	// scheme : // [username [: password] @] hostname [: port] [/ [path] [? query] [# fragment]]
	var e = new RegExp('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)'),
		matches = e.exec(url);

	return matches ? matches[1] : url;
}

/*
 * Checks whether sessionStorage is available, in a way that
 * does not throw a SecurityError in Firefox if "always ask"
 * is enabled for cookies (https://github.com/snowplow/snowplow/issues/163).
 */
SnowPlow.hasSessionStorage = function () {
	try {
		return !!SnowPlow.windowAlias.sessionStorage;
	} catch (e) {
		return true; // SecurityError when referencing it means it exists
	}
}

/*
 * Checks whether localStorage is available, in a way that
 * does not throw a SecurityError in Firefox if "always ask"
 * is enabled for cookies (https://github.com/snowplow/snowplow/issues/163).
 */
SnowPlow.hasLocalStorage = function () {
	try {
		return !!SnowPlow.windowAlias.localStorage;
	} catch (e) {
		return true; // SecurityError when referencing it means it exists
	}
}


/*
 * Converts a date object to Unix timestamp with or without milliseconds
 */
SnowPlow.toTimestamp = function (date, milliseconds) {
	return milliseconds ? date / 1 : Math.floor(date / 1000);
}

/*
 * Converts a date object to Unix datestamp (number of days since epoch)
 */
SnowPlow.toDatestamp = function (date) {
	return Math.floor(date / 86400000);
}
  
/*
 * Fix-up URL when page rendered from search engine cache or translated page.
 * TODO: it would be nice to generalise this and/or move into the ETL phase.
 */
SnowPlow.fixupUrl = function (hostName, href, referrer) {
	/*
	 * Extract parameter from URL
	 */
	function getParameter(url, name) {
		// scheme : // [username [: password] @] hostname [: port] [/ [path] [? query] [# fragment]]
		var e = new RegExp('^(?:https?|ftp)(?::/*(?:[^?]+)[?])([^#]+)'),
			matches = e.exec(url),
			f = new RegExp('(?:^|&)' + name + '=([^&]*)'),
			result = matches ? f.exec(matches[1]) : 0;

		return result ? SnowPlow.decodeWrapper(result[1]) : '';
	}

	if (hostName === 'translate.googleusercontent.com') {		// Google
		if (referrer === '') {
			referrer = href;
		}
		href = getParameter(href, 'u');
		hostName = SnowPlow.getHostName(href);
	} else if (hostName === 'cc.bingj.com' ||					// Bing
			hostName === 'webcache.googleusercontent.com' ||	// Google
			hostName.slice(0, 5) === '74.6.') {					// Yahoo (via Inktomi 74.6.0.0/16)
		href = SnowPlow.documentAlias.links[0].href;
		hostName = SnowPlow.getHostName(href);
	}
	return [hostName, href, referrer];
}

/*
 * Fix-up domain
 */
SnowPlow.fixupDomain = function (domain) {
	var dl = domain.length;

	// remove trailing '.'
	if (domain.charAt(--dl) === '.') {
		domain = domain.slice(0, dl);
	}
	// remove leading '*'
	if (domain.slice(0, 2) === '*.') {
		domain = domain.slice(1);
	}
	return domain;
}

/*
 * Get page referrer
 */
SnowPlow.getReferrer = function () {
	var referrer = '';

	try {
		referrer = SnowPlow.windowAlias.top.document.referrer;
	} catch (e) {
		if (SnowPlow.windowAlias.parent) {
			try {
				referrer = SnowPlow.windowAlias.parent.document.referrer;
			} catch (e2) {
				referrer = '';
			}
		}
	}
	if (referrer === '') {
		referrer = SnowPlow.documentAlias.referrer;
	}

	return referrer;
}

/*
 * Cross-browser helper function to add event handler
 */
SnowPlow.addEventListener = function (element, eventType, eventHandler, useCapture) {
	if (element.addEventListener) {
		element.addEventListener(eventType, eventHandler, useCapture);
		return true;
	}
	if (element.attachEvent) {
		return element.attachEvent('on' + eventType, eventHandler);
	}
	element['on' + eventType] = eventHandler;
}

/*
 * Get cookie value
 */
SnowPlow.getCookie = function (cookieName) {
	var cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'),
			cookieMatch = cookiePattern.exec(SnowPlow.documentAlias.cookie);

	return cookieMatch ? SnowPlow.decodeWrapper(cookieMatch[2]) : 0;
}

/*
 * Set cookie value
 */
SnowPlow.setCookie = function (cookieName, value, msToExpire, path, domain, secure) {
	var expiryDate;

	// relative time to expire in milliseconds
	if (msToExpire) {
		expiryDate = new Date();
		expiryDate.setTime(expiryDate.getTime() + msToExpire);
	}

	SnowPlow.documentAlias.cookie = cookieName + '=' + SnowPlow.encodeWrapper(value) +
		(msToExpire ? ';expires=' + expiryDate.toGMTString() : '') +
		';path=' + (path || '/') +
		(domain ? ';domain=' + domain : '') +
		(secure ? ';secure' : '');
}

/*
 * Call plugin hook methods
 */
SnowPlow.executePluginMethod = function (methodName, callback) {
	var result = '',
			i,
			pluginMethod;

	for (i in SnowPlow.plugins) {
		if (Object.prototype.hasOwnProperty.call(SnowPlow.plugins, i)) {
			pluginMethod = SnowPlow.plugins[i][methodName];
			if (SnowPlow.isFunction(pluginMethod)) {
				result += pluginMethod(callback);
			}
		}
	}

	return result;
}



// ***** File: \js\lib\sha1.js *****

/*
 * sha1.js
 *
 * @description SHA1 hash function for JavaScript
 * @version     N/A
 * @author      Various (see below)
 * @license     MIT / GPL v2
 * @link        http://phpjs.org/functions/sha1:512
 *
 * Modifications:
 * - Various (see below)
 *
 * Authors & Modifications:
 *    original by: Webtoolkit.info (http://www.webtoolkit.info/)
 *  namespaced by: Michael White (http://getsprink.com)
 *       input by: Brett Zamir (http://brett-zamir.me)
 *    improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *    jslinted by: Anthon Pang (http://piwik.org)
 */

SnowPlow.sha1 = function sha1(str) {
	var
		rotate_left = function (n, s) {
			return (n << s) | (n >>> (32 - s));
		},

		cvt_hex = function (val) {
			var str = '',
				i,
				v;

			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 0x0f;
				str += v.toString(16);
			}
			return str;
		},

		blockstart,
		i,
		j,
		W = [],
		H0 = 0x67452301,
		H1 = 0xEFCDAB89,
		H2 = 0x98BADCFE,
		H3 = 0x10325476,
		H4 = 0xC3D2E1F0,
		A,
		B,
		C,
		D,
		E,
		temp,
		str_len,
		word_array = [];

	str = SnowPlow.encodeUtf8(str);
	str_len = str.length;

	for (i = 0; i < str_len - 3; i += 4) {
		j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
			str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (str_len & 3) {
	case 0:
		i = 0x080000000;
		break;
	case 1:
		i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
		break;
	case 2:
		i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
		break;
	case 3:
		i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
		break;
	}

	word_array.push(i);

	while ((word_array.length & 15) !== 14) {
		word_array.push(0);
	}

	word_array.push(str_len >>> 29);
	word_array.push((str_len << 3) & 0x0ffffffff);

	for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
		for (i = 0; i < 16; i++) {
			W[i] = word_array[blockstart + i];
		}

		for (i = 16; i <= 79; i++) {
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
		}

		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for (i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for (i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for (i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for (i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
	}

	temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	return temp.toLowerCase();
}



// ***** File: \js\lib\murmur.js *****

/*
 * murmur.js
 *
 * @description JS Implementation of MurmurHash3
 * @version     r136 2011-05-20
 * @author      Gary Court (gary.court@gmail.com)
 * @license     MIT
 * @link        http://github.com/garycourt/murmurhash-js
 *
 * Modifications:
 * - Added into SnowPlow namespace
 */

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash 
 */

SnowPlow.murmurhash3_32_gc = function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;

		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}

	k1 = 0;

	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);

		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}

	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}



// ***** File: \js\lib\base64.js *****

/*
 * base64.js
 *
 * @description Base64 encoding function for JavaScript
 * @version     N/A
 * @author      Various (see below)
 * @license     MIT / GPL v2
 * @link        http://phpjs.org/functions/base64_encode
 *
 * Modifications:
 * - Various (see below)
 *
 * Authors & Modifications:
 * http://kevin.vanzonneveld.net
 *   original by: Tyler Akins (http://rumkin.com)
 *   improved by: Bayron Guevara
 *   improved by: Thunder.m
 *   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *   bugfixed by: Pellentesque Malesuada
 *   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *   improved by: Rafał Kukawski (http://kukawski.pl)
 */

SnowPlow.base64encode = function(data) {
  if (!data) return data;
  if (typeof window['btoa'] == 'function') return btoa(data);

  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits,
      i = 0,
      ac = 0,
      enc = "",
      tmp_arr = [];

  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');
  var r = data.length % 3;
  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};

/*
 * Bas64 encode data with URL and Filename Safe Alphabet (base64url)
 *
 * See: http://tools.ietf.org/html/rfc4648#page-7
 */
SnowPlow.base64urlencode = function(data) {
  if (!data) return data;

  var enc = SnowPlow.base64encode(data);
  return enc.replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
};

/*
 * Base64 decode data
 */
SnowPlow.base64decode = function(data) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;

  data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  do {
    enc1 = keyStr.indexOf(data.charAt(i++));
    enc2 = keyStr.indexOf(data.charAt(i++));
    enc3 = keyStr.indexOf(data.charAt(i++));
    enc4 = keyStr.indexOf(data.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }

    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < data.length);

  return unescape(output);
};


// ***** File: \js\tracker.js *****

/*
 * JavaScript tracker for Snowplow: tracker.js
 * 
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright 
 * 2012-2014 Snowplow Analytics Ltd. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are 
 * met: 
 *
 * * Redistributions of source code must retain the above copyright 
 *   notice, this list of conditions and the following disclaimer. 
 *
 * * Redistributions in binary form must reproduce the above copyright 
 *   notice, this list of conditions and the following disclaimer in the 
 *   documentation and/or other materials provided with the distribution. 
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * SnowPlow Tracker class
 *
 * Takes an argmap as its sole parameter. Argmap supports:
 *
 * 1. Empty             - to initialize an Async Tracker
 * 2. {cf: 'subdomain'} - to initialize a Sync Tracker with
 *                        a CloudFront-based collector 
 * 3. {url: 'rawurl'}   - to initialize a Sync Tracker with a
 *                        URL-based collector
 *
 * See also: Tracker.setCollectorUrl() and Tracker.setCollectorCf()
 */
SnowPlow.Tracker = function Tracker(argmap) {

	/************************************************************
	 * Private members
	 ************************************************************/

	var
/*<DEBUG>*/
		/*
		 * registered test hooks
		 */
		registeredHooks = {},
/*</DEBUG>*/

		// Current URL and Referrer URL
		locationArray = SnowPlow.fixupUrl(SnowPlow.documentAlias.domain, SnowPlow.windowAlias.location.href, SnowPlow.getReferrer()),
		domainAlias = SnowPlow.fixupDomain(locationArray[0]),
		locationHrefAlias = locationArray[1],
		configReferrerUrl = locationArray[2],

		// Request method is always GET for SnowPlow
		configRequestMethod = 'GET',

		// Platform defaults to web for this tracker
		configPlatform = 'web',

		// SnowPlow collector URL
		configCollectorUrl = constructCollectorUrl(argmap),

		// Site ID
		configTrackerSiteId = '', // Updated for SnowPlow

		// Document URL
		configCustomUrl,

		// Document title
		configTitle = SnowPlow.documentAlias.title,

		// Extensions to be treated as download links
		configDownloadExtensions = '7z|aac|ar[cj]|as[fx]|avi|bin|csv|deb|dmg|doc|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|ms[ip]|od[bfgpst]|og[gv]|pdf|phps|png|ppt|qtm?|ra[mr]?|rpm|sea|sit|tar|t?bz2?|tgz|torrent|txt|wav|wm[av]|wpd||xls|xml|z|zip',

		// Hosts or alias(es) to not treat as outlinks
		configHostsAlias = [domainAlias],

		// HTML anchor element classes to not track
		configIgnoreClasses = [],

		// HTML anchor element classes to treat as downloads
		configDownloadClasses = [],

		// HTML anchor element classes to treat at outlinks
		configLinkClasses = [],

		// Maximum delay to wait for web bug image to be fetched (in milliseconds)
		configTrackerPause = 500,

		// Minimum visit time after initial page view (in milliseconds)
		configMinimumVisitTime,

		// Recurring heart beat after initial ping (in milliseconds)
		configHeartBeatTimer,

		// Disallow hash tags in URL
		configDiscardHashTag,

		// First-party cookie name prefix
		configCookieNamePrefix = '_sp_',

		// First-party cookie domain
		// User agent defaults to origin hostname
		configCookieDomain,

		// First-party cookie path
		// Default is user agent defined.
		configCookiePath,

		// Do Not Track
		configDoNotTrack,

		// Count sites which are pre-rendered
		configCountPreRendered,

		// Life of the visitor cookie (in milliseconds)
		configVisitorCookieTimeout = 63072000000, // 2 years

		// Life of the session cookie (in milliseconds)
		configSessionCookieTimeout = 1800000, // 30 minutes

		// Life of the referral cookie (in milliseconds)
		configReferralCookieTimeout = 15768000000, // 6 months

    // Enable Base64 encoding for unstructured events
    configEncodeBase64 = true,

		// Document character set
		documentCharset = SnowPlow.documentAlias.characterSet || SnowPlow.documentAlias.charset,

		// Browser language (or Windows language for IE). Imperfect but CloudFront doesn't log the Accept-Language header
		browserLanguage = SnowPlow.navigatorAlias.userLanguage || SnowPlow.navigatorAlias.language,

		// Browser features via client-side data collection
		browserFeatures = detectBrowserFeatures(),

		// Visitor timezone
		timezone = detectTimezone(),

		// Visitor fingerprint
		fingerprint = generateFingerprint(),

		// Guard against installing the link tracker more than once per Tracker instance
		linkTrackingInstalled = false,

		// Guard against installing the activity tracker more than once per Tracker instance
		activityTrackingInstalled = false,

		// Last activity timestamp
		lastActivityTime,

		// How are we scrolling?
		minXOffset,
		maxXOffset,
		minYOffset,
		maxYOffset,

		// Internal state of the pseudo click handler
		lastButton,
		lastTarget,

		// Hash function
		hash = SnowPlow.sha1,

		// Domain hash value
		domainHash,

		// Domain unique user ID
		domainUserId,

		// Business-defined unique user ID
		businessUserId,

		// Ecommerce transaction data
		// Will be committed, sent and emptied by a call to trackTrans.
		ecommerceTransaction = ecommerceTransactionTemplate();

	/**
	 * Determines how to build our collector URL,
	 * based on the argmap passed into the
	 * Tracker's constructor.
	 */
	function constructCollectorUrl(argmap) {
		if (typeof argmap === "undefined") {
			return null; // JavaScript joys, changing an undefined into a null
		} else if ('cf' in argmap) {
			return collectorUrlFromCfDist(argmap.cf);
		} else if ('url' in argmap) {
			return asCollectorUrl(argmap.url);
		}
	}

	/*
	 * Initializes an empty ecommerce
	 * transaction and line items
	 */
	function ecommerceTransactionTemplate() {
		return { transaction: {}, items: [] }
	}

	/*
	 * Removes hash tag from the URL
	 *
	 * URLs are purified before being recorded in the cookie,
	 * or before being sent as GET parameters
	 */
	function purify(url) {
		var targetPattern;

		if (configDiscardHashTag) {
			targetPattern = new RegExp('#.*');
			return url.replace(targetPattern, '');
		}
		return url;
	}

	/*
	 * Extract scheme/protocol from URL
	 */
	function getProtocolScheme(url) {
		var e = new RegExp('^([a-z]+):'),
		matches = e.exec(url);

		return matches ? matches[1] : null;
	}

	/*
	 * Resolve relative reference
	 *
	 * Note: not as described in rfc3986 section 5.2
	 */
	function resolveRelativeReference(baseUrl, url) {
		var protocol = getProtocolScheme(url),
			i;

		if (protocol) {
			return url;
		}

		if (url.slice(0, 1) === '/') {
			return getProtocolScheme(baseUrl) + '://' + SnowPlow.getHostName(baseUrl) + url;
		}

		baseUrl = purify(baseUrl);
		if ((i = baseUrl.indexOf('?')) >= 0) {
			baseUrl = baseUrl.slice(0, i);
		}
		if ((i = baseUrl.lastIndexOf('/')) !== baseUrl.length - 1) {
			baseUrl = baseUrl.slice(0, i + 1);
		}

		return baseUrl + url;
	}

	/*
	 * Is the host local? (i.e., not an outlink)
	 *
	 * This is a pretty flawed approach - assumes
	 * a website only has one domain.
	 *
	 * TODO: I think we can blow this away for
	 * SnowPlow and handle the equivalent with a
	 * whitelist of the site's domains. 
	 * 
	 */
	function isSiteHostName(hostName) {
		var i,
			alias,
			offset;

		for (i = 0; i < configHostsAlias.length; i++) {

			alias = SnowPlow.fixupDomain(configHostsAlias[i].toLowerCase());

			if (hostName === alias) {
				return true;
			}

			if (alias.slice(0, 1) === '.') {
				if (hostName === alias.slice(1)) {
					return true;
				}

				offset = hostName.length - alias.length;
				if ((offset > 0) && (hostName.slice(offset) === alias)) {
					return true;
				}
			}
		}
		return false;
	}

	/*
	 * Send image request to the SnowPlow Collector using GET.
	 * The Collector serves a transparent, single pixel (1x1) GIF
	 */
	function getImage(request) {

		var image = new Image(1, 1);

		// Let's chec that we have a Url to ping
		if (configCollectorUrl === null) {
			throw "No SnowPlow collector configured, cannot track";
		}

		// Okay? Let's proceed.
		image.onload = function () { };
		image.src = configCollectorUrl + request;
	}

	/*
	 * Send request
	 */
	function sendRequest(request, delay) {
		var now = new Date();

		if (!configDoNotTrack) {
			getImage(request);
			SnowPlow.expireDateTime = now.getTime() + delay;
		}
	}

	/*
	 * Get cookie name with prefix and domain hash
	 */
	function getCookieName(baseName) {
		return configCookieNamePrefix + baseName + '.' + domainHash;
	}

	/*
	 * Legacy getCookieName. This is the old version inherited from
	 * Piwik which includes the site ID. Including the site ID in
	 * the user cookie doesn't make sense, so we have removed it.
	 * But, to avoid breaking sites with existing cookies, we leave
	 * this function in as a legacy, and use it to check for a
	 * 'legacy' cookie.
	 *
	 * TODO: delete in February 2013 or so!
	 */
	function getLegacyCookieName(baseName) {
		return configCookieNamePrefix + baseName + '.' + configTrackerSiteId + '.' + domainHash;
	}

	/*
	 * Cookie getter.
	 *
	 * This exists because we cannot guarantee whether a cookie will
	 * be available using getCookieName or getLegacyCookieName (i.e.
	 * whether the cookie includes the legacy site ID in its name).
	 *
	 * This wrapper supports both.
	 *
	 * TODO: simplify in February 2013 back to:
	 * return SnowPlow.getCookie(getCookieName(cookieName));
	 */
	function getCookieValue(cookieName) {

		// First we try the new cookie
		var cookieValue = SnowPlow.getCookie(getCookieName(cookieName));
		if (cookieValue) {
			return cookieValue;
		}

		// Last we try the legacy cookie. May still return failure.
		return SnowPlow.getCookie(getLegacyCookieName(cookieName));
	}

	/*
	 * Does browser have cookies enabled (for this site)?
	 */
	function hasCookies() {
		var testCookieName = getCookieName('testcookie');

		if (!SnowPlow.isDefined(SnowPlow.navigatorAlias.cookieEnabled)) {
			SnowPlow.setCookie(testCookieName, '1');
			return SnowPlow.getCookie(testCookieName) === '1' ? '1' : '0';
		}

		return SnowPlow.navigatorAlias.cookieEnabled ? '1' : '0';
	}

	/*
	 * Update domain hash
	 */
	function updateDomainHash() {
		domainHash = hash((configCookieDomain || domainAlias) + (configCookiePath || '/')).slice(0, 4); // 4 hexits = 16 bits
	}

	/*
	 * Process all "activity" events.
	 * For performance, this function must have low overhead.
	 */
	function activityHandler() {
		var now = new Date();
		lastActivityTime = now.getTime();
	}

	/*
	 * Process all "scroll" events.
	 */
	function scrollHandler() {
		updateMaxScrolls();
		activityHandler();
	}

	/*
	 * Returns [pageXOffset, pageYOffset].
	 * Adapts code taken from: http://www.javascriptkit.com/javatutors/static2.shtml
	 */
	function getPageOffsets() {
		var iebody = (SnowPlow.documentAlias.compatMode && SnowPlow.documentAlias.compatMode != "BackCompat") ?
		               SnowPlow.documentAlias.documentElement :
		               SnowPlow.documentAlias.body;
		return [iebody.scrollLeft || SnowPlow.windowAlias.pageXOffset,
		       iebody.scrollTop || SnowPlow.windowAlias.pageYOffset];
	}

	/*
	 * Quick initialization/reset of max scroll levels
	 */
	function resetMaxScrolls() {
		var offsets = getPageOffsets();
		
		var x = offsets[0];
		minXOffset = x;
		maxXOffset = x;
		
		var y = offsets[1];
		minYOffset = y;
		maxYOffset = y;
	}

	/*
	 * Check the max scroll levels, updating as necessary
	 */
	function updateMaxScrolls() {
		var offsets = getPageOffsets();
		
		var x = offsets[0];
		if (x < minXOffset) {
			minXOffset = x;
		} else if (x > maxXOffset) {
			maxXOffset = x;
		}

		var y = offsets[1];
		if (y < minYOffset) {
			minYOffset = y;
		} else if (y > maxYOffset) {
			maxYOffset = y;
		}	
	}

	/*
	 * Sets the Visitor ID cookie: either the first time loadDomainUserIdCookie is called
	 * or when there is a new visit or a new page view
	 */
	function setDomainUserIdCookie(_domainUserId, createTs, visitCount, nowTs, lastVisitTs) {
		SnowPlow.setCookie(getCookieName('id'), _domainUserId + '.' + createTs + '.' + visitCount + '.' + nowTs + '.' + lastVisitTs, configVisitorCookieTimeout, configCookiePath, configCookieDomain);
	}

	/*
	 * Load visitor ID cookie
	 */
	function loadDomainUserIdCookie() {
		var now = new Date(),
			nowTs = Math.round(now.getTime() / 1000),
			id = getCookieValue('id'),
			tmpContainer;

		if (id) {
			tmpContainer = id.split('.');
			// New visitor set to 0 now
			tmpContainer.unshift('0');
		} else {
			// Domain - generate a pseudo-unique ID to fingerprint this user;
			// Note: this isn't a RFC4122-compliant UUID
			if (!domainUserId) {
				domainUserId = hash(
					(SnowPlow.navigatorAlias.userAgent || '') +
						(SnowPlow.navigatorAlias.platform || '') +
						JSON2.stringify(browserFeatures) + nowTs
				).slice(0, 16); // 16 hexits = 64 bits
			}

			tmpContainer = [
				// New visitor
				'1',
				// Domain user ID
				domainUserId,
				// Creation timestamp - seconds since Unix epoch
				nowTs,
				// visitCount - 0 = no previous visit
				0,
				// Current visit timestamp
				nowTs,
				// Last visit timestamp - blank meaning no previous visit
				''
			];
		}
		return tmpContainer;
	}

	/*
	 * Get the current timestamp:
	 * milliseconds since epoch.
	 */
	function getTimestamp() {
		var now = new Date(),
			nowTs = now.getTime();

		return nowTs;
	}

	/*
	 * Attaches all the common web fields to the request
	 * (resolution, url, referrer, etc.)
	 * Also sets the required cookies.
	 *
	 * Takes in a string builder, adds in parameters to it
	 * and then generates the request.
	 */
	function getRequest(sb, pluginMethod) {
		var i,
			now = new Date(),
			nowTs = Math.round(now.getTime() / 1000),
			newVisitor,
			_domainUserId, // Don't shadow the global
			visitCount,
			createTs,
			currentVisitTs,
			lastVisitTs,
			referralTs,
			referralUrl,
			referralUrlMaxLength = 1024,
			currentReferrerHostName,
			originalReferrerHostName,
			idname = getCookieName('id'),
			sesname = getCookieName('ses'), // NOT sesname
			id = loadDomainUserIdCookie(),
			ses = getCookieValue('ses'),
			currentUrl = configCustomUrl || locationHrefAlias,
			featurePrefix;

		if (configDoNotTrack) {
			SnowPlow.setCookie(idname, '', -1, configCookiePath, configCookieDomain);
			SnowPlow.setCookie(sesname, '', -1, configCookiePath, configCookieDomain);
			return '';
		}

		newVisitor = id[0];
		_domainUserId = id[1]; // We could use the global (domainUserId) but this is better etiquette
		createTs = id[2];
		visitCount = id[3];
		currentVisitTs = id[4];
		lastVisitTs = id[5];

		// New session
		if (!ses) {
			// New session (aka new visit)
			visitCount++;
			// Update the last visit timestamp
			lastVisitTs = currentVisitTs;
		}

		// Build out the rest of the request - first add fields we can safely skip encoding
		sb.addRaw('dtm', getTimestamp());
		sb.addRaw('tid', String(Math.random()).slice(2, 8));
		sb.addRaw('vp', detectViewport());
		sb.addRaw('ds', detectDocumentSize());
		sb.addRaw('vid', visitCount);
		sb.addRaw('duid', _domainUserId); // Set to our local variable

		// Encode all these
		sb.add('p', configPlatform);		
		sb.add('tv', SnowPlow.version);
		sb.add('fp', fingerprint);
		sb.add('aid', configTrackerSiteId);
		sb.add('lang', browserLanguage);
		sb.add('cs', documentCharset);
		sb.add('tz', timezone);
		sb.add('uid', businessUserId); // Business-defined user ID

		// Adds with custom conditions
		if (configReferrerUrl.length) sb.add('refr', purify(configReferrerUrl));

		// Browser features. Cookies, color depth and resolution don't get prepended with f_ (because they're not optional features)
		for (i in browserFeatures) {
			if (Object.prototype.hasOwnProperty.call(browserFeatures, i)) {
				featurePrefix = (i === 'res' || i === 'cd' || i === 'cookie') ? '' : 'f_';
				sb.addRaw(featurePrefix + i, browserFeatures[i]);
			}
		}

		// Add the page URL last as it may take us over the IE limit (and we don't always need it)
		sb.add('url', purify(currentUrl));
		var request = sb.build();

		// Update cookies
		setDomainUserIdCookie(_domainUserId, createTs, visitCount, nowTs, lastVisitTs);
		SnowPlow.setCookie(sesname, '*', configSessionCookieTimeout, configCookiePath, configCookieDomain);

		// Tracker plugin hook
		// TODO: we can blow this away for SnowPlow
		request += SnowPlow.executePluginMethod(pluginMethod);

		return request;
	}

	/**
	 * Builds a collector URL from a CloudFront distribution.
	 * We don't bother to support custom CNAMEs because Amazon CloudFront doesn't support that for SSL.
	 *
	 * @param string account The account ID to build the tracker URL from
	 *
	 * @return string The URL on which the collector is hosted
	 */
	function collectorUrlFromCfDist(distSubdomain) {
		return asCollectorUrl(distSubdomain + '.cloudfront.net');
	}

	/**
	 * Adds the protocol in front of our collector URL, and i to the end
	 *
	 * @param string rawUrl The collector URL without protocol
	 *
	 * @return string collectorUrl The tracker URL with protocol
	 */
	function asCollectorUrl(rawUrl) {
		return ('https:' == SnowPlow.documentAlias.location.protocol ? 'https' : 'http') + '://' + rawUrl + '/i';               
	}

	/**
	 * A helper to build a SnowPlow request string from an
	 * an optional initial value plus a set of individual
	 * name-value pairs, provided using the add method.
	 *
	 * @param boolean base64Encode Whether or not JSONs should be
	 * Base64-URL-safe-encoded
	 *
	 * @return object The request string builder, with add, addRaw and build methods
	 */
	function requestStringBuilder(base64Encode) {
		var str = '';
		
		var addNvPair = function (key, value, encode) {
			if (SnowPlow.isNonEmptyString(value)) {
				var sep = (str.length > 0) ? "&" : "?";
				str += sep + key + '=' + (encode ? SnowPlow.encodeWrapper(value) : value);
			}
		};

		/*
		 * Extract suffix from a property
		 */
		var getPropertySuffix = function (property) {
			var e = new RegExp('\\$(.[^\\$]+)$'),
			    matches = e.exec(property);

			if (matches) return matches[1];
		};

		/*
		 * Translates a value of an unstructured date property
		 */
		var translateDateValue = function (date, type) {
		  switch (type) {
		    case 'tms':
		      return SnowPlow.toTimestamp(date, true);
		    case 'ts':
		      return SnowPlow.toTimestamp(date, false);
		    case 'dt':
		      return SnowPlow.toDatestamp(date);
		    default:
		      return date;
		  }
		};

		/*
		 * Add type suffixes as needed to JSON properties
		 */
		var appendTypes = (function() {

			function recurse(json) {
				var translated = {};
				for (var prop in json) {
					var key = prop, value = json[prop];

					// Special treatment...
					if (json.hasOwnProperty(key)) {

						// ... for JavaScript Dates
						if (SnowPlow.isDate(value)) {
							type = getPropertySuffix(key);
							if (!type) {
								type = 'tms';
								key += '$' + type;
							}
							value = translateDateValue(value, type);
						}

						// ... for JSON objects
						if (SnowPlow.isJson(value)) {
							value = recurse(value);
						}

						// TODO: should think about Arrays of Dates too
					}

					translated[key] = value;
				}
				return translated;
			}
			return recurse;
		})();

		var add = function (key, value) {
			addNvPair(key, value, true);
		};

		var addRaw = function (key, value) {
			addNvPair(key, value, false);
		};

		var addJson = function (keyIfEncoded, keyIfNotEncoded, json) {
			
			if (SnowPlow.isNonEmptyJson(json)) {
				var typed = appendTypes(json);
				var str = JSON2.stringify(typed);

				if (base64Encode) {
					addRaw(keyIfEncoded, SnowPlow.base64urlencode(str));
				} else {
					add(keyIfNotEncoded, str);
				}
			}
		};

		return {
			add: add,
			addRaw: addRaw,
			addJson: addJson,
			build: function() {
				return str;
			}
		};
	}

	/*
	 * Log the page view / visit
	 *
	 * @param string customTitle The user-defined page title to attach to this page view
	 * @param object context Custom context relating to the event
	 */
	function logPageView(customTitle, context) {

		// Fixup page title. We'll pass this to logPagePing too.
		var pageTitle = SnowPlow.fixupTitle(customTitle || configTitle);

		// Log page view
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'pv'); // 'pv' for Page View
		sb.add('page', pageTitle);
		sb.addJson('cx', 'co', context);
		var request = getRequest(sb, 'pageView');
		sendRequest(request, configTrackerPause);

		// Send ping (to log that user has stayed on page)
		var now = new Date();
		if (configMinimumVisitTime && configHeartBeatTimer && !activityTrackingInstalled) {
			activityTrackingInstalled = true;

			// Capture our initial scroll points
			resetMaxScrolls();

			// Add event handlers; cross-browser compatibility here varies significantly
			// @see http://quirksmode.org/dom/events
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'click', activityHandler);
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'mouseup', activityHandler);
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'mousedown', activityHandler);
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'mousemove', activityHandler);
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'mousewheel', activityHandler);
			SnowPlow.addEventListener(SnowPlow.windowAlias, 'DOMMouseScroll', activityHandler);
			SnowPlow.addEventListener(SnowPlow.windowAlias, 'scroll', scrollHandler); // Will updateMaxScrolls() for us
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'keypress', activityHandler);
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'keydown', activityHandler);
			SnowPlow.addEventListener(SnowPlow.documentAlias, 'keyup', activityHandler);
			SnowPlow.addEventListener(SnowPlow.windowAlias, 'resize', activityHandler);
			SnowPlow.addEventListener(SnowPlow.windowAlias, 'focus', activityHandler);
			SnowPlow.addEventListener(SnowPlow.windowAlias, 'blur', activityHandler);

			// Periodic check for activity.
			lastActivityTime = now.getTime();
			setInterval(function heartBeat() {
				var now = new Date();

				// There was activity during the heart beat period;
				// on average, this is going to overstate the visitDuration by configHeartBeatTimer/2
				if ((lastActivityTime + configHeartBeatTimer) > now.getTime()) {
					// Send ping if minimum visit time has elapsed
					if (configMinimumVisitTime < now.getTime()) {
						logPagePing(pageTitle, context); // Grab the min/max globals
					}
				}
			}, configHeartBeatTimer);
		}
	}

	/*
	 * Log that a user is still viewing a given page
	 * by sending a page ping.
	 * Not part of the public API - only called from
	 * logPageView() above.
	 *
	 * @param string pageTitle The page title to attach to this page ping
	 * @param object context Custom context relating to the event
	 */
	function logPagePing(pageTitle, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'pp'); // 'pp' for Page Ping
		sb.add('page', pageTitle);
		sb.addRaw('pp_mix', minXOffset); // Global
		sb.addRaw('pp_max', maxXOffset); // Global
		sb.addRaw('pp_miy', minYOffset); // Global
		sb.addRaw('pp_may', maxYOffset); // Global
		sb.addJson('cx', 'co', context);
		resetMaxScrolls();
		var request = getRequest(sb, 'pagePing');
		sendRequest(request, configTrackerPause);
	}

	/**
	 * Log a structured event happening on this page
	 *
	 * @param string category The name you supply for the group of objects you want to track
	 * @param string action A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object
	 * @param string label (optional) An optional string to provide additional dimensions to the event data
	 * @param string property (optional) Describes the object or the action performed on it, e.g. quantity of item added to basket
	 * @param numeric value (optional) An integer or floating point number to provide numerical data about the user event
	 * @param object context Custom context relating to the event
	 */
	function logStructEvent(category, action, label, property, value, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'se'); // 'se' for Structured Event
		sb.add('se_ca', category);
		sb.add('se_ac', action)
		sb.add('se_la', label);
		sb.add('se_pr', property);
		sb.add('se_va', value);
		sb.addJson('cx', 'co', context);
		request = getRequest(sb, 'structEvent');
		sendRequest(request, configTrackerPause);
	}

	/**
	 * Log an unstructured event happening on this page
	 *
	 * @param string name The name of the event
	 * @param object properties The properties of the event
	 * @param object context Custom context relating to the event
	 */
	function logUnstructEvent(name, properties, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'ue'); // 'ue' for Unstructured Event
		sb.add('ue_na', name);
		sb.addJson('ue_px', 'ue_pr', properties);
		sb.addJson('cx', 'co', context);
		request = getRequest(sb, 'unstructEvent');
		sendRequest(request, configTrackerPause);
	}

	/**
	 * Log ecommerce transaction metadata
	 *
	 * @param string orderId 
	 * @param string affiliation 
	 * @param string total 
	 * @param string tax 
 	 * @param string shipping 
	 * @param string city 
 	 * @param string state 
 	 * @param string country 
 	 * @param string currency The currency the total/tax/shipping are expressed in
	 * @param object context Custom context relating to the event
	 */
	// TODO: add params to comment
	function logTransaction(orderId, affiliation, total, tax, shipping, city, state, country, currency, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'tr'); // 'tr' for TRansaction
		sb.add('tr_id', orderId);
		sb.add('tr_af', affiliation);
		sb.add('tr_tt', total);
		sb.add('tr_tx', tax);
		sb.add('tr_sh', shipping);
		sb.add('tr_ci', city);
		sb.add('tr_st', state);
		sb.add('tr_co', country);
		sb.add('tr_cu', currency);
		sb.addJson('cx', 'co', context);
		var request = getRequest(sb, 'transaction');
		sendRequest(request, configTrackerPause);
	}

	/**
	 * Log ecommerce transaction item
	 *
	 * @param string orderId
	 * @param string sku
	 * @param string name
	 * @param string category
	 * @param string price
	 * @param string quantity
	 * @param string currency The currency the price is expressed in
	 * @param object context Custom context relating to the event
	 */
	// TODO: add params to comment
	function logTransactionItem(orderId, sku, name, category, price, quantity, currency, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'ti'); // 'ti' for Transaction Item
		sb.add('ti_id', orderId);
		sb.add('ti_sk', sku);
		sb.add('ti_na', name);
		sb.add('ti_ca', category);
		sb.add('ti_pr', price);
		sb.add('ti_qu', quantity);
		sb.add('ti_cu', currency);
		sb.addJson('cx', 'co', context);
		var request = getRequest(sb, 'transactionItem');
		sendRequest(request, configTrackerPause);
	}

	// ---------------------------------------
	// Next 2 log methods are not supported in
	// Snowplow Enrichment process yet

	/*
	 * Log the link or click with the server
	 *
	 * @param string url The target URL
	 * @param string linkType The type of link - link or download (see getLinkType() for details)
	 * @param object context Custom context relating to the event
	 */
	// TODO: rename to LinkClick
	// TODO: this functionality is not yet fully implemented.
	// See https://github.com/snowplow/snowplow/issues/75
	function logLink(url, linkType, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', linkType);
		sb.add('t_url', purify(url));
		var request = getRequest(sb, 'link');
		sendRequest(request, configTrackerPause);
	}

	/**
	 * Log an ad impression
	 *
	 * @param string bannerId Identifier for the ad banner displayed
	 * @param string campaignId (optional) Identifier for the campaign which the banner belongs to
	 * @param string advertiserId (optional) Identifier for the advertiser which the campaign belongs to
	 * @param string userId (optional) Ad server identifier for the viewer of the banner
	 * @param object context Custom context relating to the event
	 */
	// TODO: rename to logAdImpression and deprecate logImpression
	// TODO: should add impressionId as well.
	// TODO: should add in zoneId (aka placementId, slotId?) as well
	// TODO: change ad_ to ai_?
	function logImpression(bannerId, campaignId, advertiserId, userId, context) {
		var sb = requestStringBuilder(configEncodeBase64);
		sb.add('e', 'ad'); // 'ad' for AD impression
		sb.add('ad_ba', bannerId);
		sb.add('ad_ca', campaignId)
		sb.add('ad_ad', advertiserId);
		sb.add('ad_uid', userId);
		sb.addJson('cx', 'co', context);
		request = getRequest(sb, 'impression');
		sendRequest(request, configTrackerPause);
	}

	// TODO: add in ad clicks and conversions

	/*
	 * Browser prefix
	 */
	function prefixPropertyName(prefix, propertyName) {
		
		if (prefix !== '') {
			return prefix + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
		}

		return propertyName;
	}

	/*
	 * Check for pre-rendered web pages, and log the page view/link
	 * according to the configuration and/or visibility
	 *
	 * @see http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/PageVisibility/Overview.html
	 */
	function trackCallback(callback) {
		var isPreRendered,
			i,
			// Chrome 13, IE10, FF10
			prefixes = ['', 'webkit', 'ms', 'moz'],
			prefix;

		if (!configCountPreRendered) {
			for (i = 0; i < prefixes.length; i++) {
				prefix = prefixes[i];

				// does this browser support the page visibility API?
				if (Object.prototype.hasOwnProperty.call(SnowPlow.documentAlias, prefixPropertyName(prefix, 'hidden'))) {
					// if pre-rendered, then defer callback until page visibility changes
					if (SnowPlow.documentAlias[prefixPropertyName(prefix, 'visibilityState')] === 'prerender') {
						isPreRendered = true;
					}
					break;
				}
			}
		}

		if (isPreRendered) {
			// note: the event name doesn't follow the same naming convention as vendor properties
			SnowPlow.addEventListener(SnowPlow.documentAlias, prefix + 'visibilitychange', function ready() {
				SnowPlow.documentAlias.removeEventListener(prefix + 'visibilitychange', ready, false);
				callback();
			});
			return;
		}

		// configCountPreRendered === true || isPreRendered === false
		callback();
	}

	/*
	 * Construct regular expression of classes
	 */
	function getClassesRegExp(configClasses, defaultClass) {
		var i,
			classesRegExp = '(^| )(piwik[_-]' + defaultClass;

		if (configClasses) {
			for (i = 0; i < configClasses.length; i++) {
				classesRegExp += '|' + configClasses[i];
			}
		}
		classesRegExp += ')( |$)';

		return new RegExp(classesRegExp);
	}

	/*
	 * Link or Download?
	 */
	// TODO: why is a download assumed to always be on the same host?
	// TODO: why return 0 if can't detect it as a link or download?
	function getLinkType(className, href, isInLink) {
		// outlinks
		if (!isInLink) {
			return 'lnk';
		}

		// does class indicate whether it is an (explicit/forced) outlink or a download?
		var downloadPattern = getClassesRegExp(configDownloadClasses, 'download'),
			linkPattern = getClassesRegExp(configLinkClasses, 'link'),

			// does file extension indicate that it is a download?
			downloadExtensionsPattern = new RegExp('\\.(' + configDownloadExtensions + ')([?&#]|$)', 'i');

		return linkPattern.test(className) ? 'lnk' : (downloadPattern.test(className) || downloadExtensionsPattern.test(href) ? 'dl' : 0);
	}

	/*
	 * Process clicks
	 */
	function processClick(sourceElement) {
		var parentElement,
			tag,
			linkType;

		while ((parentElement = sourceElement.parentNode) !== null &&
				SnowPlow.isDefined(parentElement) && // buggy IE5.5
				((tag = sourceElement.tagName.toUpperCase()) !== 'A' && tag !== 'AREA')) {
			sourceElement = parentElement;
		}

		if (SnowPlow.isDefined(sourceElement.href)) {
			// browsers, such as Safari, don't downcase hostname and href
			var originalSourceHostName = sourceElement.hostname || SnowPlow.getHostName(sourceElement.href),
				sourceHostName = originalSourceHostName.toLowerCase(),
				sourceHref = sourceElement.href.replace(originalSourceHostName, sourceHostName),
				scriptProtocol = new RegExp('^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):', 'i');

			// Ignore script pseudo-protocol links
			if (!scriptProtocol.test(sourceHref)) {
				// Track outlinks and all downloads
				linkType = getLinkType(sourceElement.className, sourceHref, isSiteHostName(sourceHostName));
				if (linkType) {
					// decodeUrl %xx
					sourceHref = SnowPlow.decodeUrl(sourceHref);
					logLink(sourceHref, linkType);
				}
			}
		}
	}

	/*
	 * Handle click event
	 */
	function clickHandler(evt) {
		var button,
			target;

		evt = evt || SnowPlow.windowAlias.event;
		button = evt.which || evt.button;
		target = evt.target || evt.srcElement;

		// Using evt.type (added in IE4), we avoid defining separate handlers for mouseup and mousedown.
		if (evt.type === 'click') {
			if (target) {
				processClick(target);
			}
		} else if (evt.type === 'mousedown') {
			if ((button === 1 || button === 2) && target) {
				lastButton = button;
				lastTarget = target;
			} else {
				lastButton = lastTarget = null;
			}
		} else if (evt.type === 'mouseup') {
			if (button === lastButton && target === lastTarget) {
				processClick(target);
			}
			lastButton = lastTarget = null;
		}
	}

	/*
	 * Add click listener to a DOM element
	 */
	function addClickListener(element, enable) {
		if (enable) {
			// for simplicity and performance, we ignore drag events
			SnowPlow.addEventListener(element, 'mouseup', clickHandler, false);
			SnowPlow.addEventListener(element, 'mousedown', clickHandler, false);
		} else {
			SnowPlow.addEventListener(element, 'click', clickHandler, false);
		}
	}

	/*
	 * Add click handlers to anchor and AREA elements, except those to be ignored
	 */
	function addClickListeners(enable) {
		if (!linkTrackingInstalled) {
			linkTrackingInstalled = true;

			// iterate through anchor elements with href and AREA elements

			var i,
				ignorePattern = getClassesRegExp(configIgnoreClasses, 'ignore'),
				linkElements = SnowPlow.documentAlias.links;

			if (linkElements) {
				for (i = 0; i < linkElements.length; i++) {
					if (!ignorePattern.test(linkElements[i].className)) {
						addClickListener(linkElements[i], enable);
					}
				}
			}
		}
	}

	/*
	 * JS Implementation for browser fingerprint.
	 * Does not require any external resources.
	 * Based on https://github.com/carlo/jquery-browser-fingerprint
	 * @return {number} 32-bit positive integer hash 
	 */
	// TODO: make seed for hashing configurable
	function generateFingerprint() {

	    var fingerprint = [
	        navigator.userAgent,
	        [ screen.height, screen.width, screen.colorDepth ].join("x"),
	        ( new Date() ).getTimezoneOffset(),
	        SnowPlow.hasSessionStorage(),
	        SnowPlow.hasLocalStorage(),
	    ];

	    var plugins = [];
	    if (navigator.plugins)
	    {
	        for(var i = 0; i < navigator.plugins.length; i++)
	        {
	            var mt = [];
	            for(var j = 0; j < navigator.plugins[i].length; j++)
	            {
	                mt.push([navigator.plugins[i][j].type, navigator.plugins[i][j].suffixes]);
	            }
	            plugins.push([navigator.plugins[i].name + "::" + navigator.plugins[i].description, mt.join("~")]);
	        }
	    }
	    return SnowPlow.murmurhash3_32_gc(fingerprint.join("###") + "###" + plugins.sort().join(";"), 123412414);
	}

	/*
	 * Returns visitor timezone
	 */
	function detectTimezone() {
		var tz = jstz.determine();  
        	return (typeof (tz) === 'undefined') ? '' : tz.name();
	}

	/**
	 * Gets the current viewport.
	 *
	 * Code based on:
	 * - http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
	 * - http://responsejs.com/labs/dimensions/
	 */
	function detectViewport() {
		var e = SnowPlow.windowAlias, a = 'inner';
		if (!('innerWidth' in SnowPlow.windowAlias)) {
			a = 'client';
			e = SnowPlow.documentAlias.documentElement || SnowPlow.documentAlias.body;
		}
		return e[a+'Width'] + 'x' + e[a+'Height'];
	}

	/**
	 * Gets the dimensions of the current
	 * document.
	 *
	 * Code based on:
	 * - http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
	 */
	function detectDocumentSize() {
		var de = SnowPlow.documentAlias.documentElement; // Alias
		var w = Math.max(de.clientWidth, de.offsetWidth, de.scrollWidth);
		var h = Math.max(de.clientHeight, de.offsetHeight, de.scrollHeight);
		return w + 'x' + h;
	}

	/*
	 * Returns browser features (plugins, resolution, cookies)
	 */
	function detectBrowserFeatures() {
		var i,
			mimeType,
			pluginMap = {
				// document types
				pdf: 'application/pdf',

				// media players
				qt: 'video/quicktime',
				realp: 'audio/x-pn-realaudio-plugin',
				wma: 'application/x-mplayer2',

				// interactive multimedia
				dir: 'application/x-director',
				fla: 'application/x-shockwave-flash',

				// RIA
				java: 'application/x-java-vm',
				gears: 'application/x-googlegears',
				ag: 'application/x-silverlight'
			},
			features = {};

		// General plugin detection
		if (SnowPlow.navigatorAlias.mimeTypes && SnowPlow.navigatorAlias.mimeTypes.length) {
			for (i in pluginMap) {
				if (Object.prototype.hasOwnProperty.call(pluginMap, i)) {
					mimeType = SnowPlow.navigatorAlias.mimeTypes[pluginMap[i]];
					features[i] = (mimeType && mimeType.enabledPlugin) ? '1' : '0';
				}
			}
		}

		// Safari and Opera
		// IE6/IE7 navigator.javaEnabled can't be aliased, so test directly
		if (typeof navigator.javaEnabled !== 'unknown' &&
				SnowPlow.isDefined(SnowPlow.navigatorAlias.javaEnabled) &&
				SnowPlow.navigatorAlias.javaEnabled()) {
			features.java = '1';
		}

		// Firefox
		if (SnowPlow.isFunction(SnowPlow.windowAlias.GearsFactory)) {
			features.gears = '1';
		}

		// Other browser features
		features.res = SnowPlow.screenAlias.width + 'x' + SnowPlow.screenAlias.height;
		features.cd = screen.colorDepth;
		features.cookie = hasCookies();

		return features;
	}

/*<DEBUG>*/
	/*
	 * Register a test hook. Using eval() permits access to otherwise
	 * privileged members.
	 */
	function registerHook(hookName, userHook) {
		var hookObj = null;

		if (SnowPlow.isString(hookName) && !SnowPlow.isDefined(registeredHooks[hookName]) && userHook) {
			if (SnowPlow.isObject(userHook)) {
				hookObj = userHook;
			} else if (SnowPlow.isString(userHook)) {
				try {
					eval('hookObj =' + userHook);
				} catch (e) { }
			}

			registeredHooks[hookName] = hookObj;
		}
		return hookObj;
	}
/*</DEBUG>*/

	/************************************************************
	 * Constructor
	 ************************************************************/

	/*
	 * Initialize tracker
	 */
	updateDomainHash();

/*<DEBUG>*/
	/*
	 * initialize test plugin
	 */
	SnowPlow.executePluginMethod('run', registerHook);
/*</DEBUG>*/

	/************************************************************
	 * Public data and methods
	 ************************************************************/

	return {
/*<DEBUG>*/
		/*
		 * Test hook accessors
		 */
		hook: registeredHooks,
		getHook: function (hookName) {
			return registeredHooks[hookName];
		},
/*</DEBUG>*/

		/**
		 * Get the current user ID (as set previously
		 * with setUserId()).
		 *
		 * @return string Business-defined user ID
		 */
		getUserId: function () {
			return businessUserId;
		},

		/**
		 * Get visitor ID (from first party cookie)
		 *
		 * @return string Visitor ID in hexits (or null, if not yet known)
		 */
		getDomainUserId: function () {
			return (loadDomainUserIdCookie())[1];
		},

		/**
		 * Get the visitor information (from first party cookie)
		 *
		 * @return array
		 */
		getDomainUserInfo: function () {
			return loadDomainUserIdCookie();
		},

		/**
		 * Get visitor ID (from first party cookie)
		 *
		 * DEPRECATED: use getDomainUserId() above.
		 *
		 * @return string Visitor ID in hexits (or null, if not yet known)
		 */
		getVisitorId: function () {
			if (typeof console !== 'undefined') {
				console.log("SnowPlow: getVisitorId() is deprecated and will be removed in an upcoming version. Please use getDomainUserId() instead.");
			}
			return (loadVisitorIdCookie())[1];
		},

		/**
		 * Get the visitor information (from first party cookie)
		 *
		 * DEPRECATED: use getDomainUserInfo() above.
		 *
		 * @return array
		 */
		getVisitorInfo: function () {
			if (typeof console !== 'undefined') {
				console.log("SnowPlow: getVisitorInfo() is deprecated and will be removed in an upcoming version. Please use getDomainUserInfo() instead.");
			}
			return loadVisitorIdCookie();
		},

		/**
		 * Specify the site ID
		 *
		 * DEPRECATED: use setAppId() below
		 *
		 * @param int|string siteId
		 */
		setSiteId: function (siteId) {
			if (typeof console !== 'undefined') {
				console.log("SnowPlow: setSiteId() is deprecated and will be removed in an upcoming version. Please use setAppId() instead.");
			}
			configTrackerSiteId = siteId;
		},

		/**
		 * Specify the app ID
		 *
		 * @param int|string appId
		 */
		setAppId: function (appId) {
			configTrackerSiteId = appId;
		},

		/**
		 * Set delay for link tracking (in milliseconds)
		 *
		 * @param int delay
		 */
		setLinkTrackingTimer: function (delay) {
			configTrackerPause = delay;
		},

		/**
		 * Set list of file extensions to be recognized as downloads
		 *
		 * @param string extensions
		 */
		setDownloadExtensions: function (extensions) {
			configDownloadExtensions = extensions;
		},

		/**
		 * Specify additional file extensions to be recognized as downloads
		 *
		 * @param string extensions
		 */
		addDownloadExtensions: function (extensions) {
			configDownloadExtensions += '|' + extensions;
		},

		/**
		 * Set array of domains to be treated as local
		 *
		 * @param string|array hostsAlias
		 */
		setDomains: function (hostsAlias) {
			configHostsAlias = SnowPlow.isString(hostsAlias) ? [hostsAlias] : hostsAlias;
			configHostsAlias.push(domainAlias);
		},

		/**
		 * Set array of classes to be ignored if present in link
		 *
		 * @param string|array ignoreClasses
		 */
		setIgnoreClasses: function (ignoreClasses) {
			configIgnoreClasses = SnowPlow.isString(ignoreClasses) ? [ignoreClasses] : ignoreClasses;
		},

		/**
		 * Override referrer
		 *
		 * @param string url
		 */
		setReferrerUrl: function (url) {
			configReferrerUrl = url;
		},

		/**
		 * Override url
		 *
		 * @param string url
		 */
		setCustomUrl: function (url) {
			configCustomUrl = resolveRelativeReference(locationHrefAlias, url);
		},

		/**
		 * Override document.title
		 *
		 * @param string title
		 */
		setDocumentTitle: function (title) {
			configTitle = title;
		},

		/**
		 * Set array of classes to be treated as downloads
		 *
		 * @param string|array downloadClasses
		 */
		setDownloadClasses: function (downloadClasses) {
			configDownloadClasses = SnowPlow.isString(downloadClasses) ? [downloadClasses] : downloadClasses;
		},

		/**
		 * Set array of classes to be treated as outlinks
		 *
		 * @param string|array linkClasses
		 */
		setLinkClasses: function (linkClasses) {
			configLinkClasses = SnowPlow.isString(linkClasses) ? [linkClasses] : linkClasses;
		},

		/**
		 * Strip hash tag (or anchor) from URL
		 *
		 * @param bool enableFilter
		 */
		discardHashTag: function (enableFilter) {
			configDiscardHashTag = enableFilter;
		},

		/**
		 * Set first-party cookie name prefix
		 *
		 * @param string cookieNamePrefix
		 */
		setCookieNamePrefix: function (cookieNamePrefix) {
			configCookieNamePrefix = cookieNamePrefix;
		},

		/**
		 * Set first-party cookie domain
		 *
		 * @param string domain
		 */
		setCookieDomain: function (domain) {

			configCookieDomain = SnowPlow.fixupDomain(domain);
			updateDomainHash();
		},

		/**
		 * Set first-party cookie path
		 *
		 * @param string domain
		 */
		setCookiePath: function (path) {
			configCookiePath = path;
			updateDomainHash();
		},

		/**
		 * Set visitor cookie timeout (in seconds)
		 *
		 * @param int timeout
		 */
		setVisitorCookieTimeout: function (timeout) {
			configVisitorCookieTimeout = timeout * 1000;
		},

		/**
		 * Set session cookie timeout (in seconds)
		 *
		 * @param int timeout
		 */
		setSessionCookieTimeout: function (timeout) {
			configSessionCookieTimeout = timeout * 1000;
		},

		/**
		 * Set referral cookie timeout (in seconds)
		 *
		 * @param int timeout
		 */
		setReferralCookieTimeout: function (timeout) {
			configReferralCookieTimeout = timeout * 1000;
		},

		/**
		 * Handle do-not-track requests
		 *
		 * @param bool enable If true, don't track if user agent sends 'do-not-track' header
		 */
		setDoNotTrack: function (enable) {
			var dnt = SnowPlow.navigatorAlias.doNotTrack || SnowPlow.navigatorAlias.msDoNotTrack;

			configDoNotTrack = enable && (dnt === 'yes' || dnt === '1');
		},

		/**
		 * Add click listener to a specific link element.
		 * When clicked, Piwik will log the click automatically.
		 *
		 * @param DOMElement element
		 * @param bool enable If true, use pseudo click-handler (mousedown+mouseup)
		 */
		addListener: function (element, enable) {
			addClickListener(element, enable);
		},

		/**
		 * Install link tracker
		 *
		 * The default behaviour is to use actual click events. However, some browsers
		 * (e.g., Firefox, Opera, and Konqueror) don't generate click events for the middle mouse button.
		 *
		 * To capture more "clicks", the pseudo click-handler uses mousedown + mouseup events.
		 * This is not industry standard and is vulnerable to false positives (e.g., drag events).
		 *
		 * There is a Safari/Chrome/Webkit bug that prevents tracking requests from being sent
		 * by either click handler.  The workaround is to set a target attribute (which can't
		 * be "_self", "_top", or "_parent").
		 *
		 * @see https://bugs.webkit.org/show_bug.cgi?id=54783
		 *
		 * @param bool enable If true, use pseudo click-handler (mousedown+mouseup)
		 */
		enableLinkTracking: function (enable) {
			if (SnowPlow.hasLoaded) {
				// the load event has already fired, add the click listeners now
				addClickListeners(enable);
			} else {
				// defer until page has loaded
				SnowPlow.registeredOnLoadHandlers.push(function () {
					addClickListeners(enable);
				});
			}
		},

		/**
		 * Enables page activity tracking (sends page
		 * pings to the Collector regularly).
		 *
		 * @param int minimumVisitLength Seconds to wait before sending first page ping
		 * @param int heartBeatDelay Seconds to wait between pings
		 */
		enableActivityTracking: function (minimumVisitLength, heartBeatDelay) {
			
			var now = new Date();

			configMinimumVisitTime = now.getTime() + minimumVisitLength * 1000;
			configHeartBeatTimer = heartBeatDelay * 1000;
		},

		/**
		 * Frame buster
		 */
		killFrame: function () {
			if (SnowPlow.windowAlias.location !== SnowPlow.windowAlias.top.location) {
				SnowPlow.windowAlias.top.location = SnowPlow.windowAlias.location;
			}
		},

		/**
		 * Redirect if browsing offline (aka file: buster)
		 *
		 * @param string url Redirect to this URL
		 */
		redirectFile: function (url) {
			if (SnowPlow.windowAlias.location.protocol === 'file:') {
				SnowPlow.windowAlias.location = url;
			}
		},

		/**
		 * Count sites in pre-rendered state
		 *
		 * @param bool enable If true, track when in pre-rendered state
		 */
		setCountPreRendered: function (enable) {
			configCountPreRendered = enable;
		},

		/**
		 * Set the business-defined user ID for this user.
		 *
		 * @param string userId The business-defined user ID
		 */
		setUserId: function(userId) {
			businessUserId = userId;
		},

		/**
		 * Toggle whether to attach User ID to the querystring or not
		 *
		 * DEPRECATED: because we now have three separate user IDs:
		 * uid (business-set), nuid (3rd-party cookie) and duid (1st-party
		 * cookie). So there's no need to enable or disable specific user IDs.
		 *
		 * @param bool attach Whether to attach User ID or not
		 */
		attachUserId: function (attach) {

			if (typeof console !== 'undefined') {
				console.log("SnowPlow: attachUserId() is deprecated and will be removed in an upcoming version. It no longer does anything (because nuid and duid have been separated out).");
			}
		},

		/**
		 * Configure this tracker to log to a CloudFront collector. 
		 *
		 * @param string distSubdomain The subdomain on your CloudFront collector's distribution
		 */
		setCollectorCf: function (distSubdomain) {
			configCollectorUrl = collectorUrlFromCfDist(distSubdomain);
		},

		/**
		 *
		 * Specify the SnowPlow collector URL. No need to include HTTP
		 * or HTTPS - we will add this.
		 * 
		 * @param string rawUrl The collector URL minus protocol and /i
		 */
		setCollectorUrl: function (rawUrl) {
			configCollectorUrl = asCollectorUrl(rawUrl);
		},

		/**
		 * Specify the platform
		 *
		 * @param string userId The business-defined user ID
		 */
		setPlatform: function(platform) {
			configPlatform = platform;
		},

		/**
		 *
		 * Enable Base64 encoding for unstructured event payload
		 *
		 * @param boolean enabled A boolean value indicating if the Base64 encoding for unstructured events should be enabled or not
		 */
		encodeBase64: function (enabled) {
			configEncodeBase64 = enabled;
		},

		/**
		 * Log visit to this page
		 *
		 * @param string customTitle
		 * @param object Custom context relating to the event
		 */
		trackPageView: function (customTitle, context) {
			trackCallback(function () {
				logPageView(customTitle, context);
			});
		},

		// No public method to track a page ping

		/**
		 * Track an event happening on this page
		 *
		 * DEPRECATED: use getStructEvent instead
		 *
		 * @param string category The name you supply for the group of objects you want to track
		 * @param string action A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object
		 * @param string label (optional) An optional string to provide additional dimensions to the event data
		 * @param string property (optional) Describes the object or the action performed on it, e.g. quantity of item added to basket
		 * @param int|float|string value (optional) An integer that you can use to provide numerical data about the user event
		 */
		trackEvent: function (category, action, label, property, value) {

			if (typeof console !== 'undefined') {
				console.log("SnowPlow: trackEvent() is deprecated and will be removed in an upcoming version. Please use trackStructEvent() instead.");
			}
			logStructEvent(category, action, label, property, value);
		},

		/**
		 * Track a structured event happening on this page.
		 *
		 * Replaces trackEvent, making clear that the type
		 * of event being tracked is a structured one.
		 *
		 * @param string category The name you supply for the group of objects you want to track
		 * @param string action A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object
		 * @param string label (optional) An optional string to provide additional dimensions to the event data
		 * @param string property (optional) Describes the object or the action performed on it, e.g. quantity of item added to basket
		 * @param int|float|string value (optional) An integer that you can use to provide numerical data about the user event
		 * @param object Custom context relating to the event
		 */
		trackStructEvent: function (category, action, label, property, value, context) {
			logStructEvent(category, action, label, property, value, context);                   
		},

		/**
		 * Track an unstructured event happening on this page.
		 *
		 * @param string name The name of the event
		 * @param object properties The properties of the event
		 * @param object Custom context relating to the event
		 */
		trackUnstructEvent: function (name, properties, context) {
			logUnstructEvent(name, properties, context);
		},

		/**
		 * Track an ecommerce transaction
		 *
		 * @param string orderId Required. Internal unique order id number for this transaction.
		 * @param string affiliation Optional. Partner or store affiliation.
		 * @param string total Required. Total amount of the transaction.
		 * @param string tax Optional. Tax amount of the transaction.
		 * @param string shipping Optional. Shipping charge for the transaction.
		 * @param string city Optional. City to associate with transaction.
		 * @param string state Optional. State to associate with transaction.
		 * @param string country Optional. Country to associate with transaction.
		 * @param string currency Optional. Currency to associate with this transaction.
		 * @param object context Option. Context relating to the event.
		 */
		addTrans: function(orderId, affiliation, total, tax, shipping, city, state, country, currency, context) {
			ecommerceTransaction.transaction = {
				 orderId: orderId,
				 affiliation: affiliation,
				 total: total,
				 tax: tax,
				 shipping: shipping,
				 city: city,
				 state: state,
				 country: country,
				 currency: currency,
				 context: context
			};
		},

		/**
		 * Track an ecommerce transaction item
		 *
		 * @param string orderId Required Order ID of the transaction to associate with item.
		 * @param string sku Required. Item's SKU code.
		 * @param string name Optional. Product name.
		 * @param string category Optional. Product category.
		 * @param string price Required. Product price.
		 * @param string quantity Required. Purchase quantity.
		 * @param string currency Optional. Product price currency.
		 * @param object context Option. Context relating to the event.
		 */
		addItem: function(orderId, sku, name, category, price, quantity, currency, context) {
			ecommerceTransaction.items.push({
				orderId: orderId,
				sku: sku,
				name: name,
				category: category,
				price: price,
				quantity: quantity,
				currency: currency,
				context: context
			});
		},

		/**
		 * Commit the ecommerce transaction
		 *
		 * This call will send the data specified with addTrans,
		 * addItem methods to the tracking server.
		 */
		trackTrans: function() {
			 logTransaction(
					 ecommerceTransaction.transaction.orderId,
					 ecommerceTransaction.transaction.affiliation,
					 ecommerceTransaction.transaction.total,
					 ecommerceTransaction.transaction.tax,
					 ecommerceTransaction.transaction.shipping,
					 ecommerceTransaction.transaction.city,
					 ecommerceTransaction.transaction.state,
					 ecommerceTransaction.transaction.country,
					 ecommerceTransaction.transaction.currency,
					 ecommerceTransaction.transaction.context
					);
			for (var i = 0; i < ecommerceTransaction.items.length; i++) {
        		var item = ecommerceTransaction.items[i];
				logTransactionItem(
					item.orderId,
					item.sku,
					item.name,
					item.category,
					item.price,
					item.quantity,
					item.currency,
					item.context
					);
			}

			ecommerceTransaction = ecommerceTransactionTemplate();
		},

		// ---------------------------------------
		// Next 2 track events not supported in
		// Snowplow Enrichment process yet

		/**
		 * Manually log a click from your own code
		 *
		 * @param string sourceUrl
		 * @param string linkType
		 * @param object Custom context relating to the event
		 */
		// TODO: break this into trackLink(destUrl) and trackDownload(destUrl)
		trackLink: function (sourceUrl, linkType, context) {
			trackCallback(function () {
				logLink(sourceUrl, linkType, context);
			});
		},

		/**
		 * Track an ad being served
		 *
		 * @param string bannerId Identifier for the ad banner displayed
		 * @param string campaignId (optional) Identifier for the campaign which the banner belongs to
		 * @param string advertiserId (optional) Identifier for the advertiser which the campaign belongs to
		 * @param string userId (optional) Ad server identifier for the viewer of the banner
		 * @param object Custom context relating to the event
		 */
		trackImpression: function (bannerId, campaignId, advertiserId, userId, context) {
				 logImpression(bannerId, campaignId, advertiserId, userId, context);
		}

		// TODO: add in ad clicks and conversions
	};
}


// ***** File: \js\snowplow.js *****

/*
 * JavaScript tracker for Snowplow: snowplow.js
 * 
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright 
 * 2012-2014 Snowplow Analytics Ltd. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are 
 * met: 
 *
 * * Redistributions of source code must retain the above copyright 
 *   notice, this list of conditions and the following disclaimer. 
 *
 * * Redistributions in binary form must reproduce the above copyright 
 *   notice, this list of conditions and the following disclaimer in the 
 *   documentation and/or other materials provided with the distribution. 
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*jslint browser:true, plusplus:true, vars:true, nomen:true, evil:true */
/*global window */
/*global unescape */
/*global ActiveXObject */
/*global _snaq:true */
/*members encodeURIComponent, decodeURIComponent, getElementsByTagName,
	shift, unshift,
	addEventListener, attachEvent, removeEventListener, detachEvent,
	cookie, domain, readyState, documentElement, doScroll, title, text,
	location, top, document, referrer, parent, links, href, protocol, GearsFactory,
	event, which, button, srcElement, type, target,
	parentNode, tagName, hostname, className,
	userAgent, cookieEnabled, platform, mimeTypes, enabledPlugin, javaEnabled,
	XDomainRequest, XMLHttpRequest, ActiveXObject, open, setRequestHeader, onreadystatechange, setRequestHeader, send, readyState, status,
	getTime, getTimeAlias, setTime, toGMTString, getHours, getMinutes, getSeconds,
	toLowerCase, charAt, indexOf, lastIndexOf, split, slice, toUpperCase,
	onload, src,
	round, random,
	exec,
	res, width, height,
	pdf, qt, realp, wma, dir, fla, java, gears, ag,
	hook, getHook, getVisitorId, getVisitorInfo,
	setCollectorCf, setCollectorUrl, setSiteId, setAppId,
	setDownloadExtensions, addDownloadExtensions,
	setDomains, setIgnoreClasses, setRequestMethod,
	setReferrerUrl, setCustomUrl, setDocumentTitle,
	setDownloadClasses, setLinkClasses,
	discardHashTag,
	setCookieNamePrefix, setCookieDomain, setCookiePath, setVisitorIdCookie,
	setVisitorCookieTimeout, setSessionCookieTimeout, setReferralCookieTimeout,
	doNotTrack, setDoNotTrack, msDoNotTrack, getTimestamp, getCookieValue,
	detectTimezone, detectViewport,
	addListener, enableLinkTracking, enableActivityTracking, setLinkTrackingTimer,
	enableDarkSocialTracking,
	killFrame, redirectFile, setCountPreRendered,
	trackEvent, trackLink, trackPageView, trackImpression,
	addPlugin, getAsyncTracker
*/

SnowPlow.build = function () {
		"use strict";

		/************************************************************
		 * Private methods
		 ************************************************************/

		/*
		 * apply wrapper
		 *
		 * @param array parameterArray An array comprising either:
		 *      [ 'methodName', optional_parameters ]
		 * or:
		 *      [ functionObject, optional_parameters ]
		 */
		function apply() {
			var i, f, parameterArray;

			for (i = 0; i < arguments.length; i += 1) {
				parameterArray = arguments[i];
				f = parameterArray.shift();

				if (SnowPlow.isString(f)) {
					SnowPlow.asyncTracker[f].apply(SnowPlow.asyncTracker, parameterArray);
				} else {
					f.apply(SnowPlow.asyncTracker, parameterArray);
				}
			}
		}

		/*
		 * Handle beforeunload event
		 *
		 * Subject to Safari's "Runaway JavaScript Timer" and
		 * Chrome V8 extension that terminates JS that exhibits
		 * "slow unload", i.e., calling getTime() > 1000 times
		 */
		function beforeUnloadHandler() {
			var now;

			SnowPlow.executePluginMethod('unload');

			/*
			 * Delay/pause (blocks UI)
			 */
			if (SnowPlow.expireDateTime) {
				// the things we do for backwards compatibility...
				// in ECMA-262 5th ed., we could simply use:
				//     while (Date.now() < SnowPlow.expireDateTime) { }
				do {
					now = new Date();
				} while (now.getTimeAlias() < SnowPlow.expireDateTime);
			}
		}

		/*
		 * Handler for onload event
		 */
		function loadHandler() {
			var i;

			if (!SnowPlow.hasLoaded) {
				SnowPlow.hasLoaded = true;
				SnowPlow.executePluginMethod('load');
				for (i = 0; i < SnowPlow.registeredOnLoadHandlers.length; i++) {
					SnowPlow.registeredOnLoadHandlers[i]();
				}
			}
			return true;
		}

		/*
		 * Add onload or DOM ready handler
		 */
		function addReadyListener() {
			var _timer;

			if (SnowPlow.documentAlias.addEventListener) {
				SnowPlow.addEventListener(SnowPlow.documentAlias, 'DOMContentLoaded', function ready() {
					SnowPlow.documentAlias.removeEventListener('DOMContentLoaded', ready, false);
					loadHandler();
				});
			} else if (SnowPlow.documentAlias.attachEvent) {
				SnowPlow.documentAlias.attachEvent('onreadystatechange', function ready() {
					if (SnowPlow.documentAlias.readyState === 'complete') {
						SnowPlow.documentAlias.detachEvent('onreadystatechange', ready);
						loadHandler();
					}
				});

				if (SnowPlow.documentAlias.documentElement.doScroll && SnowPlow.windowAlias === SnowPlow.windowAlias.top) {
					(function ready() {
						if (!SnowPlow.hasLoaded) {
							try {
								SnowPlow.documentAlias.documentElement.doScroll('left');
							} catch (error) {
								setTimeout(ready, 0);
								return;
							}
							loadHandler();
						}
					}());
				}
			}

			// sniff for older WebKit versions
			if ((new RegExp('WebKit')).test(SnowPlow.navigatorAlias.userAgent)) {
				_timer = setInterval(function () {
					if (SnowPlow.hasLoaded || /loaded|complete/.test(SnowPlow.documentAlias.readyState)) {
						clearInterval(_timer);
						loadHandler();
					}
				}, 10);
			}

			// fallback
			SnowPlow.addEventListener(SnowPlow.windowAlias, 'load', loadHandler, false);
		}


		/************************************************************
		 * Proxy object
		 * - this allows the caller to continue push()'ing to _snaq
		 *   after the Tracker has been initialized and loaded
		 ************************************************************/

		function TrackerProxy() {
			return {
				push: apply
			};
		}

		/************************************************************
		 * Constructor
		 ************************************************************/

		// initialize the SnowPlow singleton
		SnowPlow.addEventListener(SnowPlow.windowAlias, 'beforeunload', beforeUnloadHandler, false);
		addReadyListener();

		Date.prototype.getTimeAlias = Date.prototype.getTime;

		SnowPlow.asyncTracker = new SnowPlow.Tracker();

		for (var i = 0; i < _snaq.length; i++) {
			apply(_snaq[i]);
		}

		// replace initialization array with proxy object
		_snaq = new TrackerProxy();


		/************************************************************
		 * Public data and methods
		 ************************************************************/

	return {
		/**
		* Add plugin
		*
		* @param string pluginName
		* @param Object pluginObj
		*/
		addPlugin: function (pluginName, pluginObj) {
			SnowPlow.plugins[pluginName] = pluginObj;
		},

		/**
		* Returns a Tracker object, configured with a
		* CloudFront collector.
		*
		* @param string distSubdomain The subdomain on your CloudFront collector's distribution
		*/
		getTrackerCf: function (distSubdomain) {
			return new SnowPlow.Tracker({cf: distSubdomain});
		},

		/**
		* Returns a Tracker object, configured with the
		* URL to the collector to use.
		*
		* @param string rawUrl The collector URL minus protocol and /i
		*/
		getTrackerUrl: function (rawUrl) {
			return new SnowPlow.Tracker({url: rawUrl});
		},

		/**
		* Get internal asynchronous tracker object
		*
		* @return Tracker
		*/
		getAsyncTracker: function () {
			return SnowPlow.asyncTracker;
		}
	};
};



// ***** File: \js\constructor.js *****

/*
 * JavaScript tracker for Snowplow: constructor.js
 * 
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright 
 * 2012-2014 Snowplow Analytics Ltd. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are 
 * met: 
 *
 * * Redistributions of source code must retain the above copyright 
 *   notice, this list of conditions and the following disclaimer. 
 *
 * * Redistributions in binary form must reproduce the above copyright 
 *   notice, this list of conditions and the following disclaimer in the 
 *   documentation and/or other materials provided with the distribution. 
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* Extend SnowPlow object */
(function() {
	var snowPlow = SnowPlow.build();
	for (prop in snowPlow) {
		if (snowPlow.hasOwnProperty(prop)) {
			if (SnowPlow[prop] === undefined) {
				SnowPlow[prop] = snowPlow[prop];
			}
		}
	}
}());

