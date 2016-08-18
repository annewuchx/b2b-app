(function($, doc) {
	$.init();
	$.plusReady(function() {
		var mainPage = $.preload({
			"id": 'main',
			"url": 'main.html'
		});
		var toMain = function() {
			$.fire(mainPage, 'show', null);
			setTimeout(function() {
				$.openWindow({
					id: 'main',
					show: {
						aniShow: 'pop-in'
					},
					waiting: {
						autoShow: false
					}
				});
			}, 0);
		};
		var settings = app.getSettings();
		var forgetButton = doc.getElementById("forget");
		var locker = doc.querySelector('.mui-locker');
		var clearStateAndToLogin = function() {
			settings.gestures = '';
			settings.autoLogin = false;
			app.setSettings(settings);
			var state = app.getState();
			state.token = '';
			app.setState(state);
			$.openWindow({
				url: 'login.html',
				id: 'login',
				show: {
					aniShow: 'pop-in'
				},
				waiting: {
					autoShow: false
				}
			});
		};
		forgetButton.addEventListener('tap', function(event) {
			clearStateAndToLogin();
		});
		var tryNumber = 5;
		locker.addEventListener('done', function(event) {
			var rs = event.detail;
			if (settings.gestures == rs.points.join('')) {
				toMain()
				rs.sender.clear();
			} else {
				tryNumber--;
				rs.sender.clear();
				if (tryNumber > 0) {
					plus.nativeUI.toast('解锁手势错误，还能尝试 ' + tryNumber + ' 次。');
				} else {
					clearStateAndToLogin();
				}
			}
		}, false);
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if (backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	});
}(mui, document));