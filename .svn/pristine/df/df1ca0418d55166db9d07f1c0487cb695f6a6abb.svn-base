/**
 * 输入交易密码
 */
define(function(require, exports, module) {

	var win = window,
		doc = document;
	var self = exports;

	require('./style.css');
	require('../../../css/mui.poppicker.css');

	var uiHtml = require('./ui.html');

	var mask = mui.createMask();
	var _hasInit = false;
	var userInfo = win.app.getState();
	var ui = null;

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
			forgetPwd: doc.getElementById('forgetPwd')
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
		if (!_hasInit) {
			self.init();
		}
		ui.forgetPwd.addEventListener("tap", forgetPwd, false);
		//each time Reset password
		ui.password.value = "";
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

		var v = ui.password.value;
		if (self.callback) {
			self.callback(v);
		}
		self.hide();
	};

	self.init = function() {

		self.append();

		doc.querySelector('.mui-poppicker-btn-cancel').addEventListener('tap', function() {

			self.hide();

		}, false);

		//
		mask[0].addEventListener('tap', function() {
			self.hide();
		}, false);

		//注册数字键盘事件
		[].forEach.call(ui.numbers, function(number) {

			number.addEventListener('tap', function() {

				if (ui.password.value.length >= 6) {
					return;
				}

				var v = this.getAttribute('data-value');

				ui.password.value = ui.password.value + v;

				showDigit();

				if (ui.password.value.length == 6) {

					self.ok();

					//alert("password is ok, the value = " + ui.password.value);

					//to do your business logic here
				}

			}, false);

		});

		//注册回退事件
		ui.delete.addEventListener('tap', function() {

			ui.password.value = ui.password.value.substring(0, ui.password.value.length - 1);

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

			if (i < inp_l) {
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
		var phone = "";
		if (userInfo) {
			phone = userInfo.mobile;
		}
		mui.openWindow({
			url: 'userfogotpwd.html',
			extras: {
				phone: phone,
				pageid:"financingindex.html"
			}
		});
	}
});