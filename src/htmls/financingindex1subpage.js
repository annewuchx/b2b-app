/**
 * @description 融资订单 - 有票子页面
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */
(function($, doc, win) {

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
	//
	Vue.filter('financeInteger', function(num) {
		if(num == 0) {
			num = "0.00";
		} else {

			num += "";
		}
		var arr = num.split(".");
		return arr[0];
	});
	//
	Vue.filter('financeDecimals', function(num) {
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

	//融资模式
	var raiseType = "0";

	/*
	 * 
	 */
	$.init({
		pullRefresh: {
			container: '#refreshContainer',
			down: {
				callback: function() {

					handle_ListRender();

					$('#refreshContainer').pullRefresh().endPulldownToRefresh();
				}
			}
		}
	});
	
	$.ready(function() {
		//
		window.addEventListener("RefreshPage", function() {
			LoadData();
		});

	});

	$.plusReady(function() {
		LoadData();
	});

	function initDefaultData() {
		localStorage.setItem("financingbasket_raiseType", raiseType);
	}

	function LoadData() {
		//
		initDefaultData();
		//
		handle_ListRender();
	}

	//vue实例
	var vm_finance = new Vue({
		el: 'body',
		data: {
			//全选
			allselected: false,
			//票据资产列表
			items: [],
			//融资模式
			raiseType: raiseType
		},
		methods: {
			/**
			 * 查看票据图片事件
			 */
			openPjList: fn_openPjList,
			/**
			 * 分组票据多选事件
			 * @param {Object} event
			 */
			checkitemGroup: function(event) {

				var that = event.target;
				var ischecked = that.checked;

				//是否承信预约票据
				var indexGroupID = that.getAttribute("data-groupid");

				for(var i = 0; i < this.items[indexGroupID].billDetail.length; i++) {
					this.items[indexGroupID].billDetail[i].isChecked = ischecked;
				}

				//update select all status
				if(!ischecked) {
					this.allselected = false;

				} else {

					var isSelected = true;
					for(var i = 0, l = this.items.length; i < l; i++) {
						if(!this.items[i].isChecked) {
							isSelected = false;
							break;
						}
					}
					this.allselected = isSelected;
				}

				//				console.error("checkitemGroup")
				//				console.log("this.allselected=" + this.allselected);
				//				console.log("ischecked = " + ischecked);

			},
			/**
			 * 单张票据多选事件
			 * @param {Object} event
			 */
			checkitem: function(event) {

				var that = event.target;

				var val = that.checked;

				//是否承信预约票据
				var isBook = that.getAttribute("data-isbook");
				var indexGroupID = that.getAttribute("data-groupid");

				if(isBook == "true") {
					//
					this.items[indexGroupID].isChecked = val;
					for(var i = 0; i < this.items[indexGroupID].billDetail.length; i++) {
						this.items[indexGroupID].billDetail[i].isChecked = val;
					}

				} else {

					this.items[indexGroupID].isChecked = val;

					if(val) {

						for(var i = 0; i < this.items[indexGroupID].billDetail.length; i++) {

							if(!this.items[indexGroupID].billDetail[i].isChecked) {
								this.items[indexGroupID].isChecked = false;
								break;
							}
						}

					}

				}

				//update select all status
				if(!val) {
					this.allselected = false;

				} else {

					var isSelected = true;

					for(var i = 0, l = this.items.length; i < l; i++) {
						if(!this.items[i].isChecked) {
							isSelected = false;
							break;
						}
					}

					this.allselected = isSelected;
				}

				//				console.error("checkitem");
				//				console.log("this.allselected=" + this.allselected);
				//				console.log("that.checked=" + that.checked);

			},

			/**
			 * 点击立即融资按钮
			 */
			handle_ImmediaFinace: handle_ImmediaFinace,
			/**
			 * 点击-切换融资模式
			 * @param {Object} event
			 * @param {Object} data
			 */
			changeRZMS: function(event, data) {

				raiseType = data;

				this.raiseType = raiseType;

				localStorage.setItem("financingbasket_raiseType", raiseType);

				document.querySelector(".rz-mode").innerHTML = event.currentTarget.firstChild.innerHTML;

				var rzMode = document.querySelectorAll(".rz-mode1");

				for(var i = 0; i < rzMode.length; i++) {
					rzMode[i].innerHTML = event.currentTarget.firstChild.innerHTML;
				}

				document.querySelector('#rzmscontainer > li.active').classList.remove('active');

				event.currentTarget.classList.add('active');
			},
			/**
			 * 融资模式   --- 实时融资金额计算
			 */
			rzms: function() {
				var total = 0;
				//融资模式
				var priceType = "mdPrice";
				if(this.raiseType == "2") {
					priceType = "t1Price";
				} else if(this.raiseType == "3") {
					priceType = "t2Price";
				} else if(this.raiseType == "1"){
					priceType = "t0Price";
				}

				for(var i = 0, l = this.items.length; i < l; i++) {
					for(var j = 0, len = this.items[i].billDetail.length; j < len; j++) {
						if(this.items[i].billDetail[j].isChecked) {
							total += (parseFloat(this.items[i].billDetail[j][priceType]) - parseFloat(this.items[i].billDetail[j].adjustment) - parseFloat(this.items[i].billDetail[j].flaw));
						}
					}
				}

				total = total.toFixed(2);
				if(total == 0 || total < 0) {
					total = "0.00";
				} else {
					total += "";
				}
				return total;

			}
		},
		computed: {
			/**
			 * 票面金额
			 */
			pmtotal: function() {
				var total = 0;
				//要判断页面中有多少张票的isChecked值是true
				for(var i = 0, l = this.items.length; i < l; i++) {
					for(var j = 0, len = this.items[i].billDetail.length; j < len; j++) {
						if(this.items[i].billDetail[j].isChecked) {
							total += parseFloat(this.items[i].billDetail[j].billMoney);
						}
					}
				}
				return total;
			},
			/**
			 * 实时融资金额
			 */
			rjtotalInteger: function() {
				var total = this.rzms();

				var arr = total.split(".");
				return arr[0];
			},
			rjtotalDecimals: function() {
				var total = this.rzms();

				var arr = total.split(".");

				if(arr.length == 1) {
					arr[1] = "00";
				}
				return arr[1];
			},
			/**
			 * 
			 */
			pjtotalnum: function() {
				var total = 0;
				for(var i = 0, l = this.items.length; i < l; i++) {
					for(var j = 0, len = this.items[i].billDetail.length; j < len; j++) {
						if(this.items[i].billDetail[j].isChecked) {
							total += 1;
						}
					}
				}
				return total;
			},
			/**
			 * 
			 */
			yhMoney: function() {
				var total = 0;
				for(var i = 0, l = this.items.length; i < l; i++) {
					if(this.items[i].isChecked) {
						total += parseFloat(this.items[i].mdDiscountTotalAmount);
					}
				}
				return total;
			},
			/**
			 * 全选  
			 */
			checkallitems: {
				get: function() {
					return this.allselected;
				},
				set: function(newValue) {
					//全选
					if(newValue == true) {
						for(var i = 0, l = this.items.length; i < l; i++) {
							this.items[i].isChecked = true;
							for(var j = 0, len = this.items[i].billDetail.length; j < len; j++) {
								this.items[i].billDetail[j].isChecked = true;
							}
						}
					} else {
						for(var i = 0, l = this.items.length; i < l; i++) {
							this.items[i].isChecked = false;
							for(var j = 0, len = this.items[i].billDetail.length; j < len; j++) {
								this.items[i].billDetail[j].isChecked = false;
							}
						}
					}

					this.allselected = newValue;

					//					console.error("checkallitems set");
					//					console.log(this.allselected);

				}
			},
		}
	});

	/*
	 * 更新主页显示哪个子页面
	 */
	function refresh_PageIndex(islist) {

		var wv_Index = plus.webview.getWebviewById('financingindex.html');
		mui.fire(wv_Index, 'Page_ShowEvent', {
			islist: islist
		});
	}

	/*
	 * 画页面
	 */
	function handle_ListRender() {

		mui.showLoading();

		var userInfo = win.app.getState();
		var isLogin = win.app.checkLogin();
		//
		//
		if(isLogin) {

			var userId = userInfo.userId;

			win.servicebus.pjFinancing({
				userId: userId,
			}, handle_success, function() {

				refresh_PageIndex(false);

				mui.hideLoading();
			});

			//			
			/**
			 * 成功的回调
			 * @param {Object} data
			 */
			function handle_success(data) {

				vm_finance.allselected = false;

				renderList(data);

				mui.hideLoading();
			}

			//本地数据 servies
			//			mui.ajax('../services/ssrzPrice.json', {
			//				data: {
			//					userId: userId,
			//				},
			//				type:"get",
			//				dataType:"json",
			//				timeout: 30 * 1000,
			//				cache: false,
			//				crossDomain: true,
			//				success: handle_success
			//			});
			
			
			
		} else {

			refresh_PageIndex(false);

			mui.hideLoading();
		}

	}

	/**
	 * 
	 * @param {Object} data
	 */
	function renderList(data) {

		vm_finance.items = "";
		var list = [];
		var arrBookList = []; //承信
		var arrUnBookingObj = { //非承信
			"bespeakNo": "",
			"billCount": 0,
			"isbook": false, //是否显示承信预约头部  
			"billDetail": [],
			"mdDiscountTotalAmount": 0,
			"t0DiscountTotalAmount": 0,
			"t1DiscountTotalAmount": 0,
			"t2DiscountTotalAmount": 0,
		};

		if(data != null && typeof data !== "undefined" && data.bodyData != null) {
			var bodyData = JSON.parse(data.bodyData);
			list = bodyData.billList;
		}

		//更新主页显示子页面
		if(list != null && list.length > 0) {
			refresh_PageIndex(true);
		} else {
			refresh_PageIndex(false);
			return;
		}

		for(var i = 0, len = list.length; i < len; i++) {

			if(list[i].bespeakNo == "") {
				//非承信预约
				if(list[i].billDetail != null && list[i].billDetail.length > 0) {
					var templist = list[i].billDetail;
					arrUnBookingObj.billDetail = arrUnBookingObj.billDetail.concat(templist);
				}
			} else {
				list[i].isbook = true;
				arrBookList.push(list[i]);
			}
		}

		//非承信预约的票数
		var unBookingLen = arrUnBookingObj.billDetail.length;
		if(unBookingLen) {
			arrBookList.push(arrUnBookingObj);
		}

		var totalList = arrBookList;

		//set all item's checkbox selected as default value;
		for(var i = 0, l = totalList.length; i < l; i++) {

			totalList[i].isChecked = false;

			var group = totalList[i]; //每一个订单

			for(var j = 0, l1 = group.billDetail.length; j < l1; j++) {

				var tempbill = group.billDetail[j]; //每个订单中的每张票

				tempbill["isChecked"] = false;

				if(group["bespeakNo"] == "") {
					tempbill["isbook"] = "false";
				} else {
					tempbill["isbook"] = "true";
				}
			}
		}
		//
		vm_finance.$set("items", totalList);
	}

	/**
	 * @description 立即融资
	 */
	function handle_ImmediaFinace() {
		//选中的票据的cInfoId
		var selected_banknotes = "";
		var arrSelectedBankNotes = [];

		for(var i = 0, l = this.items.length; i < l; i++) {
			for(var j = 0, len = this.items[i].billDetail.length; j < len; j++) {
				if(this.items[i].billDetail[j].isChecked) {
					arrSelectedBankNotes.push(this.items[i].billDetail[j].cInfoId);
				}
			}
		}

		selected_banknotes = arrSelectedBankNotes.join(',')

		localStorage.setItem("financingbasket_ids", selected_banknotes);

		if(arrSelectedBankNotes.length === 0) {
			document.querySelector(".immediate-financing").removeAttribute("disabled");
			mui.toast("您未选择任何票据，请选择后再融资", 1000);
			return;
		}

		//确认融资票据接口api
		var userInfo = win.app.getState();
		if(userInfo) {
			document.querySelector(".immediate-financing").innerHTML = "处理中...";
			var userId = userInfo.userId;

			//确认融资票据接口api
			win.servicebus.confirmBill({
				userId: userId,
				ids: selected_banknotes,
				raiseType: raiseType,
			}, handle_success, function() {
				document.querySelector(".immediate-financing").innerHTML = "立即融资";
			});

			/**
			 * 成功回调
			 * @param {Object} data
			 */
			function handle_success(data) {

				if(data != null && typeof data !== "undefined" && data.bodyData != null) {

					var basket_data = JSON.stringify(data);

					localStorage.setItem("finacingnindex_2_financingbask", basket_data);

					mui.openWindow({
						url: 'financingbasket.html',
						id: 'financingbasket.html'
					});

				} else {
					mui.toast(data.returnMsg);
				}
				document.querySelector(".immediate-financing").innerHTML = "立即融资";
			}
		}

	}

	/**
	 * 
	 * @param {Object} index
	 * @description 票据图片
	 */
	function fn_openPjList(index) {

		var userInfo = win.app.getState();

		var userId = "";
		if(userInfo) {
			userId = userInfo.userId;
		}

		var ind = event.currentTarget.getAttribute("data-index");
		var mid = this.items[ind].billDetail[index].cInfoId;

		$.openWindow({
			id: 'userpjpicture.html',
			url: 'userpjpicture.html',
			extras: {
				pid: mid,
				userId: userId
			}
		});
	}

	function handle_showDetail(webview, mid) {
		mui.fire(webview, 'refreshPage', {
			pid: mid
		});
		webview.show();
	}

})(mui, document, window);