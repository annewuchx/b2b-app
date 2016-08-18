(function($, doc, win) {
	/**
	 * init
	 */
	$.init();

	/**
	 *  ready
	 */
	$.ready(function() {
		var btnCheckCode = gel('btnCheckCode');
		btnCheckCode.addEventListener('tap', function(event) {
			//获取验证码
			var mobileNum = fn_getInputVal('.reg-mobile');
			var regex_phone = /^(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
			if(!mobileNum || !regex_phone.test(mobileNum)) {
				$.toast('手机号码不正确');
				return;
			}
			win.servicebus.commonGetcode({
				mobile: mobileNum,
				type: '1'
			}, fn_getCodeSuccess);
		});

		var mobileDom = gel('regMobile');
		var checkCodeDom = gel('regCheckcode');
		var passwordDom = gel('regPassword');

		/**
		 * 注册按钮 去掉disabled
		 */
		mobileDom.addEventListener('input', function() {
			fn_changBtnStatus(mobileDom.value, checkCodeDom.value, passwordDom.value, gel('regFrom'));
		})
		checkCodeDom.addEventListener('input', function() {
			fn_changBtnStatus(mobileDom.value, checkCodeDom.value, passwordDom.value, gel('regFrom'));
		})
		passwordDom.addEventListener('input', function() {
			fn_changBtnStatus(mobileDom.value, checkCodeDom.value, passwordDom.value, gel('regFrom'));
		})

		/**
		 * 控制是否显示密码
		 */
		gel('yck-eye').addEventListener('tap', function(event) {
			var obj = event.target;
			var statu = obj.getAttribute("statu");
			if(statu == 0) {
				obj.setAttribute('statu', '1');
				gel('regPassword').setAttribute('type', 'text');
				obj.classList.remove('yf-eyeclose');
				obj.classList.add('yf-eyeopen');

			} else {
				obj.setAttribute('statu', '0');
				gel('regPassword').setAttribute('type', 'password');
				obj.classList.remove('yf-eyeopen');
				obj.classList.add('yf-eyeclose');

			}

		});

		/**
		 * 协议跳转
		 */
		gel('assistBtn').addEventListener('tap', function() {
			var target = 'xieyi.html';
			$.openWindow(target, target);
		})

		/**
		 * 更改reg按钮的状态  disabled
		 * 
		 */
		function fn_changBtnStatus(val1, val2, val3, btn) {

			if(val1.length > 0 && val2.length > 0 && val3.length > 0) {
				btn.disabled = false;
			} else {
				btn.disabled = true;
			}
		}

	});
	/*
	 * plus resdy
	 */
	$.plusReady(function() {

		var el_regFrom = gel('regFrom');

		el_regFrom.addEventListener('tap', function() {

			el_regFrom.disabled = true; //防重复提交

			var tempobj = {
				mobile: fn_getInputVal('.reg-mobile'),
				passwd: fn_getInputVal('.reg-pw'),
				verifycode: fn_getInputVal('.reg-code')
			};

			if(tempobj.mobile != '' && tempobj.passwd != '' && tempobj.verifycode != '') {
				win.servicebus.indexRegister({
					mobile: fn_getInputVal('.reg-mobile'),
					passwd: fn_getInputVal('.reg-pw'),
					verifycode: fn_getInputVal('.reg-code')
				}, fn_regSuccessCallback, fn_regErrorCallback)
			} else {
				fn_checkLoginLegal(tempobj);
				el_regFrom.disabled = false;
			}

		}, false);

	});

	/**
	 * 
	 * @param {String} classname
	 */
	function fn_getInputVal(classname) {
		return document.querySelector(classname).value;
	}

	/**
	 * 验证码 成功回调
	 * @param {Object} data
	 */
	function fn_getCodeSuccess(data) {

		if(data.returnCode == 'err991000') {
			$.toast(data.returnMsg);
		} else {
			fn_codetiming();
		}
	}

	/**
	 * 验证输入是否合法
	 * @param {Object} obj
	 */
	function fn_checkLoginLegal(obj) {

		if(obj.mobile == '') {
			$.toast('请填写手机号码');
			return;
		}
		if(obj.verifycode == '') {
			$.toast('请填写验证码');
			return;
		}
		if(obj.passwd == '') {
			$.toast('请填写密码');
			return;
		}
	}

	/**
	 * get code btn倒计时
	 */
	function fn_codetiming() {
		var btnCheckCode = gel('btnCheckCode');
		setTimeout(function() {
			var iLastMins = 60;
			var interval = setInterval(function() {
				//
				btnCheckCode.innerHTML = iLastMins-- + '秒后重发';
				if(iLastMins <= 0) {
					clearInterval(interval);
					btnCheckCode.innerText = "重新发送"
					btnCheckCode.disabled = false;
					btnCheckCode.style.background = '#0066ff';
				}
			}, 1000);
		}, 15);
		btnCheckCode.disabled = true;
		btnCheckCode.style.background = '#CCCCCC';
	}

	/**
	 * reg successCallback
	 * @param {Object} data
	 */
	function fn_regSuccessCallback(data) {
		var el_regFrom = gel('regFrom');
		var rsp = JSON.parse(data.bodyData).responseBody;

		if(el_regFrom.disabled) {
			el_regFrom.disabled = false; //防重复提交
		}

		if(!data || !data.bodyData || !rsp) {
			$.toast('网络不通');
			return;
		}

		var msg = '';
		//账号、验证码、密码
		if(rsp.hasOwnProperty('message') && rsp.message != '') {
			msg = JSON.parse(data.bodyData).responseBody.message;
			$.toast(msg);
			return;
		}

		app.createState(rsp);
		$.toast('注册成功');

		var frontwv = plus.webview.getWebviewById('login.html');
		var current = plus.webview.currentWebview();
		$.openWindow({
			url: "verifiedstep1.html",
			id: "verifiedstep1.html"
		});

		setTimeout(function() {
			frontwv.close('none', 0);
			current.close('none', 0);
		}, 600)

	}

	/**
	 * 注册失败回调  
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function fn_regErrorCallback(xhr, type, errorThrown) {
		var el_regFrom = gel('regFrom');
		if(el_regFrom.disabled) {
			el_regFrom.disabled = false; //防重复提交
		}
	}

})(mui, document, window)