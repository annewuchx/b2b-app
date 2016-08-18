(function($, doc, win) {

	/**
	 * 
	 */
	var ui = {
		el_link: gel("linkus"),
		//所在地区
		el_location: gel("locationText"),
		//日期选择器
		el_duedate1: gel('due-date1'),
		//承兑行类型动画
		el_banktype1: gel('bank-type1')
	};

	var CONST_Priceindex_Location = "priceindex_location_history";
	var cityId = null; //所在城市Id
	var money = ""; //承信预约 - 传参－折扣金额

	renderHistroy();

	/*
	 * 获取历史查询记录
	 */
	function renderHistroy() {
		var d = localStorage.getItem(CONST_Priceindex_Location);
		if(d != null) {
			var o = JSON.parse(d);
			if(o != null) {
				cityId = o.cityId;
				//所在地区历史记录
				ui.el_location.value = o.locationText;
			}
		}
	}

	/*
	 * 设置所在地区历史查询记录
	 */
	function set_Priceindex_Location(cityid, text) {
		localStorage.setItem(CONST_Priceindex_Location, JSON.stringify({
			cityId: cityid,
			locationText: text
		}));
	}

	/**
	 * @description 联系我们 & 承信预约 按钮功能
	 */

	function handle_linkus() {
		//用户信息
		var userInfo = win.app.getState();
		var authFlag = "";
		if(userInfo) {
			authFlag = userInfo.authFlag;
		}

		var $islogin = window.app.checkLogin();

		if($islogin && (authFlag == "0")) {
			ui.el_link.innerHTML = "承信预约";
		} else {
			ui.el_link.innerHTML = "联系我们";
		}

		ui.el_link.addEventListener('tap', function() {
			if(money == "") {
				money = 0;
			}
			if($islogin && (authFlag == "0")) {
				//				var wv = plus.webview.getWebviewById('reserveamount.html');
				//				if (wv) {
				//					handle_showDetail(wv, money);
				//				} else {
				//					wv = plus.webview.create('reserveamount.html', 'reserveamount.html');
				//					wv.onloaded = function() {
				//						handle_showDetail(wv, money);
				//					};
				//				}
				//				mui.openWindow({
				//					url: 'reserveamount.html',
				//					id: 'reserveamount.html'
				//				});
				//
				//				function handle_showDetail(webview, money) {
				//					mui.fire(webview, 'billAmountAdd', {
				//						money: money
				//					});
				//					webview.show();
				//				}

				mui.openWindow({
					url: 'reserveamount_introduce.html',
					id: 'reserveamount_introduce.html',
					show: {
						anishow: "pop-in"
					}
				});
			} else {
				mui.openWindow({
					url: 'contactus.html',
					id: 'contactus.html'
				});
			}
		});
	}

	/**
	 * @description 所在地区
	 */

	mui.ready(function() {

		//模块
		seajs.config({
			base: "../"
		});

		//		//手指滑动 时改变头部background-color
		//		window.addEventListener("scroll", function() {
		//			var top = document.body.scrollTop;
		//			if(top > 44) {
		//				document.querySelector(".mui-bar").classList.add("moveColor");
		//			} else {
		//				document.querySelector(".mui-bar").classList.remove("moveColor");
		//
		//			}
		//		});

		//所在地区
		gel("locationContainer").addEventListener('tap', handle_city, false);

		function handle_city() {

			document.activeElement.blur();

			seajs.use('./controllers/province-city-flexible/main', function(cityModel) {

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

					if(items != null && items.length > 1) {

						var historyText = vProvince.text + " " + vCity.text;

						if(historyText == "undefined undefined") {
							historyText = "";
						}
						
						cityId = vCity.value;

						znPrice_vm.location = historyText;

						set_Priceindex_Location(cityId, historyText);

					}

				});

			});
		}

		ui.el_duedate1.addEventListener('tap', pickDate);

		ui.el_banktype1.addEventListener('tap', function() {
			mui.openWindow({
				url: 'bankType.html',
				id: 'bankType.html',
				show: {
					aniShow: 'slide-in-bottom'
				}
			});
		});

		//票面金额
		handle_payValue();
	});

	/**
	 * @description 票面金额 判断
	 */
	var pjValue = ""; //票面金额

	function handle_payValue() {

		var parValue = gel("par-value");

		parValue.addEventListener("input", function() {

			pjValue = znPrice_vm.parValue;

			znPrice_vm.parValue = this.value.replace(/[^\d\.]/g, '');

			var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{0,2})?$/;

			//
			if(pjValue.length > 11) {

				znPrice_vm.parValue = pjValue.slice(0, 11);
				pjValue = znPrice_vm.parValue;

			}

			this.value = znPrice_vm.parValue;

			if(!reg.test(pjValue) && pjValue.length) {
				mui.toast("金额需为一亿以内，金额小数位最多2位");
				return;
			}

		});

		parValue.addEventListener("keyup", function() {

			this.value = this.value.replace(/[^\d\.]/g, '');
			znPrice_vm.parValue = this.value;
		});
	}
	/**
	 * @description 票面金额 格式化
	 */
	function AngelMoney(s) {
		if(s == "") {
			s = "0";
		}

		if(/[^0-9\.]/.test(s)) return;

		var arrV = parseFloat(s).toFixed(2).split('.');
		//小数点
		var d1 = "." + arrV[1];

		s = s.replace(/^(\d*)$/, "$1.");
		s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
		s = s.replace(".", ",");

		var re = /(\d)(\d{3},)/;

		while(re.test(s)) {
			s = s.replace(re, "$1,$2");
		}

		s = s.replace(/,(\d\d)$/, ".$1");
		s = s.replace(/.(\d\d)$/, "");

		var strFormat = s + d1;
		return strFormat;
	}

	/**
	 * @description 承兑行类型
	 */
	var type = "";
	window.addEventListener("bankEvent", function(event) {
		var bankType = document.querySelector(".bank-type");
		znPrice_vm.bankType = event.detail.bankType;
		type = event.detail.type;
	});

	/*
	 * @description --------日期选择器
	 */
	var date = new Date();
	//	console.log(date.getFullYear());
	var options = {
		"type": "date",
		"beginYear": date.getFullYear(),
		"endYear": date.getFullYear() + 1
	};
	var picker = new $.DtPicker(options);

	function pickDate() {

		document.activeElement.blur();

		picker.show(function(rs) {

			var localDate = new Date();
			localDate1 = FormatDate(localDate);
			localNew = new Date(localDate1).getTime();

			chooseDate = new Date(rs.value).getTime();
			timeDif = chooseDate - localNew;

			days = Math.floor(timeDif / (24 * 3600 * 1000));
			if(days > 200 || days <= 0) {
				znPrice_vm.endDate = "";
				mui.toast("到期日不正确，请重新输入！", 3000);
				return;
			}

			znPrice_vm.endDate = rs.text;
		});
	}
	/**
	 * 日期格式化
	 * @param {Object} strTime
	 */
	function FormatDate(strTime) {
		var date = strTime;
		var month = 0;
		var day = 0;
		if(strTime.getMonth() < 9) {
			month = "0" + (strTime.getMonth() + 1);
		} else {
			month = strTime.getMonth() + 1;
		}
		if(strTime.getDate() < 9) {
			day = "0" + strTime.getDate();
		} else {
			day = strTime.getDate();
		}
		return strTime.getFullYear() + "-" + month + "-" + day;
	}

	/**
	 * @description 计算报价 - parameters
	 */
	var price_data = []; //总的
	var price_data1 = []; //单个
	var znPrice_vm = null; //vue实例
	var rzms = "0"; //融资模式

	//vue实例
	znPrice_vm = new Vue({
		el: ".mui-content",
		data: {
			price_data: price_data,
			price_data1: price_data1,
			bj: true,
			location: ui.el_location.value, //所在地区
			parValue: "", //票面金额
			bankType: "", //承兑行类型
			endDate: "", //到期日
			locaDisplay: true, //所在地区样式控制
			locaActive: false,
			moneyDisplay: true, //票面金额样式控制
			moneyActive: false,
			bankDisplay: true, //承兑行类型样式控制
			bankActive: false,
			endDateDisplay: true, //到期日样式控制
			endDateActive: false
		},
		methods: {
			changeRZMS: changeRZMS,
			handle_quote: handle_quote,
		},
		computed: {
			/**
			 * 控制 计算报价 按钮 状态
			 */
			btnStatus: function() {
				var val = this.location && this.parValue && this.bankType && this.endDate;
				return !val;
			},
			disscountMoneyInteger: function() {
				var arr = this.price_data1.disscountMoney.split(".");
				return arr[0];
			},
			disscountMoneyDecimals: function() {
				var arr = this.price_data1.disscountMoney.split(".");
				return arr[1];
			},
			interestInteger: function() {
				var arr = this.price_data1.interest.split(".");
				return arr[0];
			},
			interestDecimals: function() {
				var arr = this.price_data1.interest.split(".");
				return arr[1];
			},
			/**
			 * 所在地区样式
			 */
			el_location: function() {
				if(this.location) {
					this.locaDisplay = false;
					this.locaActive = true;
				} else {
					this.locaDisplay = true;
					this.locaActive = false;
				}
			},
			/**
			 * 票面金额样式
			 */
			//			el_money: function() {
			//				if(this.parValue) {
			//					this.moneyDisplay = false;
			//					this.moneyActive = true;
			//				} else {
			//					this.moneyDisplay = true;
			//					this.moneyActive = false;
			//				}
			//			},
			/**
			 * 承兑行样式
			 */
			el_bank: function() {
				if(this.bankType) {
					this.bankDisplay = false;
					this.bankActive = true;
				} else {
					this.bankDisplay = true;
					this.bankActive = false;
				}
			},
			/**
			 * 到期日样式
			 */
			el_date: function() {
				if(this.endDate) {
					this.endDateDisplay = false;
					this.endDateActive = true;
				} else {
					this.endDateDisplay = true;
					this.endDateActive = false;
				}
			}
		}
	});

	//自定义过滤器
	Vue.filter('rmb', function(num) {
		var num = (num || 0).toString(),
			result = '';
		while(num.length > 3) {
			result = ',' + num.slice(-3) + result;
			num = num.slice(0, num.length - 3);
		}
		if(num) {
			result = num + result;
		}
		return result;
	});

	/**
	 * 计算报价 按钮事件
	 */
	function handle_quote() {


		if(cityId == null || type == "" || znPrice_vm.endDate == "" || pjValue == null) {
			mui.hideLoading();
			$.toast('请选择您要查询的数据条件！');
			return;
		}
		var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{0,2})?$/;
		var boo = reg.test(znPrice_vm.parValue);
		if(!boo) {
			mui.hideLoading();
			$.toast("票面金额有误");
			return;
		}
		var parameters = {
			areaId: cityId,
			bankType: type,
			billEndDate: znPrice_vm.endDate,
			billAmount: pjValue
		};

		//api测试
		win.servicebus.smartQuotation(parameters, handleSuccess, handleError);

	}

	/**
	 * 报价数据-返回成功回调
	 * @param {Object} data
	 */
	function handleSuccess(data) {


		//显示 隐藏

		if(data.returnCode == "100000" && data != null && data.bodyData != null) {
			mui.toast(data.returnMsg);
			var a_none = document.querySelectorAll(".aNone");
			var b_show = document.querySelectorAll(".bShow");

			for(var i = 0, l = a_none.length; i < l; i++) {
				a_none[i].classList.remove("aShow");
			}

			for(var i = 0, l = b_show.length; i < l; i++) {
				b_show[i].style.display = "none";
			}

			//获得服务器响应
			var bodyData = JSON.parse(data.bodyData);

			price_data = bodyData.disscountMoneys;

			for(var i = 0, l = price_data.length; i < l; i++) {
				if(price_data[i].financingType == rzms) {
					price_data1 = price_data[i];
					break;
				}
			}

			//融资模式
			money = price_data1.disscountMoney;

			price_data1.areaId = bodyData.areaId;
			price_data1.bankType = bodyData.bankType;
			price_data1.billAmount = bodyData.billAmount;
			price_data1.billEndDate = bodyData.billEndDate;

			localStorage.setItem("priceindex_price_history", JSON.stringify(price_data1));

			znPrice_vm.price_data1 = price_data1;
			
			znPrice_vm.price_data = price_data;
			
			numAnimation();

		} else {
			mui.toast(data.returnMsg);
		}

	}

	/**
	 * 报价数据-返回错误回调
	 */
	function handleError(error) {
		mui.hideLoading();
	}

	/**
	 * 
	 * @param {Object} event
	 * @param {Object} data
	 * @description 融资模式 0 1 2 3
	 */
	function changeRZMS(event, data) {

		document.querySelector('#rzmscontainer > li.active').classList.remove('active');
		
		event.currentTarget.classList.add('active');
		
		if(!znPrice_vm.price_data.length){
			return;
		}
		rzms = data;
		
		
		
		for(var i = 0, l = znPrice_vm.price_data.length; i < l; i++) {
			if(znPrice_vm.price_data[i].financingType == rzms) {
				price_data1 = znPrice_vm.price_data[i];
				break;
			}
		}
		//融资模式
		znPrice_vm.price_data1 = price_data1;
		numAnimation();
	}

	/**
	 * @description 批量报价
	 */
	function handle_batch() {

		var el_batch = gel('batch');

		el_batch.addEventListener('tap', function() {

			var locationInnerText = ui.el_location.value;

			var wv = plus.webview.getWebviewById('pricebatch.html');

			if(wv) {
				mui.fire(wv, "regionEvent", {
					locationInnerText: locationInnerText,
					cityId: cityId
				});

			} else {
				wv = plus.webview.create('pricebatch.html', 'pricebatch.html');
				wv.onloaded = function() {
					mui.fire(wv, "regionEvent", {
						locationInnerText: locationInnerText,
						cityId: cityId
					});
				};
			}

			mui.openWindow({
				url: 'pricebatch.html',
				id: 'pricebatch.html',
				show: {
					aniShow: 'pop-in',
					duration: 400
				}
			});
			clearData();
		});
	}

	/*
	 * 
	 */
	function handle_plusReady() {

		handle_batch();

		handle_linkus();
	}

	mui.plusReady(handle_plusReady);

	/**
	 * 清楚智能报价 -- 数据
	 */
	function clearData() {
		znPrice_vm.parValue = "";
		znPrice_vm.bankType = "";
		znPrice_vm.endDate = "";
		//显示 隐藏
		var a_none = document.querySelectorAll(".aNone");
		var b_show = document.querySelectorAll(".bShow");

		for(var i = 0, l = a_none.length; i < l; i++) {
			a_none[i].classList.add("aShow");
		}

		for(var i = 0, l = b_show.length; i < l; i++) {
			b_show[i].style.display = "block";
		}
	}

	function numAnimation(){
		//动画
		var dayDuring = new CountUp("dayDuring", 0, znPrice_vm.price_data1.dayDuring, 0, 0.8);
		dayDuring.start();

		var interestInteger = new CountUp("interestInteger", 0, znPrice_vm.interestInteger, 0, 0.8);
		interestInteger.start();
		//			
		//			
		var disscountMoneyInteger = new CountUp("disscountMoneyInteger", 0, znPrice_vm.disscountMoneyInteger, 0, 0.8);
		disscountMoneyInteger.start();
	}
}(mui, document, window));