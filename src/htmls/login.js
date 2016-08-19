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
				loginbymobile.addEventListener('tap', function() {
		
					loginType = 0;
		
					loginbymobile.disabled = true;
					var tempobj = {
						mobile: mobileno.value,
						verifyCode: checkcode.value
					};
					if(tempobj.mobile != '' && tempobj.verifyCode != '') {
						win.servicebus.indexQuickLogin(tempobj, fn_loginSuccessCallback, fn_loginErrorCallback);
					} else {
						fn_checkLoginLegal(tempobj);
						loginbymobile.disabled = false;
					}
		
				}, false);

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


	}

	/**
	 *  密码登录   快捷登录
	 */
		function plusReady() {
			plus.screen.lockOrientation("portrait-primary");
	
		}


})(mui, document, window);