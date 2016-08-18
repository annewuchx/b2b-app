(function($, doc, win) {

	//
	var price_data = []; //数据
	var price_data1 = []; //数据
	var price_vm = {}; //vue
	var raiseType = "0"; //融资类型
	/**
	 * @description 所在地区 从智能到批量
	 */
	var cityId = "";
	var znBj = "";

	/**
	 * @description ----------regionEvent事件 从智能报价页面过来 传入地区和地区id
	 */
	window.addEventListener("regionEvent", function(event) {

		if(event.detail.locationInnerText) {
			price_vm.location = event.detail.locationInnerText;
			cityId = event.detail.cityId;
			//读取localStorage的数据
			znBj = JSON.parse(localStorage.getItem("priceindex_price_history"));

			if(znBj) {
				price_data.push(znBj);
				raiseType = price_data[0].financingType;
				//lis
				var rz = gel("rzmscontainer");
				var lis = rz.getElementsByTagName("li");

				for(var i = 0, l = lis.length; i < l; i++) {
					lis[i].classList.remove("active");
				}

//				console.log(raiseType)
				if(raiseType == "1") {
					lis[1].classList.add("active");
				} else if(raiseType == "2") {
					lis[2].classList.add("active");
				} else if(raiseType == "3"){
					lis[3].classList.add("active");
				}else {
					lis[0].classList.add("active");
				}

			}

		}

	});

	//
	//
	mui.ready(function() {

		//手指滑动 时改变头部background-color
		//		window.addEventListener("scroll", function() {
		//			var top = document.body.scrollTop;
		//			if(top > 44) {
		//				document.querySelector(".mui-bar").classList.add("moveColor");
		//			} else {
		//				document.querySelector(".mui-bar").classList.remove("moveColor");
		//
		//			}
		//		});

		//vue实例
		price_vm = new Vue({
			el: "#piliang-price",
			data: {
				pricelist: price_data,
				pricelist1: price_data1,
				raiseType1: "", //融资模式
				aShow: true, //控制报价数据显示
				bShow: false,
				location: "",
				locaDisplay: true, //所在地区样式控制
				locaActive: false,
			},
			methods: {
				updateNotes: updateNotes,
				handle_delNotes: handle_delNotes,
				addNotes: addNotes,
				changeRZMS: function(event, data) {
					this.raiseType1 = data;
					raiseType = this.raiseType1;
					document.querySelector('#rzmscontainer > li.active').classList.remove('active');
					event.currentTarget.classList.add('active');
					if(price_vm.pricelist.length == 0) {
						return;
					}
					
//					mui.showLoading();


					//融资模式
					mui.each(this.pricelist, function(i, o) {
						var parameters = {
							areaId: cityId,
							raiseType: raiseType,
							bankType: o.bankType,
							billEndDate: o.billEndDate,
							billAmount: o.billAmount
						};
						//api
						win.servicebus.batchQuotation(parameters, handle_rzSuccess, handle_error);

						/**
						 * @description -----调整融资模式去请求数据
						 */
						function handle_rzSuccess(d) {
							if(d.returnCode == "100000" && d != null && d.bodyData != null) {
//								mui.hideLoading();
								var data1 = JSON.parse(d.bodyData).data;
								data1.bankType = o.bankType;
								data1.billEndDate = o.billEndDate;
								data1.billAmount = o.billAmount;
								price_vm.pricelist.$set(i, data1);
								
								if(i == price_vm.pricelist.length-1){
									numAnimation();
								}
							} else {
								mui.toast(d.returnMsg);
								return;
							}
						}

						function handle_error() {
//							mui.hideLoading();
							return;
						}

					});
					
				}
			
			
			},
			computed: {
				/**
				 * 融资总金额
				 */
				rjtotalInteger: function() {
					var _total = 0;
					for(var i = 0, l = this.pricelist.length; i < l; i++) {
						_total = _total + parseFloat(this.pricelist[i].disscountMoney);
					}
					_total = _total + "";
					var arr = _total.split(".");
					return arr[0];
				},
				rjtotalDecimals: function() {
					var _total = 0;
					for(var i = 0, l = this.pricelist.length; i < l; i++) {
						_total = _total + parseFloat(this.pricelist[i].disscountMoney);
					}
					_total = _total.toFixed(2)
					_total = _total + "";
					var arr = _total.split(".");
					if(arr.length == 1) {
						arr[1] = "00";
					}
					return arr[1];
				},

				/**
				 * 票面总金额
				 */
				pjtotal: function() {
					var _total = 0;
					for(var i = 0, l = this.pricelist.length; i < l; i++) {
						_total = _total + parseFloat(this.pricelist[i].billAmount);
					}
					return _total;
				},
				pjtotalInteger: function() {
					var _total = 0;
					for(var i = 0, l = this.pricelist.length; i < l; i++) {
						_total = _total + parseFloat(this.pricelist[i].billAmount);
					}
					_total = _total + "";
					var arr = _total.split(".");
					return arr[0];
				},
				pjtotalDecimals: function() {
					var _total = 0;
					for(var i = 0, l = this.pricelist.length; i < l; i++) {
						_total = _total + parseFloat(this.pricelist[i].billAmount);
					}
					_total = _total.toFixed(2);
					if(_total == 0) {
						_total = "0.00";
					} else {
						_total += "";
					}
					var arr = _total.split(".");
					if(arr.length == 1) {
						arr[1] = "00";
					}
					return arr[1];
				},

				/**
				 * 票据张数
				 */
				pjtotalnum: function() {
					var _num = this.pricelist.length;
					return _num;
				},
				/**
				 *报价样式显示控制 
				 */
				showNone: function() {
					if(this.pricelist.length) {
						this.aShow = false;
						this.bShow = true;
					} else {
						this.aShow = true;
						this.bShow = false;
					}
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

		//单张票据 实时报价金额 过滤器
		Vue.filter('disscountMoneyInteger', function(num) {
			if(num == 0) {
				num = "0.00";
			} else {

				num += "";
			}
			var arr = num.split(".");
			return arr[0];
		});
		Vue.filter('disscountMoneyDecimals', function(num) {
			if(num == 0) {
				num = "0.00";
			} else {
				num += "";
			}
			var arr = num.split(".");
			var str = arr.length == 1 ? "00" : arr[1];

			var newStr = str.length >= 2 ? str.substr(0, 2) : str + '0';

			return newStr;
		});

		/**
		 * 数字动画
		 */

		function numAnimation() {
			//动画
			var rjtotalInteger = new CountUp("rjtotalInteger", 0, price_vm.rjtotalInteger, 0, 0.8);
			rjtotalInteger.start();

			var pjtotalInteger = new CountUp("pjtotalInteger", 0, price_vm.pjtotalInteger, 0, 0.8);
			pjtotalInteger.start();

			var pjtotalnum = new CountUp("pjtotalnum", 0, price_vm.pjtotalnum, 0, 0.8);
			pjtotalnum.start();
		}

		/*
		 * 注册回调事件- 添加或编辑票据页面返回 
		 */
		window.addEventListener('pjnewEvent', function(event) {
			var result = event.detail;
			//api测试 
			var parameters = {
				areaId: cityId,
				raiseType: raiseType,
				bankType: result.bankType,
				billEndDate: result.enddate,
				billAmount: result.parValue
			};
			win.servicebus.batchQuotation(parameters, handleSuccess, handleError);

			/**
			 * @description 添加修改票据 成功请求数据
			 * @param {Object} data
			 */
			function handleSuccess(data) {
				if(data.returnCode == "100000" && data != null && data.bodyData != null) {
					mui.toast(data.returnMsg);
					var data1 = JSON.parse(data.bodyData).data;
					data1.bankType = result.bankType;
					data1.billEndDate = result.enddate;
					data1.billAmount = result.parValue;

					//					
					if(result.pjid != null && result.pjid != "" || result.pjid == 0) {
//						console.error('edit');
						//编辑
						price_vm.pricelist.$set(result.pjid, data1);
						//
						numAnimation();
					} else {
						//添加
//						console.error('add');
						var newPricelist = price_vm.pricelist.push(data1);
						price_vm.$set("price_vm.pricelist", newPricelist);

						//动画
						numAnimation();

					}
				} else {
					mui.toast(data.returnMsg);
				}
			}

			function handleError() {
				mui.hideLoading();
			}
		});

		/*
		 * @descriptin 删除票据
		 */
		function handle_delNotes(index) {
			var self = this;
			btnArray = ['否', '是'];
			mui.confirm('确认删除票据？', '删除', btnArray, function(e) {
				if(e.index == 1) {
					self.pricelist.splice(index, 1);
					numAnimation();
				} else {}
			})
		}

		/*
		 * @修改票据
		 */
		function updateNotes(index) {
			var self = this;
			var pj = [];
			pj.push(self.pricelist[index]);
			var pj1 = JSON.stringify(pj);
			var updatepj = "pricebatch_updatepj";
			localStorage.setItem(updatepj, pj1); //获取当前点击的数据，写入localstorage
			var pjid = index;
			handle_showDetail(pjid);
		}

		/*
		 * @添加票据
		 */
		function addNotes() {
			var area = document.querySelector(".location").value; //地区
			//去添加票据页面
			if(area == "") {
				mui.toast("请选择所在地区，融资模式");
			} else {
				handle_showDetail(null);
			}
		}

		/*
		 * @description 触发目标页面的事件
		 */
		function handle_showDetail(index) {
			var webview = plus.webview.getWebviewById('addnotes.html');
			if(webview == null) {
				webview = plus.webview.create('addnotes.html', 'addnotes.html');
				webview.onloaded = function() {
					mui.fire(webview, 'infoQuote', {
						pjid: index
					});
					plus.webview.show(webview, "pop-in");
				};
			} else {
				mui.fire(webview, 'infoQuote', {
					pjid: index
				});
				plus.webview.show(webview, "pop-in");
			}
		}

		/**
		 * @description --------所在地区
		 */
		seajs.config({
			base: "../"
		});

		document.querySelector('.location').addEventListener('tap', city, false);

		function city() {
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

					var historyText = vProvince.text + " " + vCity.text;
					if(historyText == "undefined undefined") {
						historyText = "";
					}
					
					price_vm.location = historyText;
					cityId = vCity.value;
					mui.each(price_vm.pricelist, function(i, o) {

//						mui.showLoading();
						//api
						win.servicebus.batchQuotation({
							areaId: cityId,
							raiseType: raiseType,
							bankType: o.bankType,
							billEndDate: o.billEndDate,
							billAmount: o.billAmount
						}, handle_rzSuccess, handle_rzError);
						/*
						 * @description -----调整融资模式去请求数据
						 */
						function handle_rzSuccess(d) {
//							mui.hideLoading();
							if(d.returnCode == "100000" && d != null && d.bodyData != null) {
								var data1 = JSON.parse(d.bodyData).data;
								data1.bankType = o.bankType;
								data1.billEndDate = o.billEndDate;
								data1.billAmount = o.billAmount;
								price_vm.pricelist.$set(i, data1);
							} else {
								mui.toast(d.returnMsg);
							}
						}

						function handle_rzError(e) {
//							mui.hideLoading();
							return;
						}
					});
					numAnimation();
				});

			});
		}

	});
	/**
	 * 从批量报价页面回去智能报价页面
	 */
	var old_back = mui.back;　
	$.plusReady(function() {　　
		mui.back = function() {
			old_back();
			localStorage.removeItem("priceindex_price_history");
			price_vm.location = "";
		}　
	});

	/**
	 * @description 联系我们 
	 */
	function handle_link() {
		var $islogin = window.app.checkLogin();
		var userInfo = win.app.getState();
		var authFlag = "";
		if(userInfo) {
			authFlag = userInfo.authFlag;
		}
		if($islogin && (authFlag == "0")) {
			document.getElementById("link").innerHTML = "承信预约";
		} else {
			document.getElementById("link").innerHTML = "联系我们";
		}
		mui("body").on("tap", "#link", function() {
			var money = price_vm.pjtotal;
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
					id: 'contactus'
				});
			}
		});
	}

	function handle_plusReady() {
		handle_link();
	}
	mui.plusReady(handle_plusReady);

})(mui, document, window);