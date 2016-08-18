(function($, win, doc) {

	var province_vm;
	var city_vm;
	var localStorage = window.localStorage;
	var LocalStorageKEY_CITY = "citySite";
	var LocalStorageKEY_CITY_Version = "citySiteVersion";
	var provinceData = [];
	/**
	 * 
	 */
	$.init({
		swipeBack: false,
		beforeback: function() {}
	});
	/**
	 *  mui ready
	 */
	$.ready(function() {

		gel('pro-content').style.height = (document.body.clientHeight - 44) + 'px';
		gel('pronviceControlContents').style.height = (document.body.clientHeight - 44) + 'px';
		fn_getPrivinceData(); //获取数据
				$('#provinceControls').on('tap', 'a', function() {
			var self = this;
			var provinceDataId = self.getAttribute('provinceDataId');
			var provinceId = provinceDatas[parseInt(provinceDataId)].a;
			var cityData = provinceDatas[parseInt(provinceDataId)];
			province_vm.$set('provinceId',provinceId );
			province_vm.$set('cityData',cityData );
		});
	});

	/**
	 *  plus ready
	 */
	$.plusReady(function() {

		fn_passValue(); //向verified2传值

	})

	/**
	 * 2种方式获取省市数据
	 */
	function fn_getPrivinceData() { //获取省市数据  本地   or 服务器拉取

		//		setTimeout(function() {

		//		fn_getDataFromLocal(); //localStorage 获取

		fn_getProvinceData(); //服务器拉取

		//		}, 600);

	}

	/**
	 * 时间差缓存－每1小时访问服务器一次
	 */
	function fn_getDataFromLocal() {

		var localStorageData = localStorage.getItem(LocalStorageKEY_CITY_Version);

		if(localStorageData != null) {
			var jsonTemp = JSON.parse(localStorageData);
			if(((new Date()).getTime() - jsonTemp.t) < 1 * 60 * 60 * 1000) {

				var localStorageData = localStorage.getItem(LocalStorageKEY_CITY);
				if(localStorageData) {

					var jsonTemp = JSON.parse(localStorageData);
					fn_fillPrinceData(jsonTemp);
					return;
				}
			}
		}
	}

/**
	 * vue填充数据
	 * @param {Object} data
	 */
	function fn_fillPrinceData(data) {
		provinceDatas = data;
		province_vm = new Vue({
			el: '#provinceListContainer',
			data: {
				provinceData: data,
				cityData: data[0],
				provinceId: data[0].a
			}
		});
		$.hideLoading();

		//		$(".mui-loader")[0].style.display = "none";
	}
	/*
	 * 服务器获取省市数据
	 * */
	function fn_getProvinceData() {
		win.servicebus.commonProvinces(fn_getProvinceAndCityData);
	}
	/**
	 * 处理省市数据
	 * @param {Object} data
	 */
	function fn_getProvinceAndCityData(data) {
		var provinceCity = [];

		var strBodayData = data.bodyData;
		var provinceData = JSON.parse(strBodayData);

		for(var i = 0, l = provinceData.length; i < l; i++) {

			var province = {
				a: provinceData[i]["id"],
				b: provinceData[i]["areaName"],
				c: []
			};

			var arrCities = provinceData[i]["provinces"];

			for(var j = 0, lj = arrCities.length; j < lj; j++) {
				province.c.push({
					a: arrCities[j]["id"],
					b: arrCities[j]["areaName"]
				});
			}

			provinceCity.push(province);
		}
		//将版本号和数据存到localStorage   版本号以时间为value
		setTimeout(function() {
			localStorage.setItem(LocalStorageKEY_CITY_Version, JSON.stringify({
				t: (new Date()).getTime()
			}));
			localStorage.setItem(LocalStorageKEY_CITY, JSON.stringify(provinceCity));
		}, 600);

		fn_fillPrinceData(provinceCity);
	}

	/**
	 * 向verified2传值
	 */
	function fn_passValue() {
		var wv = plus.webview.currentWebview();
		wv.addEventListener('hide', function() {
			$.log('webview hide');
		}, false);

		wv.addEventListener('close', function() {
			$.log('webview close');
		}, false);

		wv.addEventListener('show', function() {

			$.log('webview show');

		}, false);

		var frontwv = plus.webview.currentWebview().opener();

		$('#pronviceControlContents').on('tap', 'a', function() {
			var self = this;
			var pcontrols = document.querySelector('#provinceControls');
			var selectProvince = pcontrols.querySelector('.mui-active');
			var pid = selectProvince.getAttribute('province-id');
			var cid = self.getAttribute('city-id');

			$.fire(frontwv, 'provinceEvent', {
				province: selectProvince.innerText,
				city: self.innerText,
				pid: pid,
				cid: cid
			});

			wv.close();

			frontwv.show();
		});
		
	}

})(mui, window, document)