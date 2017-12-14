/*Copyright (c) 2015 Jessie

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/


/*
Return URI:
http://127.0.0.1:1337/?addClass=2&hasClass=2&removeClass=2&ajaxGet=1&jsonGet=1&xhrCreate=1&xhrGet=1&getDescendantsByClassName=2&getDescendantsByTagName=1&getElement=1&attachDocumentListener=1&attachListener=1&cancelDefault=2&deferUntilReady=1&getEventTarget=2&bind=2&isOwnProperty=3&mixin=1&parseJson=3&toArray=3
*/

var jessie;
jessie = jessie || {};
(function(global) {

	var globalDocument = global.document,
		isHostObjectProperty = function(object, property) {
			var objectProperty = object[property];
			return typeof objectProperty == 'object' && null !== objectProperty;
		},
		isHostMethod = function(object, method) {
			var objectMethod = object[method];
			var type = typeof objectMethod;
			return	type == 'function' ||
					type == 'object' && null !== objectMethod ||
					type == 'unknown';
		},
		hasFeatures = function() {
			var i = arguments.length;
			while (i--) {
				if (!jessie[arguments[i]]) {
					return false;
				}
			}
			return true;
		},
		html = isHostObjectProperty(globalDocument, 'documentElement') && globalDocument.documentElement,
		canCall = !!Function.prototype.call,
		isStyleCapable = !!(html && isHostObjectProperty(html, 'style'));



var isOwnProperty;

/*
Description:
Wide support. Cutting edge where possible.
*/

/*
Author:
David Mark
*/

if(Object.prototype.hasOwnProperty) {
	isOwnProperty = function(o, p) {
		return o.hasOwnProperty(p);
	};
}
else {
	isOwnProperty = function(o, p) {
		var prop = o.constructor.prototype[p];
		return typeof prop == 'undefined' || prop !== o[p];
	};
}



var mixin;

/*
Description:
Relies on `jessie.isOwnProperty`
*/

/*
Degrades:
*/

// TODO: Test the old iteration bug with shadowed built-in properties (e.g. toString)
//       Need another rendition that handles that bug

if(isOwnProperty) {
	mixin = function(target, source) {
		for(var property in source) {
			if(isOwnProperty(source, property)) {
				target[property] = source[property];
			}
		}
	};
}




/*
Description:
Relies on `Function.prototype.bind` and `Function.prototype.apply` and `Array.prototype.slice`
*/

/*
Degrades:
IE5, IE4, IE3
*/

var bind;

if (Function.prototype.bind) {
	bind = function(fn, thisObject) {
		return fn.bind.apply(fn, Array.prototype.slice.call(arguments, 1));
	};
}
else if (canCall && Array.prototype.slice) {
	bind = function(fn, context) {
		var prependArgs = Array.prototype.slice.call(arguments, 2);

		if (prependArgs.length) {
			return function() {
				return fn.apply(context, Array.prototype.concat.apply(prependArgs, arguments));
			};
		}
		return function() {
			return fn.apply(context, arguments);
		};
	};

}




/*
Description:
Relies on W3C `window.XMLHttpRequest`.

NOTE: IE7+ native version does not support overrideMimeType or local file
requests
*/

/*
Degrades:
IE6, IE5.5, IE5, IE4, IE3
*/

/*
Author:
David Mark
*/

var xhrCreate;

if(isHostMethod(global, "XMLHttpRequest")) {
	try {
		if(new global.XMLHttpRequest()) {
			xhrCreate = function() {
				return new XMLHttpRequest();
			};
		}
	}
	catch(e) {}
}



/*
Description:
Cutting edge where possible, wide support
*/

/*
Author:
Graham Veal
*/

var toArray;

if (canCall && Array.prototype.slice) {

	try {

		Array.prototype.slice.call(arguments, 0);

		toArray = function(a) {
			return Array.prototype.slice.call(a, 0);
		};

	} catch(e) {}

}

if (!toArray) {

	toArray = function(a) {

		var result = [],
			i = 0,
			l = a.length;

		for ( ; i < l; i++) {

			result[i] = a[i];
		}

		return result;
	};
}




/*
Description:
For making XHR get HTTP requests.
*/

/*
Author:
Adam Silver
*/

var xhrGet;

// if you can't create one then you certainly can't send one
if (xhrCreate && bind && mixin && isOwnProperty) {
	xhrGet = function(xhr, url, options) {

		options = options || {};
		options.thisObject = options.thisObject || xhr;

		var successFn,
			failFn,
			completeFn,
			headers = {
				'X-Requested-With' : 'XMLHttpRequest'
			};

		if (options.headers) {
			mixin(headers, options.headers);
		}

		if (options.success) {
			successFn = bind(options.success, options.thisObject);
		}

		if (options.fail) {
			failFn = bind(options.fail, options.thisObject);
		}

		if (options.complete) {
			completeFn = bind(options.complete, options.thisObject);
		}

		function isSuccessfulResponse(xhr) {
			var success = false,
				status = xhr.status,
				between200and300 = (status >= 200 && status < 300),
				notModified = (status === 304);

			if (between200and300 || notModified || (status === 0 && xhr.responseText)) {
				success = true;
			}
			return success;
		}

		function handleReadyStateChange() {
			if (xhr.readyState === 4) {
				if (isSuccessfulResponse(xhr)) {
					if (successFn) {
						successFn(xhr.responseText, xhr);
					}
				}
				else if (failFn) {
					failFn(xhr);
				}
				if (completeFn) {
					completeFn(xhr);
				}
			}
		}

		xhr.open('GET', url);

		for (var key in headers) {
			if (isOwnProperty( headers, key )){
				xhr.setRequestHeader(key, headers[key]);
			}
		}

		xhr.onreadystatechange = handleReadyStateChange;
		xhr.send(null);

		return xhr;
	};
}




/*
Description:
Cutting edge
*/

/*
Degrades:
IE8, IE7, IE6, IE5.5, IE5, IE4, IE3, Opera 7.6
*/

/*
Author:
David Mark
*/

var attachListener;

if(html && isHostMethod(html, 'addEventListener')) {
	attachListener = function(el, eventType, fn) {
		el.addEventListener(eventType, fn, false);
		return fn;
	};
}



/*
Description:
Relies on 'document.getElementsByTagName'
*/

var getDescendantsByTagName;

if(globalDocument && isHostMethod(globalDocument, "getElementsByTagName") && toArray) {
	getDescendantsByTagName = function(el, tagName) {
		return toArray((el || document).getElementsByTagName(tagName));
	};
}



/*
Description:
Cutting edge where possible, wide support
*/

/*
Author:
Adam Silver
*/

var hasClass;

if (html && isHostObjectProperty(html, "classList") && isHostMethod(html.classList, "contains") ) {
	hasClass = function(el, className) {
		return el.classList.contains(className);
	};
} else if(html && 'string' == typeof html.className) {
	hasClass = function(el, className) {
		return (new RegExp('(^|\\s)' + className + '(\\s|$)')).test(el.className);
	};
}




/*
Description:
Relies on `window.JSON.parse` or the `Function` constructor providing greatest 
browser support
*/

/*
Author:
Adam Silver
*/

var parseJson;

if(isHostObjectProperty(global, "JSON") && isHostMethod(JSON, "parse")) {
	parseJson = function(str) {
		return JSON.parse(str);
	};
} else {
	parseJson = function(str) {
		return (new Function('return (' + str + ')'))();
	};
}



/*
Description:
Relies on `jessie.xhrCreate` and `jessie.xhrGet`
*/

/*
Author:
Adam Silver
*/

var ajaxGet;

if(xhrCreate && xhrGet) {
	ajaxGet = function(url, options) {
		var xhr = xhrCreate();
		return xhrGet(xhr, url, options);
	};
}



/*
Description:
Cutting edge (W3 compliant) where possible, also handles Microsoft event model. Widest support.
*/

/*
See: <a href="https://groups.google.com/forum/#!starred/comp.lang.javascript/uUsSVH7Vcvg">Article</a>
If you will be using a forked rendition to support IE 8-
*/

/*
Degrades:
IE4, IE3, NN4
*/

var getEventTarget;

if(html && isHostMethod(html, 'addEventListener')) {
	getEventTarget = function(e) {
		var target = e.target;
		// Check if not an element (e.g. a text node)
		if (1 != target.nodeType) {
			// Set reference to parent node (which must be an element)
			target = target.parentNode;
		}
		return target;
	};
} else if(html && isHostMethod(html, 'attachEvent')) {
	getEventTarget = function(e) {
		return e.srcElement;
	};
}



/*
Description:
Cutting edge (W3 compliant). Best used with asset-light documents. No frames or other alternate windows
*/

/*
Degrades:
IE8, IE7, IE6, IE5.5, IE5, IE4, IE3
*/

/*
Author:
David Mark
*/

var deferUntilReady;

var readyListenerAttached;

if(isHostMethod(global, "addEventListener")) {
	deferUntilReady = function(fn) {

		readyListenerAttached = true;

		// Production function starts (and ends) here
		window.addEventListener('load', fn, false);
	};
}



/*
Description:
Cutting edge (W3 compliant) and handles Microsoft event model providing wide support.
*/

/*
Degrades:
IE4, IE3, NN4
*/

/*
Author:
Adam Silver
*/

var cancelDefault;

if(html && isHostMethod(html, 'addEventListener')) {
	cancelDefault = function(e) {
		e.preventDefault();
	};
}
else if(html && isHostMethod(html, 'attachEvent')) {
	cancelDefault = function(e) {
		e.returnValue = false;
	};
}



/*
Description:
Cutting edge (W3 compliant)
*/

/*
Degrades:
IE8, IE7, IE6, IE5.5, IE5, IE4, IE3
*/

var attachDocumentListener;

if(globalDocument && isHostMethod(globalDocument, 'addEventListener') && attachListener) {
	attachDocumentListener = function(eventType, fn) {

		var listener = function(e) {
			fn.call(document, e);
		};

		return attachListener(document, eventType, fn);
	};
}



/*
Description:
Basic rendition which relies on valid markup i.e. forms with unique names and ids
*/

/*
See: <a href="https://groups.google.com/forum/#!starred/comp.lang.javascript/fVp-DWAIGnc">Article</a>

That's the most basic rendition: no allowance for screwy markup like this:

<input name="test">
<input id="test">
*/

/*
Degrades:
IE4, IE3, NN4
*/

/*
Author:
David Mark
*/

var getElement;

if (isHostMethod(document, 'getElementById')) {
	getElement = function(id, doc) {
		return (doc || document).getElementById(id);
	};
}



/*
Description:
Relies on `jessie.getDescendantsByTagName` and `jessie.hasClass`
*/

var getDescendantsByClassName;

if (getDescendantsByTagName && hasClass) {
	getDescendantsByClassName = function(el, className) {
		var elements = getDescendantsByTagName(el, '*'),
			element,
			i,
			elementsWithClassName = [];
		for(i = 0; i < elements.length; i++) {
			element = elements[i];
			if(hasClass(element, className)) {
				elementsWithClassName.push(element);
			}
		}
		return elementsWithClassName;
	};
}



/*
Description:
Relies on `jessie.ajaxGet` and `jessie.parseJson`
*/

/*
Degrades:
*/

/*
Author:
Adam Silver, Graham Veal
*/

var jsonGet;

if(ajaxGet && parseJson && bind) {
	jsonGet = function(url, options) {
		options = options || {};
		var	originalFunction = options.success;

		if(originalFunction) {

			options.success = function(response, xhr) {

				var json;

				options.thisObject = options.thisObject || xhr;
				originalFunction = bind(originalFunction, options.thisObject);

				try {

					json = parseJson(response);

				} catch( e ){

					json = null;
				}

				originalFunction(json, xhr);
			};
		}

		return ajaxGet(url, options);
	};
}



/*
Description:
Cutting edge where possible, wide support
*/

/*
Author:
Adam Silver
*/

var removeClass;

if (html && isHostObjectProperty(html, "classList") && isHostMethod(html.classList, "remove") ) {
    removeClass = function(el, className) {
		return el.classList.remove(className);
    };
} else if(html && "string" == typeof html.className) {
	removeClass = function(el, className) {
		var re, m;
		if (el.className) {
			if (el.className == className) {
				el.className = '';
			} else {
				re = new RegExp('(^|\\s)' + className + '(\\s|$)');
				m = el.className.match(re);
				if (m && m.length == 3) {
					el.className = el.className.replace(re, (m[1] && m[2])?' ':'');
				}
			}
		}
	};
}



/*
Description:
Cutting edge and wide support
*/

/*
Degrades:
IE4, IE3, NN4
*/

/*
Author:
Adam Silver
*/

var addClass;

if (html && isHostObjectProperty(html, "classList") && isHostMethod(html.classList, "add") ) {
	addClass = function(el, className) {
		return el.classList.add(className);
	};
} else if (html && "string" === typeof html.className ) {
    addClass = function(el, className) {
		var re;
		if (!el.className) {
			el.className = className;
		}
		else {
			re = new RegExp('(^|\\s)' + className + '(\\s|$)');
			if (!re.test(el.className)) { el.className += ' ' + className; }
		}
    };
}


jessie.isHostMethod = isHostMethod;
jessie.isHostObjectProperty = isHostObjectProperty;
jessie.hasFeatures = hasFeatures;
jessie.isOwnProperty = isOwnProperty;
jessie.mixin = mixin;
jessie.bind = bind;
jessie.xhrCreate = xhrCreate;
jessie.toArray = toArray;
jessie.xhrGet = xhrGet;
jessie.attachListener = attachListener;
jessie.getDescendantsByTagName = getDescendantsByTagName;
jessie.hasClass = hasClass;
jessie.parseJson = parseJson;
jessie.ajaxGet = ajaxGet;
jessie.getEventTarget = getEventTarget;
jessie.deferUntilReady = deferUntilReady;
jessie.cancelDefault = cancelDefault;
jessie.attachDocumentListener = attachDocumentListener;
jessie.getElement = getElement;
jessie.getDescendantsByClassName = getDescendantsByClassName;
jessie.jsonGet = jsonGet;
jessie.removeClass = removeClass;
jessie.addClass = addClass;

	globalDocument = html = null;

}(this));