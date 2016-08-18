/**
 * 门店查询
 */
/**
 * 
 */
mui.init();

var storeList = [];
var currentLon = null;
var currentLat = null;
var statusShort = "0";
var storeSearchVue = null;
/*
 * 
 */
mui.ready(function() {

	//mui.hideLoading();

	storeSearchVue = new Vue({
		el: '#storeList',
		data: {
			addressList: storeList,
			flagShort: statusShort
		},
		methods: {
			copyAdress: function(event) {
				// 方法内 `this` 指向 vm
				// `event` 是原生 DOM 事件
				var address = event.target.innerHTML;
				if(plus.os.name == 'Android') {
					var Context = plus.android.importClass("android.content.Context");
					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
					plus.android.invoke(clip, "setText", address);
				} else {
					var UIPasteboard = plus.ios.importClass("UIPasteboard");
					var generalPasteboard = UIPasteboard.generalPasteboard();
					// 设置/获取文本内容:
					generalPasteboard.setValueforPasteboardType(address, "public.utf8-plain-text");
					//var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
				}
				mui.toast("已复制门店地址");
			}
		}
	});

	//点击选择省份
	gel('xzsf').addEventListener('tap', function(event) {
		seajs.use('./controllers/province-city/main', function(cityModel) {

			cityModel.init(2);
			//
			cityModel.show(function(items) {

				/*
				 * fix issue of quick scroll begin
				 */
				if(items == null || items.length < 2 || items[0] == {} || items[1] == {}) {
					return;
				}

				var vProvince = items[0];
				var vCity = items[1];
				var arrCityList = vProvince.children;
				var isCity = false;

				if(arrCityList == null || arrCityList.length < 1) {
					return;
				}

				for(var i = 0, l = arrCityList.length; i < l; i++) {
					if(vCity.value == arrCityList[i].value) {
						isCity = true;
						break;
					}
				}

				if(!isCity) {
					vCity = arrCityList[0];
				}
				/*
				 * end
				 */

				gel("ul_city").value = vProvince.text + " " + vCity.text;

				if(currentLon != null && currentLat != null) {
					statusShort = "1"
					getStoesearchData({
						provinceId: vProvince.value,
						areaId: vCity.value,
						longitude: currentLon,
						latitude: currentLat
					});
				} else {
					statusShort = "0";
					getStoesearchData({
						provinceId: vProvince.value,
						areaId: vCity.value
					});
				}
				storeSearchVue.$set('flagShort', statusShort);
			});

		});
	});

});

/**
 * 
 */
mui.plusReady(function() {
	/*
	 * 
	 */
	plus.geolocation.getCurrentPosition(translatePoint, function(ephone) {

		//mui.hideLoading();

		if(ephone.code == 10) {
			mui.toast("请开启GPS");
		}

		gel("gps1").innerHTML = "无法定位当前城市,点击进行<a id='gpsLocate'>GPS</a>定位";

	}, {
		timeout: '5000'
	});

	/**
	 * gps设置
	 * @param {Object} data
	 */
	var btnValue = ['暂不', '去设置'];
	gel('gpshtml').addEventListener('tap', function() {
		var gpshtml = gel('gps1').innerHTML;
		if(gpshtml.indexOf('GPS') > 0) {
			mui.alert("请在系统中开启定位服务", "温馨提示");
			//			mui.confirm('请在系统中开启定位服务', '定位服务未开启', btnValue, function(e) {
			//				if(e.index == 1) {
			//					launchApp();
			//					
			//				}
			//			})
		} else {
			if(currentLon != null && currentLat != null) {
				statusShort = "0";
				getStoesearchData({
					longitude: currentLon,
					latitude: currentLat
				});
			} else {
				statusShort = "1";
			}
		}
		storeSearchVue.$set('flagShort', statusShort);
	});

});
var btnArray = ['取消', '拨打'];

/**
 * 拨打电话
 * @param {Object} phone
 * @param {Object} name
 */
function call(phone, name) {
	mui.confirm('拨打' + name + '电话' + phone + '?', '银承库', btnArray, function(e) {
		if(e.index == 1) {
			plus.device.dial(phone, false);
		}
	})
}

/*
 * 定位成功调用的方法
 */
function translatePoint(pos) {

	if(pos == null || pos.coords == null) {
		currentLon = null;
		currentLat = null;
		return;
	}

	currentLon = pos.coords.longitude;
	currentLat = pos.coords.latitude;

	if(pos.address != null) {
		gel("gps1").innerHTML = pos.address.province + "&nbsp;" + pos.address.city;
	} else {
		gel("gps1").innerHTML = "坐标已定位，无法获取物理地址";
	}

	getStoesearchData({
		longitude: currentLon,
		latitude: currentLat
	});
}

//ajax请求
function getStoesearchData(paras) {
	gel("msg").innerHTML = "";

	//mui.showLoading();

	window.servicebus.queryStore(paras, function(data) {
		//服务器返回响应，根据响应结果，分析是否登录成功；
		var msg = data.bodyData;
		if(msg != null) {
			storeList.splice(0, storeList.length);
			if(data.returnCode != "100000") {

				gel("msg").innerHTML = msg;

			} else {

				var list = JSON.parse(msg).storeList;

				storeList.push.apply(storeList, list);
			}
		} else {
			mui.toast('服务器异常');
		}

		setTimeout(function() {

			//mui.hideLoading();

		}, 300);
	});
}

// 调用第三方程序
function launchApp() {
	if(plus.os.name == "Android") {
		var main = plus.android.runtimeMainActivity();
		var Intent = plus.android.importClass("android.content.Intent");
		var mIntent = new Intent('android.settings.LOCATION_SOURCE_SETTINGS');
		main.startActivity(mIntent); //打开GPS设置
	} else if(plus.os.name == "iOS") {
		var UIApplication = plus.ios.import("UIApplication");
		var NSURL = plus.ios.import("NSURL");
		var setting = NSURL.URLWithString("prefs:root=LOCATION_SERVICES");
		var application = UIApplication.sharedApplication();
		application.openURL(setting);
		plus.ios.deleteObject(setting);
		plus.ios.deleteObject(application);

	}
}