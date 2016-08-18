/*
 * 
 */
(function($, doc, win) {
	//
	var urls = win.resources.urls;
	//
	var aniShow = {};
	//
	var subpages = [urls.mainindex.url, urls.userindex.url];
	var tempsubWebview = null;
	//	urls.financeindex.url,
	//
	var subpage_style = {
		top: '0px',
		bottom: '50px',
		render: 'always'
	};
	var subpage_mainStyle = {
		top: '0px',
		bottom: '50px',
		hardwareAccelerated: true,
		render: 'always'
	};

	//
	$.init({
		swipeBack: false,
		hardwareAccelerated: false,
		keyEventBind: {
			backbutton: true, //Boolean(默认truee)关闭back按键监听
			menubutton: false //Boolean(默认true)关闭menu按键监听
		},
		preloadPages: [
			//		{
			//			id: urls.financingindex.url,
			//			url: urls.financingindex.url
			//		}
			//		, {
			//			id: "pjzs.html",
			//			url: "pjzs.html"
			//		},{
			//			id: "priceindex.html",
			//			url: "priceindex.html"
			//		}
		]
	});

	/*
	 * 
	 */
	$.ready(function() {

		/*
		 * 刷新所有打开页面事件
		 */
		window.addEventListener("RefreshAllOpenPage", function(e) {
			$.RefreshPage();
		});

		//自定义事件，模拟点击“首页选项卡”
		window.addEventListener('gohome', function() {

			var defaultTab = gel("defaultTab");
			//模拟首页点击
			$.trigger(defaultTab, 'tap');

			setTimeout(function() {
				//切换选项卡高亮
				var current = document.querySelector(".mui-bar-tab").querySelector(".mui-tab-item.mui-active");
				//var current = document.querySelector(".mui-bar-tab>footer-bottom-border>.mui-tab-item.mui-active");
				if(defaultTab !== current) {
					if(current != null) {
						current.classList.remove('mui-active');
					}
					defaultTab.classList.add('mui-active');
				}
			}, 60);

		});
	});

	//创建子页面，首个选项卡页面显示，其它均隐藏；
	$.plusReady(function() {
		//checkLoginStatus
		//用户登录信息
		var userinfo = win.app.getState();
		if(userinfo != null && typeof userinfo.userId != 'undefined') {
			win.servicebus.refreshLogin(null, function(data) {
				if(data.returnCode == "err992000") {
					win.app.setState(null);
				}
			}, function(xhr, type, errorThrown) {
				win.app.setState(null);
			});
		}

		//读取本地存储，检查是否为首次启动
		var showGuide = plus.storage.getItem("lauchFlag");

		if(showGuide) {
			//有值，说明已经显示过了，无需显示；

			//WebviewObject plus.webview.open( url, id, styles, aniShow, duration, showedCB );

			//			plus.webview.open('mainindexloading.html', 'mainindexloading.html', {}, 'none', 600, function() {
			//				gel('navigationmenu').style.display = 'block';
			//			});

			//			//显示启动导航
			//			$.openWindow({
			//				id: 'mainindexloading.html',
			//				url: 'mainindexloading.html',
			//				show: {
			//					aniShow: 'none'
			//				},
			//				waiting: {
			//					autoShow: false
			//				}
			//			});

			//延迟的原因：优先打开启动导航页面，避免资源争夺
			setTimeout(function() {

				//预加载
				//
				preload_subpages();
				//
				//
				handle_registerEvents();

			}, 200);
		} else {

			//延迟的原因：优先打开启动导航页面，避免资源争夺
			setTimeout(function() {

				//预加载
				//
				preload_subpages();
				//
				//
				handle_registerEvents();

			}, 200);

		}

		/*
		 * 
		 */
		function handle_registerEvents() {
			//
			//当前激活选项
			var activeTab = subpages[0];

			/*
			 * 关闭企业理财webview
			 */
			function closeTempSubview() {
				if(tempsubWebview != null) {
					tempsubWebview.hide();
					tempsubWebview.close('none', 0);
				}
			}

			/*
			 * 恢复底部导航当前状态
			 */
			function restoreStatus() {

				var defaultTab = gel("defaultTab");

				setTimeout(function() {

					$('.mui-tab-item.mui-active')[0].classList.remove("mui-active");

					defaultTab.classList.add('mui-active');

					activeTab = defaultTab.getAttribute('href');

					plus.webview.show(activeTab);

				}, 60);
			}

			//首页
			gel("defaultTab").addEventListener("tap", function() {

				var targetTab = this.getAttribute('href');

				if(activeTab != targetTab) {
					plus.webview.show(targetTab);
					//隐藏当前;
					plus.webview.hide(activeTab);
					activeTab = targetTab;
				}

				closeTempSubview();

			}, false);

			//企业理财
			gel("financeindexTab").addEventListener('tap', function() {

				var nWaiting = plus.nativeUI.showWaiting(win.resources.langs.loading);

				var targetTab = this.getAttribute('href');

				tempsubWebview = appendChildSubPages(targetTab);

				//tempsubWebview.addEventListener("titleUpdate", function() {}, false);
				//loaded事件发生后，触发预加载和pagebeforeshow事件
				tempsubWebview.addEventListener("loaded", function() {
					if(nWaiting) {
						nWaiting.close();
					}
					tempsubWebview.show("pop-in");
				}, false);

				if(activeTab != targetTab) {
					plus.webview.show(targetTab);
					//隐藏当前;
					plus.webview.hide(activeTab);
					activeTab = targetTab;
				}

				setTimeout(function() {
					//假如发生异常信息，3秒后强制关闭loading
					if(nWaiting) {
						nWaiting.close();
					}
				}, 1);

			}, false);

			/**
			 * @description 注册票据融资事件
			 */
			gel('financeTab').addEventListener('tap', function() {

				if(plus.webview.getWebviewById(urls.financingindex.url) != null) {
					$.RefreshPage("financingindex.html");
				}

				$.openWindow(urls.financingindex.url, urls.financingindex.url, {
					show: {
						aniShow: "pop-in"
					}
				});

			}, false);

			//我的帐户
			gel('userindexTab').addEventListener('tap', function() {

				$.RefreshPage("userindex_sub.html");

				var targetTab = this.getAttribute('href');

				var hasLogined = window.app.checkLogin();

				if(!hasLogined) {

					$.timeOutToLogin(targetTab, function() {
						closeTempSubview();
						restoreStatus();
					});

					return;
				}

				if(activeTab != targetTab) {
					plus.webview.show(targetTab);
					//隐藏当前;
					plus.webview.hide(activeTab);
					activeTab = targetTab;
				}
				//restoreStatus();

				closeTempSubview();

			}, false);

		}

		setTimeout(function() {
			//关闭splash页面；
			plus.navigator.closeSplashscreen();
			plus.navigator.setFullscreen(false);
		}, 1500);

	});

	//
	function preload_subpages() {

		var self = plus.webview.currentWebview();

		for(var i = 0; i < 4; i++) {

			var temp = {};

			if(plus.webview.getWebviewById(subpages[i]) == null) {

				var sub;

				if(subpages[i] == urls.mainindex.url) {
					sub = plus.webview.create(subpages[i], subpages[i], subpage_mainStyle);

				} else {
					sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				}

				if(i > 0) {
					sub.hide();
				} else {
					temp[subpages[i]] = "true";
					$.extend(aniShow, temp);
				}

				self.append(sub);

			}
		}
	}

	/**
	 * 附加子页面到主页面
	 * @param {Object} id
	 */
	function appendChildSubPages(id) {
		var sub = plus.webview.getWebviewById(id);
		if(sub == null) {
			var self = plus.webview.currentWebview();
			sub = plus.webview.create(id, id, subpage_style);
			sub.hide();
			self.append(sub);
		}
		return sub;
	}

})(mui, document, window);