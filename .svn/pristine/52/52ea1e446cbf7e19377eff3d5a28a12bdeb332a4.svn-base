/**
 * login.js - login is a page logic file
 * @version v0.0.1
 * @link http://github.com/taoqianbao
 * @license MIT
 * @author PeterZhu
 * @email zhu.shengfeng@yinchengku.com
 */
!(function($, doc, win) {

	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: ajaxGetUserData
			}
		}
	});

	/**
	 * 监听 RefreshPage事件
	 */
	window.addEventListener("RefreshPage", function() {
		ajaxGetUserData();
	});

	var vm = new Vue({
		el: "#pullrefresh",
		data: {
			indexList: ""
		},
		methods: {
			getCall: fn_getCall,
			getMoneyLeft: fn_getMoneyLeft,
			getUserPj: fn_getUserPj,
			getBank: fn_getBank
		}
	})

	/**
	 * vue渲染页面     indexData为默认或缓存中的data
	 */
	function userindexFillData(indexData) {

		vm.$set('indexList', indexData);
	}

	/**
	 *更多页面 
	 */
	gel('getMore').addEventListener('tap', function() {
		$.openWindow({
			id: 'userotherinfo.html',
			url: 'userotherinfo.html'

		});
	})

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
	 * 现金余额跳转
	 */
	function fn_getMoneyLeft() {
		$.openWindow({
			id: 'usermoney.html',
			url: 'usermoney.html',
			extras: {
				webviewId: "userindex.html"
			}
		});
	}
	/**
	 * 确认打电话
	 */
	function fn_getCall() {
		$.confirm('拨打业务经理电话' + gel('yPhone').getAttribute('data-mobile') + '?', '银承库', ['取消', '拨打'], fn_confirmCallback);
	}
	/**
	 * 确认拨打电话
	 * @param {Object} e
	 */
	function fn_confirmCallback(e) {

		if(e.index == 1) { //确认
			plus.device.dial(gel('yPhone').getAttribute('data-mobile'), false);
		}

	}

	/**
	 * 我的账户   成功回调
	 * @param {Object} data
	 */
	function fn_accountOwnercashSuccess(data) {
		if(data.returnCode != "100000") {
			mui.alert(data.returnMsg, '银承库', function() {
				if(data.returnCode == "err995001") {
					$.timeOutToLogin();
				} else {
					$.toMain();
				}

			});
		} else {

			if(data.bodyData == '' || data.bodyData == null) {
				$.alert('服务器传输数据错误', '银承库');
				return;
			}

			localStorage.setItem("userIndex_accountOwnercash", data.bodyData);

			var indexData = JSON.parse(data.bodyData);
			userindexFillData(indexData);

		}
		mui('#pullrefresh').pullRefresh().refresh(true); //可重置上拉加载控件
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //是关闭“正在刷新”的雪花进度提示
	}

	/**
	 * 默认填充数据
	 */
	function fn_defaultFillData() {
		var indexData = {
			"ownerCash": {
				"billTotal": "",
				"cashAcconut": "",
				"code": "",
				"companyName": "",
				"manager": "",
				"message": "",
				"mobile": "",
				"name": "",
				"totalFinance": "0",
				"transFinance": "0",
				"useState": "1", //未认证
				"zxUser": "1" //非中信用户
			}
		};
		userindexFillData(indexData);
	}

	/**
	 * 用户账号 发送请求
	 */
	function ajaxGetUserData() {
		var userinfo = win.app.getState(); //用户登录信息

		if(userinfo == null || typeof userinfo.userId == 'undefined') {
			fn_defaultFillData();
			return;
		}
		if(userinfo.authFlag!="0") {
			win.servicebus.refreshLogin({},
				function(data) {
					if(data != null && data.returnCode != "100000") {
						return;
					}
					if(!data || !data.bodyData) {
						return;
					}
					var rsp = JSON.parse(data.bodyData).responseBody;

					if(rsp.code == 100000) {
						app.clearALLState();
						console.log(JSON.stringify(rsp));
						app.createState(rsp);
					}
				});
		}
		win.servicebus.accountOwnercash({
			userId: userinfo.userId
		}, fn_accountOwnercashSuccess, function() {
			fn_defaultFillData();
			$('#pullrefresh').pullRefresh().refresh(true);
			$('#pullrefresh').pullRefresh().endPulldownToRefresh();
		});
	}
	/**
	 * 跳转银行卡界面
	 */
	function fn_getBank() {
		$.openWindow({
			id: 'userbanklist.html',
			url: 'userbanklist.html',
			extras: {
				webviewId: "userindex.html"
			}
		});
	}

	/**
	 * 跳转票据资产界面
	 */
	function fn_getUserPj() {
		$.openWindow({
			id: 'userpjlist.html',
			url: 'userpjlist.html'
		});
	}

	/**
	 * 跳转 认证页面
	 */
	mui("#rzBnt").on('tap', 'button', function(event) {

		mui.openWindow({
			id: 'verifiedstep1.html',
			url: 'verifiedstep1.html',
			extras: {
				webviewId: "userindex_sub.html"
			}
		});

	});

})(mui, document, window);