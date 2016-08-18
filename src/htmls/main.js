(function($, doc, win) {
	//
	//
	var main = null,
		urls = win.resources.urls;

	mui.init({
		swipeBack: false,
		gestureConfig: {
			doubletap: true
		},
		subpages: [{
			url: urls.mainindex.url,
			id: urls.mainindex.url,
			styles: {
				bottom: "50px",
				top: "0px"
			}
		}]
	});

	//
	//	mui.ready(function() {
	//
	////		window.addEventListener('RefreshPage', function(event) {
	////			//console.log("主页面main.js刷新", JSON.stringify(event.detail));
	////		});
	//
	//	});

	//首页返回键处理
	//处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		if(!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if(new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	};
	//
	//mui.plusReady(function() {
	//		// close splash
	//		setTimeout(function() {
	//			//关闭 splash
	//			plus.navigator.closeSplashscreen();
	//		}, 600);
	//});
	//
	//

})(mui, document, window);