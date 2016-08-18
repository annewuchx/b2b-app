/**
 * 首页 
 */
define(function(require, exports, module) {

	var self = exports;

	var $ = mui,
		doc = document;

	/*
	 * mui init
	 */
	$.init();
	/*
	 * 刷新所有打开页面事件
	 */
	window.addEventListener("RefreshAllOpenPage", function(e) {
		$.RefreshPage();
	});

	/*
	 * 
	 */
	$.plusReady(function() {
		require.async('./mainindex.banner', function(model) {
			if(model != null) {
				model.init();
			}
		});
		//连续按下两次返回键退出应用
		$.oldBack = $.back;
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				backButtonPress = 0;
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 2000);
			return false;
		};

	});

	//	$.plusReady(function() {
	//
	//		/**
	//		 * 每隔15秒，检查一下网络连接情况 
	//		 */
	////		function checkNetworkState() {
	////			var currentNetwork = plus.networkinfo.getCurrentType();
	////			if(currentNetwork != plus.networkinfo.CONNECTION_NONE) {
	////				$('.networkuseless')[0].style.display = "none";
	////			} else {
	////				$('.networkuseless')[0].style.display = "block";
	////			}
	////
	////		}
	//
	////		setTimeout(function() {
	////			checkNetworkState();
	////			setInterval(function() {
	////				checkNetworkState();
	////			}, 1000 * 15);
	////		}, 60);
	//
	//	});

	$.ready(function() {

		/**
		 * 
		 */
		window.addEventListener("RefreshPage", function(e) {
			//to do list
			handle_GetUnReadMessage();
		});

		//

		handle_GetUnReadMessage();

		//承信预约事件
		gel('btnreserveamount').addEventListener('tap', handle_btnreserveamount);

		//
		require.async('./mainindex.charting', function(model) {
			if(model != null) {
				model.init('day');
			}
		});

		//

	});

	/**
	 * 获取未读取信息数
	 */
	function handle_GetUnReadMessage() {

		var user = window.app.getState();

		if(user != null && typeof(user.userId) != 'undefined') {

			$.ajax_query("message/num", {
				data: {
					userId: user.userId
				},
				success: function(data) {
					if(data.returnCode == "100000") {
						if(data.bodyData != null) {
							var num = JSON.parse(data.bodyData).num;
							if(num != null && num > 0) {
								gel("emailMsg").style.display = "block";
							}else{
								gel("emailMsg").style.display = "none";
							}
						} else {
							mui.toast('服务器异常');
						}

					}
				}
			});
		}else{
			gel("emailMsg").style.display = "none";
		}
	}
	
	/**
	 * 承信预约事件
	 */
	function handle_btnreserveamount() {

		$.openWindow({
			url: 'reserveamount_introduce.html',
			id: 'reserveamount_introduce.html',
			show: {
				autoShow: true,
				duration: 200,
				aniShow: "pop-in"
			},
			waiting: {
				autoShow: false
			}
		});
//		//		mui.toast("此功能暂未开放");
		return;

		var reserveamounturl = 'reserveamount.html';

		var originId = 'reserveamount.html';

		var user = window.app.getState();

		if(user == null || typeof(user.userId) == 'undefined') {

			localStorage.removeItem(window.resources.keys.state);

			reserveamounturl = 'login.html';

		} else {

			if(user.authFlag != '0') {

				reserveamounturl = 'verifiedstep1.html';
				originId = null;
			}
		}

		$.openWindow({
			url: reserveamounturl,
			id: reserveamounturl,
			show: {
				autoShow: true,
				duration: 200,
				aniShow: "pop-in"
			},
			waiting: {
				autoShow: true
			},
			extras: {
				webviewId: originId
			}
		});
	}

});