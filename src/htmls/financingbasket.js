/**
 * 
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */
(function($, doc, win) {

	var userInfo = win.app.getState();

	var finacingnindex_2_financingbask = localStorage.getItem("finacingnindex_2_financingbask");

	//选中的票据的cInfoId
	var selected_banknotes = localStorage.getItem("financingbasket_ids");
	
	//融资模式 [0,2,3]
	var raiseType = localStorage.getItem("financingbasket_raiseType");
	var userId;
	var bankCardId = ""; // 银行主键
	/*
	 * 监听银行返回事件
	 */
	win.addEventListener('customEvent', function(event) {
		bankCardId = event.detail.bankCardId;
		document.querySelector(".bank-name").innerText = event.detail.bankNameMain;
		var bankNo = event.detail.bankNo;//银行卡号
		document.querySelector(".bank-cardId").innerText = bankNo.substr(bankNo.length-4);
	});

	//--------------------密码输入---------------------------------
	seajs.config({
		base: "../"
	});

	seajs.use('./controllers/trans-pwd/main', function(model) {
		//确认融资
		gel("openSelector").addEventListener("tap", function() {
			model.show(function(val) {
				if(userInfo) {
					mui.showLoading();
					userId = userInfo.userId;
					if(bankCardId == "") {
						mui.hideLoading();
						mui.toast("请选择收款账户");
						return;
					}
					//api
					win.servicebus.confirmFinance({
						userId: userId,
						ids: selected_banknotes,
						raiseType: raiseType,
						payPassword: val,
						billAmount: vm_finance.rjtotal1,
						bankId: bankCardId
					}, handle_success, handle_error);
					//			
					/**
					 * 成功的回调
					 * @param {Object} data
					 */
					function handle_success(data) {
						mui.hideLoading();
						if(data.returnCode == "100000" && data != null && data.bodyData != null) {
							//到票据详情页
							var order = JSON.parse(data.bodyData);
							pjState(order.orderno, order.orderId)

							$.RefreshPage("financingindex.html", function() {
								$.closeWin();
							});

						} else {
							mui.toast(data.returnMsg);
						}
					}

					function handle_error() {
						mui.hideLoading();
					}
				}
			});
		});
	});

	/**
	 * 
	 * @param {Object} state
	 * @description  打开订单详情页 触发事件 传递当前订单的state 
	 */
	function pjState(orderno, id) {
		var webview = plus.webview.getWebviewById('financingordersdetail.html');
		if(webview == null) {
			webview = plus.webview.create('financingordersdetail.html', 'financingordersdetail.html');
			webview.onloaded = function() {
				mui.fire(webview, 'pjStateEvent', {
					orderNo: orderno,
					id: id
				});
				plus.webview.show(webview, "pop-in");
			};
		} else {
			mui.fire(webview, 'pjStateEvent', {
				orderNo: orderno,
				id: id
			});
			plus.webview.show(webview, "pop-in");
		}
	}

	//
	var ssPrice_data = []; //确认融资票据数据
	bank_data = []; //银行账户信息
	
	
	
	//api待测
	if(userInfo) {
		userId = userInfo.userId;
		mui.showLoading();
		//银行信息接口api
		win.servicebus.banklist({
			userId: userId
		}, handle_bank_success, handle_error);

		/**
		 * 银行账户
		 */
		function handle_bank_success(data) {
			if(data != null && data.bodyData != null) {

				var bank = JSON.parse(data.bodyData);
				vm_finance.$set("bank_data", bank);
				
				if(bank.zxUser == "0") {
					bankCardId = bank.bindBankId;
				} else {
					var cardId = bank.banks[0].bankCardId;
					vm_finance.$set("bankCardId", cardId);
					bankCardId = vm_finance.bankCardId;
				}


				//票据展示
				var pjShow_data = JSON.parse(finacingnindex_2_financingbask);
				pjShow(pjShow_data);
				mui.hideLoading();
			} else {
				mui.toast(data.returnMsg);
			}
		}

		function handle_error() {
			mui.hideLoading();
		}

		/**
		 * 从票据融资页面 到确认融资页面 票据展示
		 * @param {Object} data
		 */
		function pjShow(data) {
			mui.hideLoading();
			var list = [];
			//数据处理
			var arrBookList = []; //承信
			var arrUnBookingObj = { //非承信
				"bespeakNo": "",
				"billCount": 0,
				"isbook": false, //是否显示非承信预约头部  
				"billDetail": [],
			};

			if(data != null && typeof data !== "undefined" && data.bodyData != null) {
				var bodyData = JSON.parse(data.bodyData);
				list = bodyData.billList;
			} else {
				mui.toast(data.returnMsg);
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

			if(arrUnBookingObj.billDetail.length > 0) {
				arrBookList.push(arrUnBookingObj);
			}

			var totalList = arrBookList;
			//融资模式
			for(var i = 0, length = totalList.length; i < length; i++) {
				totalList[i].raiseType = raiseType;
			}
			vm_finance.$set("items", totalList);
		}

	}

	
	//
	var vm_finance = new Vue({
		el: 'body',
		data: {
			allselected: true,
			items: ssPrice_data,
			raiseType: raiseType,
			bank_data: bank_data,
			bankCardId: 　bankCardId
		},
		methods: {
			/**
			 * 查看票据图片事件
			 */
			openPjList: fn_openPjList,
			/**
			 * 收款账户
			 */
			bankZH: bankZH
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
						total += parseFloat(this.items[i].billDetail[j].billMoney);
					}
				}
				return total;
			},
			/**
			 * 后端传值
			 */
			rjtotal1: function() {
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
						total += parseFloat(this.items[i].billDetail[j][priceType]);
					}
				}
				
				return total.toFixed(2);
			},
			/**
			 * 前端显示
			 */
			rjtotal: function() {
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
						total += (parseFloat(this.items[i].billDetail[j][priceType]) - parseFloat(this.items[i].billDetail[j].adjustment) - parseFloat(this.items[i].billDetail[j].flaw));
					}
				}
				return total;
			},

			pjtotalnum: function() {
				var total = 0;
				for(var i = 0, l = this.items.length; i < l; i++) {
					total += this.items[i].billDetail.length;
				}

				return total;
			},
			yhMoney: function() {
				var total = 0;
				for(var i = 0, l = this.items.length; i < l; i++) {
					total += parseFloat(this.items[i].mdDiscountTotalAmount);
				}
				return total;
			},
			/**
			 * 中信--- 是否显示收款账户
			 */
//			bankStatus: function() {
//				var status = true;
//				if(this.bank_data.zxUser == "1") {
//					status = false;
//				} else {
//					status = true;
//				}
//				return status;
//			}
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

	Vue.filter('priceInteger', function(num) {
		if(num == 0) {
			num = "0.00";
		} else {

			num += "";
		}
		var arr = num.split(".");
		return arr[0];
	});
	Vue.filter('priceDecimals', function(num) {
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
		var ind = event.currentTarget.getAttribute("data-index")
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

	/**
	 * 银行账户信息
	 */
	function bankZH() {
		$.openWindow({
			url: "userbanklist.html",
			id: "userbanklist.html",
			show: {
				aniShow: "pop-in",
			}
		});
	}

})(mui, document, window);