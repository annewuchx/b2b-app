(function($, win, doc) {
	$.init();
	//判断是否登录
	var userinfo = win.app.getState();

	var currentLon = "";
	var currentLat = "";

	if(typeof userinfo.userId != 'undefined') { //登录
		gel('mobile1').value = userinfo.cellPhone;
		gel('ph_text1').style.display = "block";
		gel('ph_text2').style.display = "none";
		gel('yzm').style.display = 'none'
	} else { //未登录

		gel('yzm').style.display = 'block';
		gel('ph_text1').style.display = "none";
		gel('ph_text2').style.display = "block";

	}

	//点击悬着业务地点
	gel('selectCity1').addEventListener('tap', function(event) {
		$.openWindow({
			url: 'businesslocation.html',
			show: {

				aniShow: 'slide-in-bottom',
				duration: '200'

			}
		});
	});
	/**
	 * 拨打客服电话
	 */
	gel("getCall").addEventListener('tap', function() {
			$.confirm('拨打客服电话400-006-8808?', '银承库', ['取消', '拨打'], fn_confirmCallback);
		})
		/**
		 * 确认拨打电话
		 * @param {Object} e
		 */
	function fn_confirmCallback(e) {

		if(e.index == 1) { //确认
			plus.device.dial('4000068808', false);
		} else {

		}

	}
	/**
	 * 接受业务地点
	 */
	window.addEventListener('provinceEvent', function(event) {

		var detail = event.detail;

		if(detail == null) {
			return;
		}

		var province = detail.provinceName;
		var storeId = detail.id;
		//
		gel('selectCityId').value = storeId;
		gel('selectCity').value = province;
	});

	/**
	 * 联系我们 确认按钮
	 */
	gel('sub').addEventListener('tap', function(event) {

		document.activeElement.blur();

		var phone = gel('mobile1').value;
		var code = gel('yzmCode').value;
		var storeId = gel('selectCityId').value;
		var city = gel('selectCity').value;

		if(!phone) {
			$.toast('手机号码不能为空');
			return;
		}
		if(gel('yzm').style.display == 'block' && !code) {

			$.toast('验证码不能为空');
			return;
		}
		if(!storeId && (!currentLon || !currentLat)) {
			$.toast('所在地区不能为空');
			return;
		}

		var obj = {
			phone: phone,
			userId: userinfo.userId == null ? "" : userinfo.userId,
			code: code,
			storeId: storeId,
			longitude: currentLon,
			latitude: currentLat,
			name: city
		}
		gel('sub').disabled = true;

		win.servicebus.bookIndex(obj, fn_bookIndexSuccess, function() {
			gel('sub').disabled = false;
		});

	})

	/**
	 * 获取验证码
	 */
	gel('yzm_btn').addEventListener('tap', function(event) {
		document.activeElement.blur();

		var phone = gel('mobile1').value;

		var regex_phone = /^(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
		if(!phone || !regex_phone.test(phone)) {
			$.toast('手机号码不正确');
			return;
		}

		var obj = {
			mobile: phone,
			type: 3
		};
		win.servicebus.commonGetcode(obj, fu_getCodeSuccess);
	});

	/**
	 * 联系我们 提交确认  success
	 * @param {Object} data
	 */
	function fn_bookIndexSuccess(data) {
		console.log(JSON.stringify(data))
		gel('sub').disabled = false;
		if(data.returnCode != "100000") {
			//			$.confirm(data.returnMsg, '银承库', ['去首页', '知道了'], fn_confirm);
			$.toast(data.returnMsg);

		} else {

			var returnMessage = JSON.parse(data.bodyData);
			//			$.confirm('我们会尽快安排专人联系您，请耐心等待。', '提交成功', ['去首页', '知道了'], fn_confirm);
			$.confirm(data.returnMsg, '', ['去首页', '知道了'], fn_confirm);

		}
	}

	function fn_confirm(e) {

		if(e.index == 0) { //去首页
			$.closeWin();
			$.toMain()
		}

	}

	/**
	 * 关闭本页面 跳转到首页
	 */
	function closePage() {
		$.toMain();
		$.closeWin();

	}

	/**
	 * 获取验证码  成功回调
	 * @param {Object} data
	 */
	function fu_getCodeSuccess(data) {
		if(data.returnCode != "100000") {
			$.alert(data.returnMsg, '银承库', function() {});
		} else {
			fn_codetiming();
			//			$.alert('验证码已发送您手机', '银承库');
		}
	}

	/**
	 * 验证码btn 倒计时
	 */
	function fn_codetiming() {
		var btnCheckCode = gel('yzm_btn');
		setTimeout(function() {
			var iLastMins = 60;
			var interval = setInterval(function() {
				//
				btnCheckCode.innerHTML = iLastMins-- + '秒后重发';
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
	 * 
	 */
	$.plusReady(function() {
		
		plus.geolocation.getCurrentPosition(translatePoint, function(e) {

			gel('selectCity').setAttribute('placeholder', '无法自动定位');
		}, {
			timeout: '5000'
		});
	});

	function translatePoint(position) {
		if(!gel('selectCity').value) {
			if(position != null && position.coords != null && position.address != null) {
				currentLon = position.coords.longitude;
				currentLat = position.coords.latitude;
				gel('selectCity').value = position.address.province + ' ' + position.address.city;
			}
		}

	}

}(mui, window, document));