/**
 * 全国城市数据
 */
define(function(require, exports, module) {

	var self = exports;

	var doc = document,
		win = window,
		$ = mui;

	require('../css/mui.picker.min.css');
	require('../mui/mui.picker.min.js');

	//	var tpl = require('./city.html');
	//	var fragment = document.createDocumentFragment();
	//	fragment.innerHTML = tpl;
	//	document.body.appendChild(fragment);
	
	//级联示例
	var cityPicker = new $.PopPicker({
		layer: 2
	});

	/**
	 *	根据服务器返回数据－转换json格式 
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

	//引用省份城市数据
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