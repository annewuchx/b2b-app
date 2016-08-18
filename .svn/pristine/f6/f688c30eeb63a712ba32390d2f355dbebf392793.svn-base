/**
 * utils.js - utils is a function library
 * @version v0.0.1
 * @link http://github.com/taoqianbao
 * @license MIT
 * @author PeterZhu
 * @email zhu.shengfeng@yinchengku.com
 */
! function(t) {
	"use strict";

	if (t == null) {
		t = {};
	}

	t.isNull = function(t) {
		return null === t || "undefined" == typeof t
	};

	//
	t.trim = function(t) {
		return this.isNull(t) ? t : t.trim ? t.trim() : t.replace(/(^[\\s]*)|([\\s]*$)/g, "")
	};
	//
	t.replace = function(t, e, i) {
		return this.isNull(t) ? t : t.replace(new RegExp(e, "g"), i)
	};
	//
	t.startWith = function(t, e) {
		return this.isNull(t) || this.isNull(e) ? !1 : 0 === t.indexOf(e)
	};
	//
	t.contains = function(t, e) {
		var i = this;
		return this.isNull(t) || this.isNull(e) ? !1 : i.isArray(t) ? i.each(t, function(t, i) {
			return i == e ? !0 : void 0
		}) : t && e && t.indexOf(e) > -1
	};
	//
	t.endWith = function(t, e) {
		return this.isNull(t) || this.isNull(e) ? !1 : t.indexOf(e) === t.length - e.length
	};
	//
	t.has = t.hasProperty = function(t, e) {
		return this.isNull(t) || this.isNull(e) ? !1 : e in t || t.hasOwnProperty(e)
	};
	//
	t.isFunction = function(t) {
		return this.isNull(t) ? !1 : "function" == typeof t
	};
	//
	t.isString = function(t) {
		return this.isNull(t) ? !1 : "string" == typeof t || t instanceof String
	};
	//
	t.isNumber = function(t) {
		return this.isNull(t) ? !1 : "number" == typeof t || t instanceof Number
	};
	//
	t.isBoolean = function(t) {
		return this.isNull(t) ? !1 : "boolean" == typeof t || t instanceof Boolean
	};
	//
	t.isElement = function(t) {
		return this.isNull(t) ? !1 : window.Element ? t instanceof Element : t.tagName && t.nodeType && t.nodeName && t.attributes && t.ownerDocument
	};
	//
	t.isText = function(t) {
		return this.isNull(t) ? !1 : t instanceof Text
	};
	//
	t.isObject = function(t) {
		return this.isNull(t) ? !1 : "object" == typeof t
	};
	//
	t.isArray = function(t) {
		if (this.isNull(t)) return !1;
		var e = "[object Array]" === Object.prototype.toString.call(t),
			i = t instanceof Array,
			n = !this.isString(t) && this.isNumber(t.length) && this.isFunction(t.splice),
			r = !this.isString(t) && this.isNumber(t.length) && t[0];
		return e || i || n || r
	};
	//
	t.isDate = function(t) {
		return this.isNull(t) ? !1 : t instanceof Date
	};
	//
	t.toArray = function(t) {
		if (this.isNull(t)) return [];
		try {
			return Array.prototype.slice.call(t)
		} catch (e) {
			for (var i = [], n = (t.length, 0); n < len; n++) i[n] = s[n];
			return i
		}
	};
	//
	t.toDate = function(t) {
		var e = this;
		return e.isNumber(t) ? new Date(t) : e.isString(t) ? new Date(e.replace(e.replace(t, "-", "/"), "T", " ")) : e.isDate(t) ? t : null
	};
	//
	t.each = function(t, e) {
		if (!this.isNull(t) && !this.isNull(e))
			if (this.isArray(t)) {
				for (var i = t.length, n = 0; i > n; n++)
					if (!this.isNull(t[n])) {
						var r = e.call(t[n], n, t[n]);
						if (!this.isNull(r)) return r
					}
			} else
				for (var s in t)
					if (!this.isNull(t[s])) {
						var r = e.call(t[s], s, t[s]);
						if (!this.isNull(r)) return r
					}
	};
	//
	t.formatDate = function(t, e) {
		if (this.isNull(e) || this.isNull(t)) return t;
		t = this.toDate(t);
		var i = {
			"M+": t.getMonth() + 1,
			"d+": t.getDate(),
			"h+": t.getHours(),
			"m+": t.getMinutes(),
			"s+": t.getSeconds(),
			"q+": Math.floor((t.getMonth() + 3) / 3),
			S: t.getMilliseconds()
		};
		/(y+)/.test(e) && (e = e.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length)));
		for (var n in i) new RegExp("(" + n + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? i[n] : ("00" + i[n]).substr(("" + i[n]).length)));
		return e
	};
	//
	t.clone = function(t, e) {
		if (this.isNull(t) || this.isString(t) || this.isNumber(t) || this.isBoolean(t) || this.isDate(t)) return t;
		var i = t;
		try {
			i = new t.constructor
		} catch (n) {}
		for (var r in t) i[r] == t[r] || this.contains(e, r) || (i[r] = "object" == typeof t[r] ? this.clone(t[r], e) : t[r]);
		return i.toString = t.toString, i.valueOf = t.valueOf, i
	};
	//
	t.copy = function(t, e) {
		return e = e || {}, this.each(t, function(i) {
			try {
				e[i] = t[i]
			} catch (n) {}
		}), e
	};
	//
	t.newGuid = function() {
		var t = function() {
			return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
		};
		return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
	};
	//
	t.defineProperty = function(t, e, i, n) {
		if (t && e && i) {
			var r = this;
			if (i.set = i.set || function() {
					throw "do not implement " + e + " setter."
				}, i.get = i.get || function() {
					throw "do not implement " + e + " getter."
				}, !n)
				if (t.__defineGetter__ && t.__defineSetter__) t.__defineSetter__(e, i.set), t.__defineGetter__(e, i.get);
				else if (Object.defineProperty) try {
				Object.defineProperty(t, e, i)
			} catch (s) {}
			return r.has(t, e) || (t[e] = function(e) {
				var n = r.isNull(e) ? "get" : "set";
				return i[n].apply(t, arguments || [])
			}), t[e]
		}
	};
	//
	t.wrapUrl = function(t) {
		return this.isNull(t) ? t : t += t.indexOf("?") > -1 ? "&__t=" + this.newGuid() : "?__t=" + this.newGuid()
	};
	//
	t.sleep = function(t) {
		for (var e = (new Date).getTime() + t;
			(new Date).getTime() + 1 < e;);
	};
	//
	t.async = function(t, e) {
		return this.isFunction(t) ? (e = e || 0, t.asyncTimer && clearTimeout(t.asyncTimer), t.asyncTimer = setTimeout(t, e), t.asyncTimer) : void 0
	};
	//
	t.mix = function(e, i, n, r, s, u) {
		if (!i || !e) return e || t;
		if (s) switch (s) {
			case 1:
				return t.mix(e.prototype, i.prototype, n, r, 0, u);
			case 2:
				t.mix(e.prototype, i.prototype, n, r, 0, u);
				break;
			case 3:
				return t.mix(e, i.prototype, n, r, 0, u);
			case 4:
				return t.mix(e.prototype, i, n, r, 0, u)
		}
		var o, l, c;
		if (r && r.length)
			for (o = 0, l = r.length; l > o; ++o) c = r[o], isObject = t.isObject(e[c]), i.hasOwnProperty(c) && (u && isObject ? t.mix(e[c], i[c]) : !n && c in e || (e[c] = i[c]));
		else
			for (o in i) i.hasOwnProperty(o) && (u && t.isObject(e[o], !0) ? t.mix(e[o], i[o], n, r, 0, !0) : !n && o in e || (e[o] = i[o]));
		return e
	};
	t["short"] = function(t, e) {
		if (!t) return t;
		e = e || 40;
		var i = t.length,
			n = e / 2;
		return i > e ? t.substr(0, n) + "..." + t.substr(i - n) : t
	};
	//
	t.firstUpper = function(t) {
		var e = this;
		if (!e.isNull(t)) {
			t = t.toLowerCase();
			var i = [];
			for (var n in t) i.push(0 == n ? t[n].toUpperCase() : t[n]);
			return i.join("")
		}
	};

	/**
	 * 两个浮点数求和
	 * @param {Object} num1
	 * @param {Object} num2
	 */
	t.accAdd = function(num1, num2) {
		var r1, r2, m;
		try {
			r1 = num1.toString().split('.')[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = num2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		// return (num1*m+num2*m)/m;
		return Math.round(num1 * m + num2 * m) / m;
	};
	/**
	 * 两个浮点数相减 
	 * @param {Object} num1
	 * @param {Object} num2
	 */
	t.accSub = function(num1, num2) {
		var r1, r2, m;
		try {
			r1 = num1.toString().split('.')[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = num2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		n = (r1 >= r2) ? r1 : r2;
		return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
	};

	/**
	 * 两数相除 
	 * @param {Object} num1
	 * @param {Object} num2
	 */
	t.accDiv = function(num1, num2) {
		var t1, t2, r1, r2;
		try {
			t1 = num1.toString().split('.')[1].length;
		} catch (e) {
			t1 = 0;
		}
		try {
			t2 = num2.toString().split(".")[1].length;
		} catch (e) {
			t2 = 0;
		}
		r1 = Number(num1.toString().replace(".", ""));
		r2 = Number(num2.toString().replace(".", ""));
		return (r1 / r2) * Math.pow(10, t2 - t1);
	};
	/**
	 * 两数相乘
	 * @param {Object} num1
	 * @param {Object} num2
	 */
	t.accMul = function(num1, num2) {
		var m = 0,
			s1 = num1.toString(),
			s2 = num2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {};
		try {
			m += s2.split(".")[1].length
		} catch (e) {};
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	};

	/**
	 *	返回的是字符串形式的参数，例如：class_id=3&id=2&   
	 */
	t.getUrlArgStr = function() {
		var q = location.search.substr(1);
		var qs = q.split('&');
		var argStr = '';
		if (qs) {
			for (var i = 0; i < qs.length; i++) {
				argStr += qs[i].substring(0, qs[i].indexOf('=')) + '=' + qs[i].substring(qs[i].indexOf('=') + 1) + '&';
			}
		}
		return argStr;
	};
	
	/**
	 * 返回的是对象形式的参数 
	 */
	t.getUrlArgObject = function() {
		var args = new Object();
		var query = location.search.substring(1); //获取查询串  
		var pairs = query.split("&"); //在逗号处断开  
		for (var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('='); //查找name=value  
			if (pos == -1) { //如果没有找到就跳过  
				continue;
			}
			var argname = pairs[i].substring(0, pos); //提取name  
			var value = pairs[i].substring(pos + 1); //提取value  
			args[argname] = unescape(value); //存为属性  
		}
		return args; //返回对象  
	};

	/**
	 * String、Date 扩展
	 */
	//字符串格式化扩展
	String.prototype.format = function(args) {
		if (arguments.length > 0) {
			var result = this;
			if (arguments.length == 1 && typeof(args) == "object") {
				for (var key in args) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			} else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] == undefined)
						arguments[i] = " ";
					if (arguments[i] == undefined) {
						return "";
					} else {
						var reg = new RegExp("({[" + i + "]})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
			return result;
		} else {
			return this;
		}
	}

	//日期格式化
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month
			"d+": this.getDate(), //day
			"h+": this.getHours(), //hour
			"m+": this.getMinutes(), //minute
			"s+": this.getSeconds(), //second
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
			"S": this.getMilliseconds() //millisecond
		}
		if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
			(this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(format))
				format = format.replace(RegExp.$1,
					RegExp.$1.length == 1 ? o[k] :

					("00" + o[k]).substr(("" + o[k]).length));
		return format;
	}
	Date.prototype.addDay = function(days) {
		this.setDate(this.getDate() + days);
		return this;
	};
	Date.prototype.addHour = function(hours) {
		this.setHours(this.getHours() + hours);
		return this;
	};

	//Return the module value
	return t;
}(window.utils = {});