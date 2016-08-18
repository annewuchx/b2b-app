/**
 * 用户提现
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */
(function($, doc, win) {

	var userinfo = win.app.getState();
	/*
	 * 
	 */
	$.init();

	/*
	 * 
	 */
	$.ready(function() {

		//		$.hideLoading();

		var ui = gel('withdraw-submit');

		var mask = $.createMask();
		var model = {};
		var selectBankId = '';

		if(userinfo != '{}' && userinfo != null && userinfo.userId != null) {

			var userId = userinfo.userId;

			$.showLoading();

			win.servicebus.accountGetdraw({
				userId: userId
			}, fn_getDrawSuccess, fn_getDrawError);

		} else {

			$.hideLoading();
		}

		/**
		 * 提现金额输入显示
		 */
		var moneyInput = document.getElementById('txAmount');
		var money1text = document.getElementById('money1_text');
		moneyInput.addEventListener('input', function() {

			this.value = this.value.replace(/[^\d\.]/g, '');

			//已.开头
			if(/^\./.test(this.value)) {
				this.value = '0' + this.value;
			}

		});

		money1text.addEventListener('tap', function() {
			moneyInput.style.display = "block";
			money1text.style.display = "none";
		});

		//change
		moneyInput.addEventListener('blur', function() {

			var val = '0.00';

			if(this.value != '0.' && this.value != '') {
				val = parseFloat(this.value).toFixed(2).toString();
			}
			moneyInput.setAttribute('data-v', val);

			money1text.innerHTML = AngelMoney(val);
			moneyInput.style.display = "none";
			money1text.style.display = "block";

		});

		/**
		 * 全部提现
		 */
		gel('txBtn').addEventListener('tap', function(event) {
			var amount = gel('cashAmount').getAttribute('data-v');

			gel('txAmount').value = amount;
			moneyInput.setAttribute('data-v', amount);
			money1text.innerHTML = AngelMoney(amount);

		});

		/**
		 * 提现modal显示
		 */
		gel('sendMail').addEventListener('tap', function(event) {

			document.activeElement.blur();

			var totalCash = gel('cashAmount').getAttribute('data-v');
			var withdrawMoney = moneyInput.getAttribute('data-v');
			//验证是否输入提现金额
			if(parseFloat(withdrawMoney) == parseFloat(0.00)) {
				$.toast('请输入正确的提现金额');
				return;
			}
			//提现金额不能大于账户金额
			if(parseFloat(withdrawMoney) > parseFloat(totalCash)) {
				$.toast('提现金额不能大于账户金额');
				return;
			}
			seajs.config({
				base: "../"
			});
			seajs.use('./controllers/trans-pwdcomplex/main', function(model) {

				model.show(function(pwvalue, checkvalue) {

					var amount = gel('txAmount').value;

					var bankCardId = gel('bankId').value;

					var verifyCode = checkvalue;
					var transPassword = pwvalue;

					var withdrawObj = {
						"userId": userinfo.userId,
						"bankCardId": bankCardId,
						"amount": amount,
						"verifyCode": verifyCode,
						"transPassword": transPassword
					};

					$.showLoading();
					win.servicebus.accountWithdraw(withdrawObj, fn_withDrawSuccess, fn_withDrawError);
					/**
					 * 提现失败回调
					 * @param {Object} xhr
					 * @param {Object} type
					 * @param {Object} errorThrown
					 */
					function fn_withDrawError(xhr, type, errorThrown) {
						$.hideLoading();
					}

					/**
					 * 提现成功回调
					 * @param {Object} data
					 */
					function fn_withDrawSuccess(data) {
						$.hideLoading();

						if(data.returnCode != "100000") {
							$.alert(data.returnMsg, '银承库', function() {});
						} else {

							var wb = plus.webview.getWebviewById('userindex_sub.html');
							mui.fire(wb, 'RefreshPage');
							var wb2 = plus.webview.getWebviewById('usermoney_sub.html');
							mui.fire(wb2, 'RefreshPage');
							$.alert('到账时间会因各银行不同而有差异，请耐心等待！', '提现成功!', '知道了', function() {
								location.reload();
							});

						}

					}

					/**
					 * 关闭本页面和前一页 跳转到首页
					 */
					function closePage() {
						var frontwv = plus.webview.getWebviewById('usermoney.html');
						$.toMain();
						frontwv.close();
						$.closeWin();

					}
				});

			});

		});

		/**
		 * 选择银行卡
		 */
		gel('banks').addEventListener('tap', function() {

			document.activeElement.blur();
			$.openWindow({
				url: 'userbankselect.html',
				id: 'userbankselect.html',
				extras: {
					bindBankId: selectBankId
				}
			});
		});

		/**
		 * 监听银行返回事件
		 */
		win.addEventListener('customEvent', function(event) {

			var id = event.detail.bank;

			gel('bankName').innerText = event.detail.bankName;

			gel('bankNum').innerHTML = '尾号:' + event.detail.bankNo.substr(-4);

			selectBankId = event.detail.bankCardId;

			gel('bankId').value = event.detail.bankCardId;

		});

		function AngelMoney(s) {

			if(s == "") {
				s = "0";
			}

			if(/[^0-9\.]/.test(s)) return $.toast("不是数字！");
			if(/^\./.test(s)) {
				s = '0' + s;
			}

			var arrV = parseFloat(s).toFixed(2).split('.');
			//小数点
			var d1 = "." + arrV[1];

			s = s.replace(/^(\d*)$/, "$1.");
			s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
			s = s.replace(".", ",");

			var re = /(\d)(\d{3},)/;

			while(re.test(s)) {
				s = s.replace(re, "$1,$2");
			}

			s = s.replace(/,(\d\d)$/, ".$1");
			s = s.replace(/.(\d\d)$/, "");

			var strFormat = '<span class="disscountMoney"><span>' + s + '</span><span style="font-size:28px">' + d1 + '</span></span>';
			return strFormat;
		}

		/**
		 * getDraw success
		 * @param {Object} data
		 */
		function fn_getDrawSuccess(data) {
			$.hideLoading();
			if(data.returnCode != "100000") {
				$.alert(data.returnMsg, '银承库', function() {});

			} else {
				if(data.bodyData == '' || data.bodyData == null) {
					$.alert(data.returnMsg, '银承库', function() {});
					return;
				}

				var jsonData = JSON.parse(data.bodyData);

				selectBankId = jsonData.banks.bindBankId;

				new Vue({
					el: ".mui-content",
					data: jsonData
				});

			}

		}

		/**
		 *  银行卡后4位
		 */
		Vue.filter('formatBank', function(num) {

			return num.substr(-4);
		});

		/**
		 * getDraw error
		 * @param {Object} xhr
		 * @param {Object} type
		 * @param {Object} errorThrown
		 */
		function fn_getDrawError(xhr, type, errorThrown) {
			$.hideLoading();
		}

	});

})(mui, document, window);