/**
 * 门店查询
 * @param {Object} $
 * @param {Object} win
 * @param {Object} doc
 */
(function($, win, doc) {

	var storeList = [];
	var ortherList = [];
	var VM = {};

	/**
	 * 
	 */
	$.init();

	/**
	 * 
	 */
	$.ready(function() {

		VM = new Vue({
			el: '#address',
			data: {
				addressList: storeList,
				farBranchList: ortherList
			}
		});

		$.hideLoading();

		gel('ul_city').addEventListener('tap', function(event) {
			//			$.openWindow({
			//				url: 'businesslocation.html',
			//				id: "businesslocation.html",
			//				extras: {}
			//			});
			seajs.use('./controllers/province-city/main', function(cityModel) {

				cityModel.init(1);
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

					document.getElementById("ul_city").innerHTML = vProvince.text + " " + vCity.text;

					getStoesearchData({
						provinceId: vProvince.value,
						areaId: vCity.value
					});
				});

			});

		});
	});
	$.plusReady(function() {
		plus.geolocation.getCurrentPosition(translatePoint, function(e) {
			if(e.code == 10) {
				$.toast("请开启GPS");
			}
			gel("gps1").innerHTML = "无法定位当前城市,点击进行<a>GPS</a>定位";
		});

		$("#address").on('tap', '.list', function(event) {

			var html = event.target;

			var id = html.getAttribute("mId");

			var liText = html.innerText;

			var thisWv = plus.webview.currentWebview();

			var frontwv = thisWv.opener();

			$.fire(frontwv, 'firmAddress', {
				province: liText,
				id: id
			});

			plus.webview.close("businesslocation.html");
			plus.webview.close(thisWv);
		});

	});

	function translatePoint(position) {
		if(position == null) {
			return;
		}

		if(position.coords != null) {
			var currentLon = position.coords.longitude;
			var currentLat = position.coords.latitude;

			getStoesearchDataMap({
				"longitude": 121.476259,
				"latitude": 31.194652
			});
		}
		if(position.address != null) {
			gel("gps1").innerHTML = position.address.province + "&nbsp;" + position.address.city;
		} else {
			gel("gps1").innerHTML = "无法定位地址";
		}

	}

	function getStoesearchData(pos) {

		$.showLoading();

		win.servicebus.queryStore(pos, function(data) {
			var msg = data.bodyData;

			storeList.splice(0, storeList.length);
			ortherList.splice(0, storeList.length);

			gel("msg").innerHTML = "";
			if(data.returnCode != "100000") {
				gel("msg").innerHTML = msg;
			} else {
				//				storeList.splice(0,storeList.length);
				var list = JSON.parse(msg).storeList;
				storeList.push.apply(storeList, list);
			}
			ortherList = [];
			VM.$set('farBranchList', ortherList);
			setTimeout(function() {
				$.hideLoading();
			}, 300);

		}, function(e) {
			$.hideLoading();
		});

	}

	function getStoesearchDataMap(pos) {

		$.showLoading();
		win.servicebus.queryChooseStore(pos, function(data) {

			var msg = data.bodyData;

			storeList.splice(0, storeList.length);

			gel("msg").innerHTML = "";
			if(data.returnCode != "100000") {
				gel("msg").innerHTML = msg;
			} else {
				//				storeList.splice(0,storeList.length);
				var list = JSON.parse(msg).storeList;
				var list1 = JSON.parse(msg).ortherList;
				storeList.push.apply(storeList, list);
				var list2 = billGroup(list1);
				ortherList.push.apply(ortherList, list2);
			}

			$.hideLoading();

		}, function(e) {
			$.hideLoading();
		});

	}

	function billGroup(arr) {
		var map = {},
			dest = [];
		for(var i = 0; i < arr.length; i++) {
			var ai = arr[i];
			if(!map[ai.provinceName]) {
				dest.push({
					provinceName: ai.provinceName,
					datalist: [ai],
				});
				map[ai.provinceName] = ai;
			} else {
				for(var j = 0; j < dest.length; j++) {
					var dj = dest[j];
					if(dj.provinceName == ai.provinceName) {
						dj.datalist.push(ai);
						break;
					}
				}
			}
		}
		//		dest = translateDataFromServer1(dest);
		return dest;
	}

}(mui, window, document));