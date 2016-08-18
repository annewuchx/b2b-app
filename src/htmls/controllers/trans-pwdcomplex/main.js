/**
 * 输入交易密码
 */
define(function(require, exports, module) {

	var $ = mui,
		win = window,
		doc = document;

	var self = exports;

	require('./style.css');
	require('../../../css/mui.poppicker.css');
	require('../../../js/app.js');
	//	require('../../../js/servicebus.js');

	var uiHtml = require('./ui.html');

	var mask = $.createMask();
	var _hasInit = false;
	var userInfo = win.app.getState();
	var ui = null;
	var currentActiveInput = "password";

	/**
	 * ------把页面追加到主页
	 */
	self.append = function() {
		var fragment = document.createElement("div");
		fragment.innerHTML = uiHtml;
		document.body.appendChild(fragment);

		ui = {
			container: doc.getElementById('container-trans-pwd'),
			numbers: doc.querySelectorAll('.pwd-number'),
			delete: doc.querySelector('.pwd-delete'),
			password: doc.getElementById('password'),
			sixDigit: doc.querySelector('.sixDigitPassword'),
			forgetPwd: doc.getElementById('forgetPwd'),
			inputCheckCode: doc.getElementById('inputCheckCode'),
			yckkeyboard: doc.getElementById('yck-vr-keyboard'),
			//			btnSubmit: doc.getElementById('pwdcomplex_btnSubmit'),
			btnGetCheckCode: doc.getElementById('btnGetCheckCode')
		};

	};

	self.hide = function() {
		ui.container.classList.remove('mui-active');
		mask.close();
		self.callback = null;
		//处理物理返回键
		mui.back = self.__back;
	};

	self.show = function(callback) {
		if(!_hasInit) {
			self.init();
		}
		ui.btnGetCheckCode.addEventListener('tap', getCheckCode, false);
		ui.forgetPwd.addEventListener("tap", forgetPwd, false);
		//each time Reset password
		ui.password.value = "";
		ui.inputCheckCode.value = "";
		showDigit();

		mask.show();
		self.callback = callback;
		ui.container.classList.add('mui-active');
		//处理物理返回键
		self.__back = mui.back;
		mui.back = function() {
			self.hide();
		};

	};

	self.ok = function() {

		var pwvalue = ui.password.value;
		var checkvalue = ui.inputCheckCode.value;
		if(self.callback) {
			self.callback(pwvalue, checkvalue);
		}
		self.hide();
	};

	self.init = function() {

		self.append();

		doc.querySelector('.mui-poppicker-btn-cancel').addEventListener('tap', function() {

			self.hide();

		}, false);

		ui.inputCheckCode.addEventListener('tap', function() {
			document.activeElement.blur();

			currentActiveInput = "checkcode";

		}, false);

		ui.inputCheckCode.addEventListener('input', function() {

			if(ui.password.value.length == 6 && ui.inputCheckCode.value.length == 6) {

				document.activeElement.blur();
				self.ok();
			}

		}, false);


		ui.sixDigit.addEventListener('tap', function() {

			document.activeElement.blur();
			ui.yckkeyboard.classList.remove('hiddenVRKey');

			currentActiveInput = "password";

		});

		//
		mask[0].addEventListener('tap', function() {
			self.hide();
		}, false);

		//注册数字键盘事件
		[].forEach.call(ui.numbers, function(number) {

			number.addEventListener('tap', function() {

				if(currentActiveInput == "password") {

					if(ui.password.value.length >= 6) {
						return;
					}

					var v = this.getAttribute('data-value');

					ui.password.value = ui.password.value + v;

					showDigit();

					if(ui.password.value.length == 6 && ui.inputCheckCode.value.length == 6) {

						self.ok();
					}

				} else {
					//checkcode
					if(ui.inputCheckCode.value.length >= 6) {
						return;
					}

					var v = this.getAttribute('data-value');

					ui.inputCheckCode.value = ui.inputCheckCode.value + v;

					showDigit();

					if(ui.password.value.length == 6 && ui.inputCheckCode.value.length == 6) {

						self.ok();

						//alert("password is ok, the value = " + ui.password.value);

						//to do your business logic here
					}
				}

			}, false);

		});

		//注册回退事件
		ui.delete.addEventListener('tap', function() {
			if(currentActiveInput == "password") {
				ui.password.value = ui.password.value.substring(0, ui.password.value.length - 1);
			} else {
				ui.inputCheckCode.value = ui.inputCheckCode.value.substring(0, ui.inputCheckCode.value.length - 1);
			}

			showDigit();

		}, false);

		_hasInit = true;

	};

	/**
	 * @description 显示模拟密码 
	 */
	function showDigit() {

		var inp_l = ui.password.value.length;

		var el_is = ui.sixDigit.querySelectorAll('i');

		[].forEach.call(el_is, function(o, i) {

			if(i < inp_l) {
				o.querySelector('b').style.display = "block";
			} else {
				o.querySelector('b').style.display = "none";
			}

		});
	}
	/**
	 * 忘记密码
	 */
	function forgetPwd() {
		
		ui.password.value = "";
		showDigit();
		ui.inputCheckCode.value = "";
		
		var phone = "";
		if(userInfo) {
			phone = userInfo.mobile;
		}
		$.openWindow({
			url: 'userfogotpwd.html',
			extras: {
				phone: phone,
				pageid:'userwithdraw.html'
			}
		});
	}
	/**
	 * 获取验证码
	 */
	function getCheckCode() {
		var userinfo = window.app.getState();
		win.servicebus.commonUserGetcode({
			"userId": userinfo.userId,
			"type": 4
		}, fn_withdrawGetcodeSuccess, fn_withdrawGetcodeError);
	}
	/**
	 * 验证码success
	 * @param {Object} data
	 */
	function fn_withdrawGetcodeSuccess(data) {
		if(data.returnCode != "100000") {
			$.toast(data.returnMsg);

		} else {

			fn_codetiming();

//			$.toast('验证码已发送您手机');
		}
	}

	/**
	 * 验证码 code 倒计时
	 */

	function fn_codetiming() {
		var btnCheckCode = ui.btnGetCheckCode;
		setTimeout(function() {
			var iLastMins = 60;
			var interval = setInterval(function() {
				btnCheckCode.innerText = iLastMins-- + '秒后重发';
				if(iLastMins <= 0) {
					clearInterval(interval);
					btnCheckCode.innerText = "重新发送"
					btnCheckCode.disabled = false;
					btnCheckCode.style.background = '#06f';
				}
			}, 1000);
		}, 15);

		btnCheckCode.disabled = true;
		btnCheckCode.style.background = '#cccccc';
	}
	/**
	 * 验证码error
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function fn_withdrawGetcodeError(xhr, type, errorThrown) {
		$.alert("系统异常", '银承库', function() {});
	}
});