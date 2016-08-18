/**
 * 票据资产
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {
	mui.init({
		pullRefresh: {
			container: '#refreshContainer',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	var userObj = win.app.getState();
	var piaojuTotalPage = [],
		filterConditions = {},
		page = 0;

	gel('refreshContainer').style.height = document.body.clientHeight - 44 - 50 + 'px';

	/**
	 * vue 实例化
	 */
	var bill_vm = new Vue({
		el: "body",
		data: {
			pjdata: {}, //header subpage
			piaojuTotalPage: piaojuTotalPage //content subpage
		},
		methods: {
			openPjList: fn_openPjList //subpage 跳转userpicture
		}
	});

	/*
	 * @description 我要融资跳转
	 */
	gel('wantFinance').addEventListener('tap', function() {

		$.fire($.WVFooter(), 'gohome');

		var wv1 = plus.webview.getWebviewById('financingindex.html');
		$.RefreshPage("financingindex.html");

		$.openWindow({
			url: 'financingindex.html',
			id: 'financingindex.html'
		})

		setTimeout(function() {
			
			var current_father = plus.webview.getWebviewById("userpjlist.html");

			var current = plus.webview.currentWebview();
//			current_father.hide();
//			current.hide();

			current_father.close('none', '0');
			current.close('none', '0');
			
		}, 1000);

	});

	function getLocalStorageData(name) {
		var arr = []
		var localstorage = window.localStorage;
		var localSrorageData = JSON.parse(localstorage.getItem(name));
		if(localSrorageData) { //先取缓存				
			return localSrorageData;
		} else {
			return null;
		}

	}

	/**
	 * 存本地
	 * @param {String} keyName
	 * @param {String} pjdata
	 */
	function setLocalStorageData(keyName, data) {
		var localstorage = window.localStorage;
		localStorage.setItem(keyName, data);
	}

	/**
	 * 票据筛选
	 */
	window.addEventListener("pjsxEvent", function(event) {
		page = 0;
		bill_vm.$set('pjdata', {});

		arr = [];
		pjdata1 = {};
		filterConditions = event.detail.filterConditions;
		fn_filterBills(filterConditions, ++page, 10);

		//可重置上拉加载控件
		$('#refreshContainer').pullRefresh().refresh(true);
	});

	/**
	 * 下拉刷新
	 */
	function pulldownRefresh() {

		page = 0;

		bill_vm.$set('pjdata', {});

		arr = [];
		pjdata1 = {};
		//关闭“正在刷新”的雪花进度提示
		$('#refreshContainer').pullRefresh().endPulldownToRefresh();
		//可重置上拉加载控件
		$('#refreshContainer').pullRefresh().refresh(true);
		fn_filterBills(filterConditions, ++page, 10);

	}

	/**
	 * 上拉加载
	 */
	function pullupRefresh() {
		fn_filterBills(filterConditions, ++page, 10);

	}

	/**
	 * vue过滤器
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

	Vue.filter('financeInteger', function(num) {
		if(num == 0) {
			num = "0.00";
		} else {

			num += "";
		}
		var arr = num.split(".");
		return arr[0];
	});
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
	 * 判断对象是否为空
	 * @param {Object} e
	 */
	function isEmptyObject(e) {
		var t;
		for(t in e)
			return !1;
		return !0
	}

	/**
	 * 数据请求
	 * @param {Object} conditions
	 * @param {Number} num
	 */
	function fn_filterBills(conditions, pnum, psize) {
		$.showLoading();

		if(typeof userObj.userId == 'undefined') {
			gel('noResult').style.display = 'block';
			$.hideLoading();
			return;
		}

		var obj = {};
		if(!isEmptyObject(conditions)) { //对象不为空

			obj = {
				userId: userObj.userId,
				startDate: conditions.startDate,
				bankType: conditions.bankType,
				orderStatus: conditions.orderStatus,
				amount: conditions.amount,
				pageNum: pnum,
				pageSize: psize
			}

		} else {

			obj = {
				userId: userObj.userId,
				pageNum: pnum,
				pageSize: psize,
				orderStatus: '0'
			}

		}

		//根据状态进行数据处理

		win.servicebus.accountBillDetailCondition(obj, fn_getBillDetails, function() {
			$.hideLoading();
		});

	}

	/**
	 * 处理请求得到的数据 
	 * @param {Object} data
	 */

	var arr = [];
	var pjdata1 = {};

	function fn_getBillDetails(data) {
		$.hideLoading();
		var pjdata = {};
		var showPjdata = [];

		if(data.returnCode != "100000") {
			$.alert(data.returnMsg, '银承库', function() {});
		} else {
			var len = JSON.parse(data.bodyData).billDetail[0].billDetailInfo.length;
			if(!data || !data.bodyData || !JSON.parse(data.bodyData).billDetail[0] || !len) {
				gel('noResult').style.display = 'block';
			}

			pjdata = JSON.parse(data.bodyData).billDetail[0];

			if(pjdata.billDetailInfo.length == 0) { //没有结果返回
				//参数为true代表没有更多数据了。
				gel('noResult').style.display = 'none';

				$('#refreshContainer').pullRefresh().endPulldownToRefresh();
				$('#refreshContainer').pullRefresh().endPullupToRefresh(true);
				page--;
				return;
			} else {
				gel('noResult').style.display = 'none';
				//可重置上拉加载控件
				$('#refreshContainer').pullRefresh().refresh(true);
				$('#refreshContainer').pullRefresh().endPullupToRefresh(false);
				//				$('#refreshContainer').pullRefresh().endPullupToRefresh(false);
			}

			//vue数据

			for(var i = 0, len = pjdata.billDetailInfo.length; i < len; i++) {
				arr.push(pjdata.billDetailInfo[i]);
			}
			//			
			pjdata1.totalAmount = pjdata.totalAmount;
			pjdata1.totalCount = pjdata.totalCount;
			pjdata1.billDetailInfo = arr;

			bill_vm.$set('pjdata', pjdata1);

		}

	}

	/**
	 * 根据类名获取对应active标签的值
	 * @param {String} className
	 */
	function fn_getFilterKeyword(className) {
		var lidom = dQSall(className);
		var arr = [];
		for(var i = 0; i < lidom.length; i++) {
			var self = lidom[i];
			if(self.classList.contains('active')) {
				arr.push(self.getAttribute('data-value'))
			}
		}
		return arr.join();
	}

	/**
	 * 
	 * @param {String} name
	 */

	function dQS(name) {
		return doc.querySelector(name);
	}

	/**
	 * 
	 * @param {String} name
	 */
	function dQSall(name) {
		return doc.querySelectorAll(name);
	}

	/**
	 *  跳转到详情页
	 * @param {Number} index
	 */
	function fn_openPjList(index) {
		var pid = this.pjdata.billDetailInfo[index].cInfoId;
		$.openWindow({
			id: 'userpjpicture.html',
			url: 'userpjpicture.html',
			extras: {
				pid: pid,
				userId: userObj.userId
			}
		})
	}

	/**
	 * 
	 */
	$.plusReady(function() {
		setTimeout(function() {
			$('#refreshContainer').pullRefresh().pullupLoading();
		}, 60);
	});

})(mui, document, window);