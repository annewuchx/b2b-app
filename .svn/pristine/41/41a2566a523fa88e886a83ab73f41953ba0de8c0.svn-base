/*
 * 
 */
define(function(require, exports, module) {
	/*
	 * 
	 */
	mui.init({
		keyEventBind: {
			backbutton: true //关闭back按键监听
		}
	});

	var subpages = ['pjzsChart.html', 'pjzsline.html'];
	var remTimes = lib.flexible.dpr;
	//
	var subpage_style = {
		hardwareAccelerated: true,
		background: "transparent", //透明
	};
	var aniShow = {};
	var nWaiting = 1;

	function PreloadPages() {
		//		var charType0 = gel('yui-segmented-charttype').clientTop;
		var charType1 = getYckHeight('yui-segmented-charttype');
		var charType2 = getYckHeight('pzjsHead');
		var charType4 = getYckHeight('pjzsBttom');
		//子页面距离顶部和底部高度
		subpage_style["top"] = (charType1 + charType2) / remTimes + "px";
		subpage_style["bottom"] = (charType4) / remTimes + "px";
		var self = plus.webview.currentWebview();
		for(var i = 0; i < 2; i++) {
			var temp = {};
			if(plus.webview.getWebviewById(subpages[i]) == null) {
				var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				sub.hide();
				if(i > 0) { //系统、活动
					sub.hide();
				} else { //全部
					temp[subpages[i]] = "true";
					mui.extend(aniShow, temp);
				}
				self.append(sub);
			} else {
				//console.info("PreloadPages", plus.webview.getWebviewById(subpages[i]).id);
			}
		}
	}
	/**
	 * 获取高度
	 * @param {Object} elmID
	 */
	function getYckHeight(elmID) {
		if(document.all) { // IE
			elmHeight = gel(elmID).currentStyle.height;
			elmMargin = parseInt(gel(elmID).currentStyle.marginTop, 10) + parseInt(gel(elmID).currentStyle.marginBottom, 10);
		} else { // Mozilla
			elmHeight = document.defaultView.getComputedStyle(gel(elmID), '').getPropertyValue('height');
			elmMargin = parseInt(document.defaultView.getComputedStyle(gel(elmID), '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(gel(elmID), '').getPropertyValue('margin-bottom'));
		}

		return parseInt(elmMargin) + parseInt(elmHeight);
	}
	var modelMap = null,
		modelLine = null,
		modelType = 'pjzsChart.html',
		chartType = 'day',
		vm_model = null;
	var targetTab = 'pjzsChart.html';
	mui.plusReady(function() {
		//		nWaiting = plus.nativeUI.showWaiting(window.resources.langs.loading, {
		//			back: 'close'
		//		});
		PreloadPages();
		var activeTab = subpages[0];
		var wb = plus.webview.getWebviewById('pjzsChart.html');
		var wbl = plus.webview.getWebviewById('pjzsline.html');
		var lastTime = new Date().getTime();
		mui('.yui-segmented-charttype').on('tap', 'a.yck-control-item', function() {
			targetTab = this.getAttribute('href');
			if(targetTab == activeTab) {
				return;
			}
			//			mui.showLoading();
			var hidewebView = activeTab;
			lastTime = new Date().getTime();
			if(targetTab == 'pjzsChart.html') {
				this.nextElementSibling.classList.remove("yck-active");
				this.classList.add("yck-active");

			} else {

				this.previousElementSibling.classList.remove("yck-active");
				this.classList.add("yck-active");

			}
			//更改当前活跃的选项卡
			activeTab = targetTab;
			//隐藏当前;
			plus.webview.hide(hidewebView);
			if(mui.os.ios || aniShow[targetTab]) {
				plus.webview.show(targetTab, "none", 0);
			} else {
				//android
				var temp = {};
				temp[targetTab] = "true";
				mui.extend(aniShow, temp);
				plus.webview.show(targetTab, "none", 0);

			}

			if(targetTab == 'pjzsChart.html') {
				mui.fire(wb, 'renderChartEvent', {
					type: chartType
				});
			} else {
				mui.fire(wbl, 'renderChartLineEvent', {
					type: chartType
				});
			}

		});

		mui('.typeNum').on('tap', 'a.mui-control-item', function() {
			chartType = this.getAttribute('href');
			if(chartType == modelType) {
				return;
			}
			modelType = activeTab;
			if(targetTab == 'pjzsChart.html') {
				mui.fire(wb, 'renderChartEvent', {
					type: chartType
				});
			} else {
				mui.fire(wbl, 'renderChartLineEvent', {
					type: chartType
				});
			}

		});

		document.addEventListener('loadingChart', function(event) {
			var viewTab = event.detail.viewTab;
			var mapNum = event.detail.mapNum;
			var lineNum = event.detail.lineNum;
			if(mapNum == 1) {
				if(mui.os.ios || aniShow['pjzsChart.html']) {
					plus.webview.show('pjzsChart.html', "none", 0);
				} else {
					//android
					var temp = {};
					temp['pjzsChart.html'] = "true";
					mui.extend(aniShow, temp);
					plus.webview.show('pjzsChart.html', "none", 0);

				}
				viewTab = 'pjzsChart.html';
				activeTab = viewTab;
				mui.hideLoading();

			}

		});
	});

	mui.ready(function() {
		mui.showLoading();
		var datamenu = {
			dayIndex: '0',
			subDay: '0',
			weekIndex: '0',
			subWeek: '0',
			monthIndex: '0',
			subMonth: '0'
		};

		vm_model = new Vue({
			el: '#btnmenu',
			data: {
				pjzsmenu: datamenu
			}
		});

		//
		mui('#scroll').scroll({
			indicators: false //是否显示滚动条
		});

		window.servicebus.billIndexIndex({}, function(data) {

			var datamenu = {
				dayIndex: '0',
				subDay: '0',
				weekIndex: '0',
				subWeek: '0',
				monthIndex: '0',
				subMonth: '0'
			};

			if(data.returnCode == 100000) {
				datamenu = JSON.parse(data.bodyData).index[0];
			}

			vm_model.pjzsmenu = datamenu;

		});

		mui('.mui-input-group').on('change', 'input', function() {
			var segmentedControl = gel('segmentedControl');
			if(this.checked) {
				var styleEl = document.querySelector('input[name="style"]:checked');
				var colorEl = document.querySelector('input[name="color"]:checked');
				if(styleEl && colorEl) {
					var style = styleEl.value;
					var color = colorEl.value;
					segmentedControl.className = 'mui-segmented-control' + (style ? (' mui-segmented-control-' + style) : '') + ' mui-segmented-control-' + color;
				}
			}
		});

	})

	/*
	 * 
	 */

});