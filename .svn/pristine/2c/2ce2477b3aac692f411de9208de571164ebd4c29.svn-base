/*
 * 
 */
(function($, doc, win) {
	$.init({
		pullRefresh: {
			container: '#refreshContainer',
			down: {
				callback: function() {
					
					//plus.webview.currentWebview().hide();
					
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					success();
				}
			}
		}
	});
	/**
	 * @description 检测认证状态
	 */
	function handle_isAuthentication() {
		//financing-btn
		mui("body").on("tap", ".financing-btn", function() {
			mui.openWindow({
				url: 'priceindex.html',
				id: 'priceindex.html',
				show: {
					aniShow: "pop-in",
					duration: 400
				}
			});

		});

	}
	/**
	 * 
	 */
	function success() {

		mui.showLoading();

		//		mui.fire(plus.webview.getWebviewById("financingindex.html"), "RefreshPage");
		//		mui.hideLoading();
		//		return;

		$.RefreshPage("financingindex.html", function() {
			mui.hideLoading();
		});
	}

	function handle_plusReady() {
		handle_isAuthentication();
	}

	mui.ready(handle_plusReady);

})(mui, document, window);