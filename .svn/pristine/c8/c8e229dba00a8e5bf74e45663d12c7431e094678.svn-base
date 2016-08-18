/**
 * 
 * @param {Object} $
 * @param {Object} window
 * @param {Object} document
 */
(function($, window, document) {
	//
	var location = []; //总的门店
	var historyLocation = []; //历史门店选择记录
	var CONST_HistoryList_KEY = "businesslocation_historyList";

	//
	var loca_vm = new Vue({
		el: "#list",
		data: {
			location: location,
			historyLocation: ""
		},
		methods: {
			locationArea: locationArea, //总的门店
			locationArea1: locationArea1, //历史选择
			locationArea2: locationArea2 //gps定位
		}
	});

	Vue.filter("city", function(his) {
		var hisArr = his.split(" ");
		return hisArr[1];
	});
	Vue.filter("province", function(his) {
		var hisArr = his.split(" ");
		return hisArr[0];
	});

	var strDataHistoryLocation = localStorage.getItem(CONST_HistoryList_KEY);
	if(strDataHistoryLocation != null && strDataHistoryLocation.length > 0) {
		var arr = JSON.parse(strDataHistoryLocation);
		for(var i = 0, l = arr.length; i < l; i++) {
			historyLocation.push({
				history: arr[i].history,
				id: arr[i].id
			});
		}
		loca_vm.$set("historyLocation", historyLocation);
	}

	$.ready(function() {

		//api测试
		window.servicebus.queryArea({}, handle_success);

		function handle_success(data) {
			if(data != null && data.bodyData != null && data.returnCode == "100000") {
				var location = JSON.parse(data.bodyData).storeList;
				loca_vm.$set("location", location)
			}
		}
		//本地
		//		mui.ajax('../services/location.json', {
		//			type: "get",
		//			dataType: "json",
		//			success: function(data) {
		//				if(data != null && data.bodyData != null && data.returnCode == "100000") {
		//					var location = JSON.parse(data.bodyData).storeList;
		//					loca_vm.$set("location", location)
		//				}
		//			}
		//		});

	});

	var id = "", //门店Id
		latitude = "", //维度
		longitude = ""; //经度

	/**
	 * 点击对应城市 触发provinceEvent事件
	 * @param {Object} event
	 */
	function locationArea(event) {

		var self = event.currentTarget;
		var selfwv = plus.webview.currentWebview();
		var frontwv = selfwv.opener();
		var text = self.children[0].innerHTML + " " + self.children[1].innerHTML; //选择地点

		id = self.children[2].innerHTML;

		//记录本地
		//localStorage.setItem("businesslocation_history", text);

		if(historyLocation.length < 3) {
			historyLocation.push({
				history: text,
				id: id
			});
		} else {
			historyLocation.shift();
			historyLocation.push({
				history: text,
				id: id
			});
		}

		//存
		localStorage.setItem(CONST_HistoryList_KEY, JSON.stringify(historyLocation));

		loca_vm.$set("historyLocation", historyLocation);

		$.fire(frontwv, 'provinceEvent', {
			id: id,
			provinceName: text,
			latitude: "",
			longitude: ""
		});

		$.openWindow(frontwv);

		setTimeout(function() {
			selfwv.close();
		}, 20);

	}

	/**
	 * 点击历史记录城市 触发provinceEvent事件
	 * @param {Object} event
	 */
	function locationArea1(event) {
		var self = event.currentTarget;
		var selfwv = plus.webview.currentWebview();
		var frontwv = selfwv.opener();

		var text = self.children[0].innerText + " " + self.children[1].innerText; //选择地点
		id = self.children[2].innerText;
		//记录本地
		//localStorage.setItem("businesslocation_history", text);

		$.fire(frontwv, 'provinceEvent', {
			id: id,
			provinceName: text,
			latitude: "",
			longitude: ""
		});
		$.openWindow(frontwv);
		setTimeout(function() {
			selfwv.close();
		}, 20);
	}

	/**
	 * 点击gps城市 触发provinceEvent事件
	 * @param {Object} event
	 */
	function locationArea2(event) {

		var self = event.currentTarget;
		var selfwv = plus.webview.currentWebview();
		var frontwv = selfwv.opener();

		var text = self.innerText; //选择地点

		$.fire(frontwv, 'provinceEvent', {
			id: "",
			provinceName: text,
			latitude: latitude,
			longitude: longitude
		});

		$.openWindow(frontwv);

		setTimeout(function() {
			selfwv.close();
		}, 20);
	}

	/**
	 * 定位
	 */

	$.plusReady(function() {
		
		plus.geolocation.getCurrentPosition(translatePoint, function(e) {
			gel('locationDes').style.display = 'none';
			gel('locationDes2').style.display = 'block';
		}, {
			timeout: '5000'
		});

		/**
		 * gps设置
		 * @param {Object} data
		 */
		gel('gpsLocate').addEventListener('tap', function() {

			if($.os.android) {

				var btnValue = ['暂不', '去设置'];
				$.confirm('请在系统中开启定位服务', '定位服务未开启', btnValue, function(e) {
					if(e.index == 1) {
						launchApp();
					}
				});

			} else {
				$.alert("请在系统中开启定位服务", "温馨提示");
			}
		}, false);

	});
	/**
	 * 
	 * @param {Object} position
	 */
	function translatePoint(position) {
		if(position != null && position.coords != null && position.address != null) {
			gel('locationDes').innerText = position.address.province + ' ' + position.address.city;
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
		}
	}

	/**
	 * 调用第三方程序
	 */
	function launchApp() {
		//打开GPS设置
		if(plus.os.name == "Android") {

			var main = plus.android.runtimeMainActivity();
			var Intent = plus.android.importClass("android.content.Intent");
			var mIntent = new Intent('android.settings.LOCATION_SOURCE_SETTINGS');
			main.startActivity(mIntent);

		} else if(plus.os.name == "iOS") {

			var UIApplication = plus.ios.import("UIApplication");
			var NSURL = plus.ios.import("NSURL");
			var setting = NSURL.URLWithString("prefs:root=LOCATION_SERVICES");
			var application = UIApplication.sharedApplication();
			application.openURL(setting);
			//plus.ios.deleteObject(setting);
			//plus.ios.deleteObject(application);

		}
	}
})(mui, window, document);