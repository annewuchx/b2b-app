/**
 * 全国城市数据
 */
define(function(require, exports, module) {

	var self = exports;

	var doc = document,
		win = window,
		$ = mui;

	require('../../../css/mui.picker.min.css');
	require('../../../mui/mui.picker.min.js');

	//	var tpl = require('./city.html');
	//	var fragment = document.createDocumentFragment();
	//	fragment.innerHTML = tpl;
	//	document.body.appendChild(fragment);

	//级联示例
	var cityPicker = new $.PopPicker({
		layer: 2
	});

	/**
	 *	根据服务器返回数据－转换json格式 （全国城市）
	 * @param {Object} arrCities
	 */
	function translateDataFromServer(arrCities) {

		var arrCities2 = [];

		for (var i = 0, l = arrCities.length; i < l; i++) {

			var province = arrCities[i];

			var cities = [];

			for (var j = 0, x = province.provinces.length; j < x; j++) {
				var city = province.provinces[j];
				cities.push({
					value: city.id,
					text: city.areaName
				});
			}

			arrCities2.push({
				value: province.id,
				text: province.areaName,
				children: cities
			});
		}

		return arrCities2;
	}
	/**
	 * -------------引用全国省份城市数据
	 */
	function loadDatafromType1() {
		win.servicebus.commonProvinces(function(data) {

			var arrCities2 = [];

			if (data != null) {

				try {

					var arrCities = [];
					arrCities = JSON.parse(data.bodyData);
					arrCities2 = translateDataFromServer(arrCities);
					//设置城市－选择器
					cityPicker.setData(arrCities2);

				} catch (e) {
					console.error("city.js" + e.toString());
				}
			}
		});

	}
	/**
	 * ------------引用门店城市数据
	 */
	function loadDatafromType2() {
		win.servicebus.chooseArea({
			cityName: "",
			longitude: "",
			latitude: ""
		}, function(data) {
			var arrCities2 = [];
			if (data != null) {
				try {
					var arrCities = [];

					arrCities = JSON.parse(data.bodyData).storeList;

					arrCities2 = billGroup(arrCities);

					//设置城市－选择器
					cityPicker.setData(arrCities2);

				} catch (e) {
					console.error("city.js" + e.toString());
				}
			}
		});
	}
	/**
	 * --------------根据sourceType load全国/门店城市
	 */
	function loadData() {
		if (sourceType == 2) {
			loadDatafromType2();
		} else {
			loadDatafromType1();
		}
	}

	/**
	 * @description 按key值 分组
	 * @param {Object} arr
	 */
	function billGroup(arr) {
		var map = {},
			dest = [];
		for (var i = 0; i < arr.length; i++) {
			var ai = arr[i];
			if (!map[ai.provinceName]) {
				dest.push({
					provinceName: ai.provinceName,
					provinceId: ai.provinceId,
					datalist: [ai],
				});
				map[ai.provinceName] = ai;
			} else {
				for (var j = 0; j < dest.length; j++) {
					var dj = dest[j];
					if (dj.provinceName == ai.provinceName) {
						dj.datalist.push(ai);
						break;
					}
				}
			}
		}
		dest = translateDataFromServer1(dest);
		return dest;
	}
	/**
	 * 
	 * @param {Object} arrCities----根据门店城市服务器返回数据－转换json格式 
	 */
	function translateDataFromServer1(arrCities) {

		var arrCities2 = [];

		for (var i = 0, l = arrCities.length; i < l; i++) {

			var province = arrCities[i];
			var cities = [];
			for (var j = 0, x = province.datalist.length; j < x; j++) {
				var city = province.datalist[j];
				cities.push({
					value: city.cityId,
					text: city.cityName,
				});
			}

			arrCities2.push({
				text: province.provinceName,
				value: province.provinceId,
				children: cities
			});
		}

		return arrCities2;
	}

	var sourceType = 1; //类型

	/**
	 *  
	 * @param {Object} type 数据来源－1. 全国，2，门店城市
	 */
	self.init = function(type) {

		if (type != null && type == 2) {

			sourceType = 2;

		}

		loadData();

	};

	self.show = function(callback) {

		cityPicker.show(callback);

		//处理物理返回键
		self.__back = mui.back;
		mui.back = function() {
			self.hide();
		};
	};

	self.hide = function() {
		//处理物理返回键
		mui.back = self.__back;
	};
});