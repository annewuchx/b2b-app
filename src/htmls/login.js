/**
 * login.js - login is a page logic file
 * @version v0.0.1
 * @link http://github.com/taoqianbao
 * @license MIT
 * @author PeterZhu
 * @email zhu.shengfeng@yinchengku.com
 */
!(function($, doc, win) {

	var urls = win.resources.urls;
	var loginType = 1; //默认是密码登录    0是快捷登录

	var callbacks = [];
	var receiver;
	var filter;
	var main;
	var isInit = false;
	var isRegistered = false;
	var isOlderVersion = false;

	$.ready(ready);
	//	$.plusReady(plusReady);

	mui.init({
		keyEventBind: {
			backbutton: true //关闭back按键监听
		},
		beforeback: function() {
			//获得列表界面的webview
			//			$.fire($.WVFooter(), 'gohome');
			$.toMain();
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
	/**
	 * 
	 * @description 
	 */
	function checkLoginStatus() {
		var settings = app.getSettings();
		var state = app.getState();

		//检查 "登录状态/锁屏状态" 开始
		if(settings.autoLogin && state.token && settings.gestures) {
			//
			$.openWindow({
				url: urls.unlock.url,
				id: urls.unlock.url,
				show: {
					aniShow: 'pop-in'
				},
				waiting: {
					autoShow: false
				}
			});

			return false;

		} else if(settings.autoLogin && state.token) {

			$.toMain();

			return false;

		} else {
			//
			app.setState(null);
		}
		return true;
	}

	/**
	 * 密码登录
	 */
	function registerLoginEvents() {

		var loginButton = gel('login');
		var accountBox = gel('account');
		var passwordBox = gel('password');

		loginButton.addEventListener('tap', function(event) {
			loginButton.disabled = true;

			var loginInfo = {
				userName: accountBox.value,
				passwd: passwordBox.value
			};
			if(loginInfo.userName != '' && loginInfo.passwd != '') {
				win.servicebus.indexPasswdLogin(loginInfo, fn_loginSuccessCallback, fn_loginErrorCallback);
			} else {
				fn_checkLoginLegal(loginInfo);
				loginButton.disabled = false;
			}

		});

		accountBox.addEventListener('input', function() {
			var accountvalue = accountBox.value;
			var passwordvalue = passwordBox.value;

			fn_changBtnStatus(accountvalue, passwordvalue, loginButton);

		});
		passwordBox.addEventListener('input', function() {
			var accountvalue = accountBox.value;
			var passwordvalue = passwordBox.value;

			fn_changBtnStatus(accountvalue, passwordvalue, loginButton);

		});

	}

	/**
	 * @description  快捷登录
	 */
	function registerLoginMobileEvents() {
		fn_getCheckCode();
		fn_quickLogin();
	}

	/**
	 * 获取验证码
	 */
	function fn_getCheckCode() {
		var btnCheckCode = gel('btnCheckCode');
		var mobileno = gel('mobileno');

		btnCheckCode.addEventListener('tap', function(event) {
			var mobileNum = mobileno.value;
			var regex_phone = /^(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
			if(!mobileNum || !regex_phone.test(mobileNum)) {
				$.toast('请正确输入您的账号');
				return;
			}
			//判断账号是否存在
			fn_isMobileExist(mobileNum);

		});
	}
	/**
	 * 验证码 code 倒计时
	 */

	function fn_codetiming() {
		var btnCheckCode = gel('btnCheckCode');
		btnCheckCode.style.backgroundColor = '#cccccc';
		btnCheckCode.style.borderColor = '#cccccc';
		setTimeout(function() {
			var iLastMins = 60;
			var interval = setInterval(function() {
				btnCheckCode.innerText = iLastMins-- + '秒后重发';
				if(iLastMins <= 0) {
					clearInterval(interval);
					btnCheckCode.innerText = "重新发送"
					btnCheckCode.disabled = false;
					btnCheckCode.style.backgroundColor = '#0066ff';
					btnCheckCode.style.borderColor = '#0066ff';
				}
			}, 1000);
		}, 15);

		btnCheckCode.disabled = true;
	}

	/**
	 *  判断用户名是否存在
	 * @param {String} num
	 */
	function fn_isMobileExist(num) {
		win.servicebus.indexCheckuser({
			mobile: num,
		}, fn_sendCodeRequest);
	}

	/**
	 * 判断账户是否存在 successCallback
	 * @param {Object} data
	 */
	function fn_sendCodeRequest(data) {
		var mobileno = gel('mobileno');
		if(data.bodyData != null) {
			if(JSON.parse(data.bodyData).status == 1) { //账户存在
				win.servicebus.commonGetcode({
					mobile: mobileno.value,
					type: '0'
				}, fn_getCodeSuccess);
			} else {
				$.toast('用户名不存在');
			}
		} else {
			mui.toast('服务器异常');
		}

	}

	/**
	 * 验证码  successCallback
	 * @param {Object} data
	 */
	function fn_getCodeSuccess(data) {
		if(data.returnCode == 'err991000') { //验证码频繁 错误信息
			$.toast(data.returnMsg);
		} else {
			fn_codetiming();
			//登录页面注册短信监听事件
			register(handleSMS);
			//			$.alert('验证码已发送您手机', '银承库');
		}
	}

	/**
	 *  快捷登录 请求发送
	 */

	function fn_quickLogin() {

		var mobileno = gel('mobileno');
		var checkcode = gel('checkcode');
		var loginbymobile = gel('loginbymobile');

		//快捷登录
		//		loginbymobile.addEventListener('tap', function() {
		//
		//			loginType = 0;
		//
		//			loginbymobile.disabled = true;
		//			var tempobj = {
		//				mobile: mobileno.value,
		//				verifyCode: checkcode.value
		//			};
		//			if(tempobj.mobile != '' && tempobj.verifyCode != '') {
		//				win.servicebus.indexQuickLogin(tempobj, fn_loginSuccessCallback, fn_loginErrorCallback);
		//			} else {
		//				fn_checkLoginLegal(tempobj);
		//				loginbymobile.disabled = false;
		//			}
		//
		//		}, false);

		mobileno.addEventListener('input', function() {
			var mobilenovalue = mobileno.value;
			var checkcodevalue = checkcode.value;
			fn_changBtnStatus(mobilenovalue, checkcodevalue, loginbymobile);
		});

		checkcode.addEventListener('input', function() {
			var mobilenovalue = mobileno.value;
			var checkcodevalue = checkcode.value;
			fn_changBtnStatus(mobilenovalue, checkcodevalue, loginbymobile);
		});

	}

	/**
	 * 更改登录按钮的状态  disabled
	 * 
	 */
	function fn_changBtnStatus(val1, val2, btn) {

		if(val1.length > 0 && val2.length > 0) {
			btn.disabled = false;
		} else {
			btn.disabled = true;
		}
	}

	/**
	 * 验证输入是否合法
	 * @param {Object} obj
	 */
	function fn_checkLoginLegal(obj) {
		if(obj.mobile == '' || obj.userName == '') {
			mui.toast('手机号码不能为空');
			return;
		}
		if(obj.verifyCode == '') {
			mui.toast('验证码不能为空');
			return;
		}
		if(obj.passwd == '') {
			mui.toast('密码不能为空');
			return;
		}
	}

	/**
	 * login successCallback
	 * @param {Object} data
	 */
	function fn_loginSuccessCallback(data) {

		var loginButton = gel('login');
		var loginbymobile = gel('loginbymobile');

		if(loginType == 0) {
			loginbymobile.disabled = false;
		} else {
			loginButton.disabled = false;
		}

		if(data != null && data.returnCode != "100000") {
			$.toast(data.returnMsg);
			return;
		}

		if(!data || !data.bodyData) {
			$.toast('服务器返回异常，请重试');
			return;
		}

		var rsp = JSON.parse(data.bodyData).responseBody;

		if(!rsp) {
			$.toast('服务器返回异常，请重试');
			return;
		}

		if(rsp.code == 100000) {
			//登陆成功

			$.toast('登录成功');

			app.clearALLState();

			app.createState(rsp);

			$.RefreshAllOpenPage();

			//判断跳到主页还是指定的页面
			fn_jumpCertainPage();

			//关闭当前webview
			setTimeout(function() {
				var current = plus.webview.currentWebview();
				current.hide();
				current.close('none', 0);
			}, 600);

		} else {
			fn_loginUnsuccess(rsp.message);
		}
	}

	/**
	 * 登录 error callback
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function fn_loginErrorCallback(xhr, type, errorThrown) {
		var loginButton = gel('login');
		var loginbymobile = gel('loginbymobile');
		if(loginbymobile || loginbymobile.disabled) {
			loginbymobile.disabled = false;
		}

		if(loginButton || loginButton.disabled) {
			loginButton.disabled = false;
		}
		//		$.toast('连接服务器失败，请确保网络连接正常');

	}

	/**
	 * 登录不成功 返回错误信息
	 * @param {String} 
	 */
	function fn_loginUnsuccess(msg) {
		if(msg) {
			$.toast(msg);
			return;
		}
	}

	/**
	 * 判断跳到主页还是指定的页面
	 */
	function fn_jumpCertainPage() {

		if(win.plus) {
			var cwv = plus.webview.currentWebview();

			if(typeof(cwv.webviewId) != 'undefined' && cwv.webviewId != null) {

				$.openWindow({
					id: cwv.webviewId,
					url: cwv.webviewId
				});

			} else {
				$.toMain();
			}
		} else {
			$.toMain();
		}

	}

	/**
	 * 跳入注册页面
	 */
	function registerRegPageEvent() {
		var regButton = gel('regBtn');
		var regButton1 = gel('regBtn1');
		regButton.addEventListener('tap', function(event) {
			$.openWindow({
				url: urls.reg.url,
				id: urls.reg.url
					//				show: {
					//					aniShow: 'pop-in'
					//				},
					//				styles: {
					//					popGesture: 'none'
					//				}
			});

		}, false);
		regButton1.addEventListener('tap', function(event) {
			$.openWindow({
				url: urls.reg.url,
				id: urls.reg.url
					//				show: {
					//					aniShow: 'pop-in'
					//				},
					//				styles: {
					//					popGesture: 'none'
					//				}
			});

		}, false);
	}

	/**
	 * 
	 */
	function ready() {
		var loginButton = gel('login');
		if(checkLoginStatus() == false) {
			return;
		}
		//进入注册页面
		registerRegPageEvent();

		$.enterfocus('#login-form input', function() {
			$.trigger(loginButton, 'tap');
		});

		//切换登录和快捷登录

		mui('.login-tap').on('tap', 'a', function() {

			var self = this;

			if(self.getAttribute("data-index") == 1) {
				self.classList.add('login-active');
				self.parentNode.nextElementSibling.firstElementChild.classList.remove('login-active');
				self.parentNode.nextElementSibling.lastElementChild.style.display = 'none';
				gel("item2mobile").style.display = 'block';
				gel("item1mobile").style.display = 'none';
				self.parentNode.lastElementChild.style.display = 'block';

			} else {
				self.classList.add('login-active');
				self.parentNode.previousElementSibling.firstElementChild.classList.remove('login-active');
				self.parentNode.previousElementSibling.lastElementChild.style.display = 'none';
				gel("item1mobile").style.display = 'block';
				gel("item2mobile").style.display = 'none';
				self.parentNode.lastElementChild.style.display = 'block';
			}
		})

		//密码登录
		registerLoginEvents();

		//快捷登录
		registerLoginMobileEvents();

		gel('yck-eye').addEventListener('tap', function(event) {
			var obj = event.target;
			var statu = obj.getAttribute("statu");
			if(statu == 0) {
				obj.setAttribute('statu', '1');
				gel('password').setAttribute('type', 'text');
				obj.setAttribute('class', 'yckfont yf-eyeopen');
			} else {
				obj.setAttribute('statu', '0');
				gel('password').setAttribute('type', 'password');
				obj.setAttribute('class', 'yckfont yf-eyeclose');

			}

		});

		//验证码匹配规则，需要根据实际站点匹配
		var codeRegex = /[0-9]{6}/g;

		var handleSMS = function(msgs) {
			for(var i = 0, len = msgs.length; i < len; i++) {
				var content = msgs[i].getDisplayMessageBody();
				//匹配短信内容，若短信内容包含“XX网”，则认为初步匹配成功
				if(~content.indexOf('银承库')) {
					//匹配验证码规则，比如包含6位数字
					var matches = content.match(codeRegex);
					if(matches && matches.length) {
						var code = matches[0];
						//验证码输入框控件，需根据实际页面修改选择器
						//					var codeElem = document.querySelector('.login-view form input[type="password"]');
						var codeElem = gel("checkcode");
						if(codeElem) {
							codeElem.value = code;

							//TODO 这里可以取消短信监听

							//模拟表单提交，需根据实际页面修改选择器
							gel("loginbymobile").click();
							//						document.querySelector('.login-view form button[type="submit"]').click();
							$.toast('获取短信验证码成功，自动登录..');

						}
						break;
					}
				}
			}
		};

	}

	/**
	 *  密码登录   快捷登录
	 */
	//	function plusReady() {
	//		plus.screen.lockOrientation("portrait-primary");
	//
	//	}

	//plusReady封装，若使用mui，可直接使用mui.plusReady()方法；
	var plusReady = function(callback) {
		if(window.plus) {
			callback();
		} else {
			document.addEventListener("plusready", function() {
				callback();
			}, false);
		}
	};

	/**
	 * 初始化
	 */
	var init = function(callback) {

		console.log('init')
			//仅支持Android版本
		if(plus.os.name !== 'Android') {
			return;
		}
		try {
			var version = plus.runtime.innerVersion.split('.');
			isOlderVersion = parseInt(version[version.length - 1]) < 22298;
			main = plus.android.runtimeMainActivity();
			var Intent = plus.android.importClass('android.content.Intent');
			var IntentFilter = plus.android.importClass('android.content.IntentFilter');
			var SmsMessage = plus.android.importClass('android.telephony.SmsMessage');
			var receiverClass = 'io.dcloud.feature.internal.reflect.BroadcastReceiver';
			if(isOlderVersion) {
				receiverClass = 'io.dcloud.feature.internal.a.a';
			}
			filter = new IntentFilter();
			var onReceiveCallback = function(context, intent) {
				try {
					var action = intent.getAction();
					if(action == "android.provider.Telephony.SMS_RECEIVED") {
						var pdus = intent.getSerializableExtra("pdus");
						var msgs = [];
						for(var i = 0, len = pdus.length; i < len; i++) {
							msgs.push(SmsMessage.createFromPdu(pdus[i]));
						}
						for(var i = 0, len = callbacks.length; i < len; i++) {
							callbacks[i](msgs);
						}
					}
				} catch(e) {}
			}
			receiver = plus.android.implements(receiverClass, {
				a: onReceiveCallback,
				onReceive: onReceiveCallback
			});
			filter.addAction("android.provider.Telephony.SMS_RECEIVED");
			callback && callback();
		} catch(e) {}
	}

	//注册短信监听
	var register = function(callback) {

		console.log('register')
		callbacks.push(callback);
		if(!isInit) {
			isInit = isRegistered = true;
			plusReady(function() {
				init(function() {
					setTimeout(function() {
						//                  console.log('registerReceiver');
						try {
							if(isOlderVersion) {
								main.a(receiver, filter);
							} else {
								main.registerReceiver(receiver, filter); //注册监听
							}
						} catch(e) {}
					}, 300);
				});
			});
		} else if(!isRegistered) {
			//      console.log('registerReceiver');
			try {
				if(isOlderVersion) {
					main.a(receiver, filter);
				} else {
					main.registerReceiver(receiver, filter); //注册监听
				}
			} catch(e) {}
		}
	};
	//注销监听，在登录成功或从登录页跳转到其它页面后调用
	var unregister = function(callback, remove) {
		for(var i = 0, len = callbacks.length; i < len; i++) {
			if(callbacks[i] === callback) {
				callbacks.splice(i, 1);
			}
		}
		if(remove && !callbacks.length) {
			if(main && isRegistered) {
				try {
					if(isOlderVersion) {
						main.a(receiver);
					} else {
						main.unregisterReceiver(receiver);
					}
				} catch(e) {}
				isRegistered = false;
				//          console.log('unregisterReceiver');
			}
		}
	};

})(mui, document, window);