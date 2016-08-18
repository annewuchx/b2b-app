/**
 * 现金余额
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {

	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: ajaxGetUserData
			}
		}
	});
	
	$.hideLoading();
	
	
	/**
	 * 获取登录消息
	 */

	var moneyObj = {
		'accountBalance': 0,
		'accountName': '',
		'bankNumber': '',
		'bankName': '',
		'bankCnps': ''

	};
	var mony_vue = new Vue({
			el: ".mui-content",
			data: {
				billLeft: moneyObj
			}
		})
		/**
		 * vue过滤器 整数格式化
		 */
	Vue.filter('rmb', function(num) {
		var num = (num || 0).toString(),
			result = '';
		while(num.length > 3) {
			result = ',' + num.slice(-3) + result;
			num = num.slice(0, num.length - 3);
		}
		if(num) {
			result = num + result;
		}
		return result;
	});
	/**
	 * vue过滤器  整数
	 */
	Vue.filter('financeInteger', function(num) {
		if(num == 0) {
			num = "0.00";
		} else {

			num += "";
		}
		var arr = num.split(".");
		return arr[0];
	});
	/**
	 * vue过滤器 2位小数
	 */
	Vue.filter('financeDecimals', function(num) {
		if(num == 0) {
			num = "0.00";
		} else {
			num += "";
		}
		var arr = num.split(".");

		var str = arr.length == 1 ? "00" : arr[1];

		var newStr = str.length >= 2 ? str.substr(0, 2) : str + '0';

		return newStr;
	});
	/**
	 * ajax获取数据
	 */
	function ajaxGetUserData() {
		var userinfo = win.app.getState();
		if(userinfo == null || typeof userinfo.userId == 'undefined' || userinfo == '{}' || userinfo == '') {
			$.hideLoading();
			return;
		}
		var userId = userinfo.userId;
		var data = {
			userId: userId
		};
		window.servicebus.accountCashbalance(data, fn_accountCrashSuccess, function(xhr, type, errorThrown) {

			$.hideLoading();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		});
	}
	/**
	 * 现金余额    成功回调
	 * @param {Object} data
	 */
	function fn_accountCrashSuccess(data) {

		$.hideLoading();
		
		mui('#pullrefresh').pullRefresh().refresh(true);
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		
		if(data.returnCode != "100000") {

			$.alert(data.returnMsg, '银承库', function() {});
		} else {

			if(data.bodyData == '' || data.bodyData == null || JSON.parse(data.bodyData).cashAccount == null || JSON.parse(data.bodyData).cashAccount == '') {

				$.alert('服务器传输数据错误', '银承库');
				return;
			}
			var moneyObj2 = JSON.parse(data.bodyData).cashAccount;
			mony_vue.$set('billLeft', moneyObj2)

		}

	}

	$.plusReady(function() {
		ajaxGetUserData();
		/**
		 * 监听refresh
		 */

		window.addEventListener("RefreshPage", function() {

			location.reload();
		});

	
		/**
		 * 提现按钮
		 */

		document.querySelector('#txBnt').addEventListener('tap', function(event) {
			var indexData = JSON.parse(localStorage.getItem("userIndex_accountOwnercash"));
			if(indexData.ownerCash.useState != 0) {
				$.alert("请认证", '银承库', function() {});
			} else {
				$.redirectWindow('userwithdraw.html', 'userwithdraw.html');
			}
		});

	})

})(mui, document, window)