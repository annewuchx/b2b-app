/*
 * 
 */
(function($, doc, win) {

	var ajaxLock = false;
	var lastdate = null,
		pj_data = [],
		order_vm = {};

	var userId = null;
	//当前页数 分页
	var page = 0;
	var list = null;

	//vue实例
	order_vm = new Vue({
		el: "#datalistcontainer",
		data: {
			pjdata: pj_data
		},
		methods: {
			time: listTime,
			group: function(date1) {
				if(lastdate == date1) {
					return false;
				} else {
					lastdate = date1;
					return true;
				}
			},
			state: pjState
		}
	});

	//
	mui.init({
		pullRefresh: {
			container: '#refreshContainer',
			down: {
				callback: pulldownRefresh
			},
			up: {
				callback: pullupRefresh
			}
		}
	});
	/**
	 * 
	 */
	mui.ready(function() {
		var userInfo = win.app.getState();
		if(userInfo != null) {
			userId = userInfo.userId;
		} else {
			$.timeOutToLogin();
		}
	});

	/**
	 * 
	 */
	$.plusReady(function() {
		setTimeout(function() {
			$('#refreshContainer').pullRefresh().pullupLoading();
		}, 60);
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
	 * 
	 * @param {Object} state
	 * @description 点击对应订单 打开订单详情页 触发事件 传递当前订单的state 
	 */
	function pjState(orderno, id) {
		var webview = plus.webview.getWebviewById('financingordersdetail.html');
		if(webview == null) {
			webview = plus.webview.create('financingordersdetail.html', 'financingordersdetail.html');
			webview.onloaded = function() {
				mui.fire(webview, 'pjStateEvent', {
					orderNo: orderno,
					id: id
				});
				plus.webview.show(webview, "pop-in");
			};
		} else {
			mui.fire(webview, 'pjStateEvent', {
				orderNo: orderno,
				id: id
			});
			plus.webview.show(webview, "pop-in");
		}
	}

	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {

		if(ajaxLock) {
			return;
		}

		ajaxLock = true;

		lastdate = null;

		if(pj_data != null && pj_data.length > 0) {
			pj_data.splice(0, pj_data.length);
		}

		order_vm.$set("pjdata", pj_data);
		page = 1;

		//setTimeout(function() {}, 100);

		//		var mask = mui.createMask(function() {
		//			return true;
		//		});
		//		mask.show();

		//api
		win.servicebus.order({
			userId: userId
		}, handle_success, function() {
			//关闭“正在刷新”的雪花进度提示
			$('#refreshContainer').pullRefresh().endPulldownToRefresh();
			//可重置上拉加载控件
			$('#refreshContainer').pullRefresh().refresh(true);
			//mask.close();
			ajaxLock = false;
		});

		/**
		 * @description 下拉刷新成功后的回调
		 * @param {Object} data
		 */
		function handle_success(data) {

			$('#refreshContainer').pullRefresh().endPulldownToRefresh();
			$('#refreshContainer').pullRefresh().refresh(true);

			ajaxLock = false;
			//mask.close();

			if(data == null || data.bodyData == null) {
				mui.toast(data.returnMsg);
				return;
			}

			pj_data = JSON.parse(data.bodyData).orderList;
			order_vm.$set("pjdata", pj_data);

		}

	}

	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {

		if(ajaxLock) {
			return;
		}

		page++;
		ajaxLock = true;

		//		var mask = mui.createMask(function() {
		//			return true;
		//		});
		//		mask.show();

		//api
		win.servicebus.order({
			userId: userId,
			page: page,
		}, handle_success, function() {
			//mask.close();
			ajaxLock = false;
		});

		/**
		 * @description 成功后的回调
		 * @param {Object} data
		 */
		function handle_success(data) {

			//mask.close();

			//获得服务器响应
			//console.log("上拉加载");
			if(data == null || data.bodyData == null) {

				page--;
				ajaxLock = false;

				mui.toast(data.returnMsg);

				$('#refreshContainer').pullRefresh().endPullupToRefresh(true);

				return;
			}

			list = JSON.parse(data.bodyData).orderList;

			for(var i = 0, l = list.length; i < l; i++) {
				pj_data.push(list[i]);
			}

			order_vm.$set("pjdata", pj_data);

			if(list == null || list.length == 0) {
				page--;
				//参数为true代表没有更多数据了。
				$('#refreshContainer').pullRefresh().endPullupToRefresh(true);
			} else {
				$('#refreshContainer').pullRefresh().endPullupToRefresh(false);
			}

			ajaxLock = false;

		}
	}

	/**
	 * @description 时间
	 * @param {Object} t
	 */
	function listTime(t) {
		//t = "2016-06-07 18:17:02"
		var arrDate = t.split(' ')[0];
		var arrYYYYMMDD = arrDate.split('-');
		var time = arrYYYYMMDD[0] + "年" + arrYYYYMMDD[1] + "月" + arrYYYYMMDD[2] + "日";
		return time;
	}

})(mui, document, window);