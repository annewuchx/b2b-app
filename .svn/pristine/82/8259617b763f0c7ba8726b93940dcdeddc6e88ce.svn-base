/*
 * @description: 融资订单详情页
 */
(function($, doc, win) {
	/**
	 * 
	 */
	mui.init();

	var ssPrice_data = [];
	var finance_vm = {};
	/**
	 * 
	 * @param {Object} index
	 * @description 票据图片
	 */
	function fn_openPjList(index) {
		var mid = this.items[index].billId;
		
		var userInfo = win.app.getState();
		var userId = "";
		if(userInfo){
			userId = userInfo.userId;
		}
		$.openWindow({
			id: 'userpjpicture.html',
			url: 'userpjpicture.html',
			extras: {
				pid: mid,
				userId: userId
			}
		});
	}

	function handle_showDetail(webview, mid) {
		mui.fire(webview, 'refreshPage', {
			pid: mid
		});
		webview.show();
	}
	/**
	 * 
	 */
	window.addEventListener("pjStateEvent", function(event) {
		mui.showLoading();
		var orderNo = event.detail.orderNo;
		var id = event.detail.id;

		//api
		win.servicebus.orderDetail({
			pid: id,
			orderNo: orderNo
		}, handle_success, handle_error);

		function handle_success(data) {
			//获得服务器响应
			mui.hideLoading();
			if(data == null || data.bodyData == null){
				mui.toast(data.returnMsg);
				return;
			}
			var orderDetail = JSON.parse(data.bodyData).orderDetail;
			ssPrice_data = orderDetail;
			finance_vm = new Vue({
				el: 'body',
				data: {
					items: ssPrice_data,
				},
				methods: {
					openPjList: fn_openPjList,
					handle_withdraw: handle_withdraw
				},
				computed: {
					pjtotalnum: function() {
						var total = this.items.length;
						return total;
					}
				}
			});
			//自定义过滤器
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
//			Vue.filter('bankCard', function(num) {
//				console.log(0)
//				var num = num.substr(num.length-4);
//				return num;
//			});

		}
	
		function handle_error(){
			mui.hideLoading();
		}
	
	});

	Vue.filter('paymentMoneyInteger', function(num) {
		if(num == 0) {
			num = "0.00";
		} else {

			num += "";
		}
		var arr = num.split(".");
		return arr[0];
	});
	Vue.filter('paymentMoneyDecimals', function(num) {
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
	 * @description 提现
	 */
	function handle_withdraw() {
		mui.openWindow({
			url: "userwithdraw.html",
			id: "userwithdraw"
		})
	}

})(mui, document, window);