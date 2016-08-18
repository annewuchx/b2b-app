/**
 * B2B App 
 * Global App Library
 * depend on: { 'config.js' }
 **/
(function($) {

	if(CONFIG == null) {
		$.alert("资源引用出错,缺少配置文件");
		return;
	}

	var win = window;
	//global get 
	win.gel = gel;

	if(win.seajs) {
		seajs.config({
			base: "./",
			alias: {
				"highcharts": "../libs/highcharts/highcharts.js"
			}
		});
	}

	//	/**
	//	 * 5+条件判断 
	//	 */
	//	var H5Plus = false;
	//	if(navigator.userAgent.match(/Html5Plus/i)) {
	//		H5Plus = true;
	//	}

	//全局配置(通常所有页面引用该配置，特殊页面使用mui.init({})来覆盖全局配置)
	$.initGlobal({
		swipeBack: false //是否启用右滑关闭
	});

	function gel(id) {
		return document.getElementById(id);
	}

	/**
	 * 
	 * @param {Object} url
	 * @param {Object} id
	 * @param {Object} styles
	 * @param {Object} extras
	 * @param {Object} showedCB
	 * @param {Object} onClosed
	 */
	$.openWin = function(url, id, options) {

		if(win.plus) {
			$.openWindow(url, id, options);
		} else {
			location.href = url + "?" + $.json2Par(options.extras);
		}

	};

	$.json2Par = function(o, pre) {
		var undef, buf = [],
			key, e = encodeURIComponent;
		for(key in o) {
			undef = o[key] == 'undefined';
			if(!undef) {
				var val = o[key];
				buf.push("&", e(key), "=", (val != key || !undef) ? e(val) : "");
			}
		}
		if(!pre) {
			buf.shift();
			pre = "";
		}
		return pre + buf.join('');
	};

	/**
	 * AJAX返回登录超时信息，跳转登录页面方法
	 * @param {String} activeId 	    登录成功后，返回的 webviewid.
	 * @param {Function} showedCB	
	 */
	$.timeOutToLogin = function(activeId, showedCB) {

		app.setState(null);

		//		if(win.plus) {
		//			//var h = plus.webview.getLaunchWebview();
		//			var h = getWebView_Footer();
		//			$.fire(h, "refreshToken");
		//		}

		$.RefreshAllOpenPage();

		$.openWindow({
			url: "login.html",
			id: "login.html",
			show: {
				duration: 200,
				aniShow: "pop-in"
			},
			waiting: {
				autoShow: true,
				title: win.resources.langs.loading
			},
			extras: {
				activeTab: activeId
			}
		});

		if(showedCB != null && typeof showedCB === "function") {
			showedCB();
		}

		//$.alert("您还未登录或登录已过期，请重新登陆！", "温馨提示", function() {});
	};

	/*
	 * 刷新
	 */
	$.RefreshAllOpenPage = function() {
		if(!win.plus) {
			return;
		}
		var footer = getWebView_Footer();
		if(footer != null) {
			$.fire(footer, "RefreshAllOpenPage");
		}
	};

	//Webview of Footer.html
	$.WVFooter = getWebView_Footer;

	/**
	 * plusReady 
	 */
	function getWebView_Footer() {
		var footer = plus.webview.getWebviewById('footer.html');
		if(footer == null) {
			footer = plus.webview.getWebviewById('HBuilder');
		}
		if(footer == null) {
			footer = plus.webview.getLaunchWebview();
		}
		return footer;
	}

	/**
	 * 登录或退出后，现有已打开页面，执行RefreshPage操作
	 * @param {Object} webviewid 如果指定webview，仅执行指定对，否则所有页面
	 * @param {Object} callback
	 */
	$.RefreshPage = function(webviewid, callback) {

		if(!win.plus) {
			return;
		}

		var wid = null,
			fncallback = {};

		if(arguments.length == 1) {
			if(typeof arguments[0] === "function") {
				fncallback = arguments[0];
			} else {
				wid = webviewid;
			}
		} else if(arguments.length == 2) {
			wid = arguments[0];
			fncallback = arguments[1];
		}

		if(wid == null) {
			var alls = plus.webview.all();
			$.each(alls, function(index, item) {
				mui.fire(item, "RefreshPage");
			});
		} else {
			mui.fire(plus.webview.getWebviewById(wid), "RefreshPage");
		}

		if(fncallback && typeof fncallback === "function") {
			fncallback();
		}

	};

	/*
	 * go to home page
	 */
	$.toMain = function() {
		setTimeout(function() {

			if(win.plus) {
				var webview = plus.webview.getLaunchWebview();
				if(webview != null) {
					$.fire(webview, 'gohome');
				}
				webview.show();
			} else {
				var footer = getWebView_Footer();
				footer.show();
				//$.openWindow('footer.html');
			}

		}, 16);
	};
	/*
	 * @description 关闭自身窗口
	 */
	$.closeWin = function() {
		if(win.plus) {
			var ws = plus.webview.currentWebview();
			setTimeout(function() {
				//console.info('webview closed, the id = ' + ws.id);
				plus.webview.close(ws, "none", 0);
			}, 600);
		}
	}

	/*
	 * 页面跳转 - 
	 */
	$.redirectWindow = function(options, preLoginUrl) {

		if(win.app.checkLogin()) {

			$.openWindow(options);

		} else if(preLoginUrl != null) {

			$.openWindow(preLoginUrl, preLoginUrl, {});
		} else {
			$.openWindow('login.html', 'login.html', {});
		}
	};

	function showLoading() {

		var el_loading = gel("loadding");
		var el_backdrop = gel("backdrop")

		if(el_loading && el_backdrop) {
			el_loading.style.display = "block";
			el_backdrop.style.display = "block";
		}
	}

	function hideLoading() {
		var el_loading = gel("loadding");
		var el_backdrop = gel("backdrop")

		if(el_loading && el_backdrop) {
			el_loading.style.display = "none";
			el_backdrop.style.display = "none";
		}
	}

	/*
	 * 拨打电话
	 */
	$.dialPhone = function(phone, message) {
		mui.confirm(message, '银承库', ['取消', '拨打'], function(e) {
			if(e.index == 1) {
				plus.device.dial(phone, false);
			}
		});
	}

	$.showLoading = showLoading;
	$.hideLoading = hideLoading;

	/**
	 * 处理回退事件
	 */
	function handle_BackEvent() {
		var back = $.back;
		$.back = function() {
			var current = plus.webview.currentWebview();
			//			
			//			extras: {
			//          		mType: 'sub'
			//          }
			if(current.mType === 'main') { //模板主页面
				current.hide('auto');
				setTimeout(function() {
					document.getElementById("title").className = 'mui-title mui-fadeout';
					current.children()[0].hide("none");
				}, 200);
			} else if(current.mType === 'sub') {
				if($.targets._popover) {
					$($.targets._popover).popover('hide');
				} else {
					current.parent().evalJS('mui&&mui.back();');
				}
			} else {
				back();
			}
		};
	}

	/**
	 * 
	 */
	function handle_CustomURLEvent() {
		/**
		 *	data-url
		 * data-login = [true, false, 'url.html']
		 */
		mui(document).on('tap', 'a', function() {

			var target = this.getAttribute('data-url');
			if(target == null) {
				return;
			}

			//data-login = [true, false, 'url.html']
			var isLogin = this.getAttribute('data-login');

			if(isLogin == "true") {
				var hasLogined = win.app.checkLogin();
				if(!hasLogined) {
					$.timeOutToLogin(target);
					return;
				}
			} else if(isLogin == "false" || isLogin == null) {
				//todo nothing
			} else {
				//target oject is URI String
				target = isLogin;
			}

			$.openWindow({
				id: target,
				url: target,
				waiting: {
					autoShow: true
				}
			});

			//			if (win.plus) {
			//				var wv = plus.webview.getWebviewById(target);
			//				if (wv == null) {
			//					$.openWindow({
			//						id: target,
			//						url: target
			//					});
			//				} else {
			//					wv.show();
			//				}
			//			} else {
			//				$.openWindow({
			//					id: target,
			//					url: target
			//				});
			//			}
		});
	}

	/*
	 * 打印所有webview，关闭不需要的[提高性能]
	 */
	function handle_allwebview() {

		var alls = plus.webview.all();
		var currentWebView = plus.webview.currentWebview();

		$.each(alls, function(index, item) {
			//删除空页面
			if(item.getURL() == "about:blank" || item.getURL() == null || item.id == null) {
				plus.webview.close(item);
			}
			//删除相当id，多次打开的相同webview
			if(currentWebView.id == item.id) {
				if(currentWebView['__uuid__'] != item['__uuid__']) {
					plus.webview.close(item);
				}
			}

		});
		//		alls = plus.webview.all();
		//		console.warn("app.js > now the total webview count = " + alls.length);
	}

	$.ready(function() {
		handle_CustomURLEvent();
	});

	/*
	 * 
	 */
	$.plusReady(function() {
		//handle_BackEvent();
		handle_allwebview();

		//设置应用是否输出日志
		plus.navigator.setLogs(CONFIG.DEBUG);

	});

	/**
	 * mui 扩展
	 */

	/**
	 * 重写console.log
	 */
	$.log = function() {
		if(!CONFIG) return;
		if(!CONFIG.hasOwnProperty("DEBUG")) return;

		if(CONFIG.DEBUG) {
			if(win.plus) {
				console.info("[Page From] = " + plus.webview.currentWebview().id);
			}
			[].forEach.call(arguments, function(item) {
				console.log(item);
			});
		}
	};

	/**
	 * 封装ajax请求
	 */
	$.ErrorConectTimes = 0; //服务连接出错次数
	$.ConectNetTimes = 0; //请求服务次数

	///封装的自动重试加载ajax(重要新增：新增备用地址切换功能)
	///第一次请求主服务器，请求失败后检查是否启用灾备服务器配置

	var localstorage = win.localStorage;

	/**
	 * ajax查询
	 * @param {URIString} func_url : 要打开页面url
	 * @param {Object} options : ajax属性设置
	 * @param {Number} retry : 请求失败重试次数
	 */
	$.ajax_query = function(func_url, options, retry) {

		if(win.plus) {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				$.hideLoading();
				$.toast('网络连接不可用，请稍后再试');
				if(options != null && options.error != null && typeof options.error === "function") {
					options.error({
						code: 500,
						msg: "连接服务器失败，请确保网络连接正常"
					});
				}
				return;
			}
		}

		var onSuccess = function() {};
		var onError = function(code, msg) {
			$.toast(msg);
		};
		var params = {};
		var retry = arguments[2] ? arguments[2] : 1;
		var first_func_url = func_url,
			otherRoot = arguments[3];
		var dataType = "json";
		var type = "get";
		var timeout = 10000;
		//新增第4个参数，设置其根url
		var rooturl = arguments[3] ? arguments[3] : CONFIG.appRootUrl; //服务根目录（需配置）
		func_url = rooturl + func_url;

		if(options != null) {
			if(options.success != null && typeof options.success === "function") {
				onSuccess = options.success;
			}
			if(options.error != null && typeof options.error === "function") {
				onError = options.error;
			}
			if(options.data != null) {
				params = options.data;
			}
			if(options.dataType != null) {
				dataType = options.dataType;
			}
			if(options.type != null) {
				type = options.type;
			}
			if(options.timeout != null) {
				timeout = options.timeout;
			}

		}

		//$.log("[" + CONFIG.appName + "]-服务[" + func_url + "]第" + retry + "次发送服务器请求");
		$.log("[" + CONFIG.appName + "]-服务请求:" + func_url + "--params:" + JSON.stringify(params));

		var ajaxOptions = {
			dataType: dataType,
			type: type,
			timeout: timeout,
			cache: false,
			data: params,
			success: function(data, status, xhr) {
				$.log("[" + CONFIG.appName + "]-服务结果[" + func_url + "]data=" + JSON.stringify(data) + "");

				if(data.returnCode == "err992000") {
					$.timeOutToLogin();
					return;
				}
				//				if(data.returnCode == "err991000") {
				//					$.toast(data.returnMsg);
				//					return;
				//				}

				if(dataType == "json") {
					if(data.hasOwnProperty('bodyData')) {
						try {
							JSON.parse(data.bodyData);

						} catch(e) {
							//$.log(e, data.bodyData);
							mui.alert('服务器传输数据格式异常，请重新尝试！');
							if(win.plus) {
								plus.nativeUI.closeWaiting();
							}
							$.hideLoading();
							return;
						}
					}
				}

				$.ErrorConectTimes = 0;
				$.ConectNetTimes = 0;
				onSuccess(data);
			},
			error: function(xhr, type, errorThrown) {
				retry--;

				//				if ($.ConectNetTimes > 3) {
				//					return onError(500, '连接服务器失败，请确保网络连接正常');
				//				}
				//
				//				//整体切换灾备服务器
				//				if (localstorage.getItem("ChangeMainServices") &&
				//					localstorage.getItem("ChangeMainServices") == "true") {
				//					$.log("[" + CONFIG.appName + "]-服务[" + func_url + "]已切换使用灾备服务器");
				//					$.ConectNetTimes++;
				//					return $.ajax_query(first_func_url, options, retry, CONFIG.appRootBackUrl);
				//				}
				//
				//				//主服务器
				//				if (retry > 3) {
				//					$.ErrorConectTimes++;
				//					if ($.ErrorConectTimes >= 1 && win.plus)
				//						localstorage.setItem("ChangeMainServices", "true");
				//
				//					return $.ajax_query(first_func_url, options, retry, otherRoot);
				//				}
				//				//主服务器请求失败，切换灾备服务器地址
				//				if (retry > 0) {
				//					$.log("[" + CONFIG.appName + "]-服务[" + func_url + "]连接失败，开始切换服务器地址...");
				//
				//					return $.ajax_query(first_func_url, options, retry, CONFIG.appRootBackUrl);
				//				}

				//mui.toast('连接服务器失败，请确保网络连接正常');
				if(win.plus) {
					plus.nativeUI.closeWaiting();
				}
				$.hideLoading();
				onError(500, '连接服务器失败，请确保网络连接正常');

			}
		};

		//
		$.ajax(func_url, ajaxOptions);

	};

	/**
	 * @author Peter 2016-06-21
	 * @description 获取系统信息
	 * 
	 * {
		"IMEI": " ",
		"IMSI": "",
		"Model": "iPhone",
		"Vendor": "Apple",
		"UUID": "98A8A118-61DA-42E1-9535-DAF5342150AB",
		"Screen": "640x1136",
		"DPI": "326x326",
		"OS": {
			"Language": "zh-Hans-US",
			"Version": "9.3",
			"Name": "iOS",
			"Vendor": "Apple"
		},
		"NetworkInfo": "WiFi网络"
		}
	 */
	$.GetDeviceInfo = function() {
		var device = {
			IMEI: plus.device.imei,
			IMSI: '',
			Model: plus.device.model,
			Vendor: plus.device.vendor,
			UUID: plus.device.uuid,
			Screen: plus.screen.resolutionWidth * plus.screen.scale + 'x' + plus.screen.resolutionHeight * plus.screen.scale + '',
			DPI: plus.screen.dpiX + 'x' + plus.screen.dpiY,
			OS: new Object()
		};
		for(var i = 0; i < plus.device.imsi.length; i++) {
			device.IMSI += plus.device.imsi[i];
		}
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = '未知网络';
		types[plus.networkinfo.CONNECTION_NONE] = '未连接网络';
		types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络';
		types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络';
		types[plus.networkinfo.CONNECTION_CELL2G] = '2G蜂窝网络';
		types[plus.networkinfo.CONNECTION_CELL3G] = '3G蜂窝网络';
		types[plus.networkinfo.CONNECTION_CELL4G] = '4G蜂窝网络';
		device.NetworkInfo = types[plus.networkinfo.getCurrentType()];
		device.OS = {
			Language: plus.os.language,
			Version: plus.os.version,
			Name: plus.os.name,
			Vendor: plus.os.vendor
		};
		return device;
	};

})(mui);

///**
// * toggle
// */
//win.addEventListener('toggle', function(event) {
//	if (event.target.id === 'M_Toggle') {
//		var isActive = event.detail.isActive;
//		var table = document.querySelector('.mui-table-view');
//		var card = document.querySelector('.mui-card');
//		if (isActive) {
//			card.appendChild(table);
//			card.style.display = '';
//		} else {
//			var content = document.querySelector('.mui-content');
//			content.insertBefore(table, card);
//			card.style.display = 'none';
//		}
//	}
//});

/**
 * window.app = {} 
 * @param {Object} $
 * @param {Object} owner
 */
(function($, owner) {

	/**
	 * 
	 * @param {String} name
	 * @param {Function} callback
	 */
	owner.createState = function(obj, callback) {

		//		var v = {
		//			"authFlag": "1",
		//			"bindFlag": "",
		//			"code": "100000",
		//			"companyName": "",
		//			"mail": "",
		//			"mailFlag": "",
		//			"message": "",
		//			"mobile": "139****9314",
		//			"realName": "",
		//			"userId": "5381118",
		//			"userName": "13918969314",
		//			"weixin": "",
		//			"token": "token5381118",
		//			"authentication": true
		//		};

		var state = obj;
		state.token = "token" + state.userId;
		state.authentication = state.authFlag == "1";

		owner.setState(state);

		if(callback != null && typeof callback === "undefined") {
			return callback();
		}
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem("$state") || "{}";
		return JSON.parse(stateText);
	};

	/*
	 * check the login state / [true, false]
	 */
	owner.checkLogin = function() {
		var stateObj = owner.getState();
		return stateObj.token != null;
	};
	/*
	 * check the login state [0 = unlogin, 1 = login with not authentiated, 2 = login and authentiated]
	 */
	owner.getLogin = function() {
		var stateObj = owner.getState();
		if(stateObj == null) {
			return 0;
		}
		if(stateObj.token != null && stateObj.authentication != null && stateObj.authentication == true) {
			return 2;
		} else {
			return 1;
		}
	}

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {

		if(state == null && window.plus != null) {
			plus.navigator.removeSessionCookie();
		}

		state = state || {};
		localStorage.setItem("$state", JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem("$settings", JSON.stringify(settings));
	};

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem("$settings") || "{}";
		return JSON.parse(settingsText);
	};
	/**
	 * 清除所有本地用户
	 **/
	owner.clearALLState = function() {
		localStorage.clear();
	};
}(mui, window.app = {}));