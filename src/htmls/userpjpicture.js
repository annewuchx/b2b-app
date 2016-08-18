/**
 *  单个票据资产
 * @param {Object} $
 * @param {Object} win
 * @param {Object} doc
 */

(function($, win, doc) {
	/**
	 * 图片手指放大缩小初始化
	 */
	$.init({
		gestureConfig: {
			pinch: true,
			doubletap: true
		}
	});

	$.plusReady(function() {

		//		var userObj = win.app.getState();
		var pjdata;
		
			$.showLoading();
		
		/**
		 * Vue 实例化
		 */
		var g_vm = new Vue({
			el: "#pjpicure-detail",
			data: pjdata
		});

		/**
		 * 监听列表页传过来的id
		 */

		var cw = plus.webview.currentWebview();
		var obj = {
			userId: cw.userId,
			pid: cw.pid
		};

		window.servicebus.accountBillDetail(obj, function(data) {
			if(data.returnCode != "100000") {
				$.alert(data.returnMsg, '银承库', function() {});
			} else {
				if(data.bodyData == '' || JSON.parse(data.bodyData).billDetail == '' || JSON.parse(data.bodyData).billDetail == null || data.bodyData == null) {
					$.alert('服务器传输数据错误', '银承库');
					return;
				}
				pdata = JSON.parse(data.bodyData).billDetail;
				for(var i = 0; i < pdata.length; i++) {
					var dd = pdata[i].endDate;
					if(dd != '') {
						pdata[i].endDate = dd.substring(0, 4) + '/' + dd.substring(5, 7) + '/' + dd.substring(8);
					}

				}

				g_vm.$set('pjdata', pdata);
				/*
				 * 照片  zoom-in  zoom-out
				 */
				setTimeout(function() {
					$(".mui-zoom-wrapper").zoom();
				}, 60);
			}
			$.hideLoading();

		}, function() {
			$.hideLoading();
			$.alert('连接服务器失败，请确保网络正确连接', '银承库');
		});


	});
})(mui, window, document)