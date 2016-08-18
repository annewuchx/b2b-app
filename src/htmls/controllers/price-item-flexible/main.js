define(function(require, exports, module) {

	var self = exports;
	var doc = document,
		win = window,
		$ = mui;

	var initHtml = false;

	require('./style.css');
	require('../../../css/iconfont.css');
	require('../../../css/mui.picker.flexible.css');
	require('../../../css/mui.poppicker.css');

	var uiHtml = require('./ui.html');

	require('../../../mui/mui.picker.flexible.js');
	require('../../../mui/mui.dtpicker.js');
	
	require('../../../mui/mui.poppicker.js');
	require('../../../libs/vue.min.js');
	/**
	 * ------把页面追加到主页
	 */
	self.append = function() {

		var fragment = document.createElement("div");
		fragment.className = "mui-content";
		fragment.innerHTML = uiHtml;
		fragment.className = "mui-content";
		document.body.appendChild(fragment);

		initHtml = true;
	};

	self.hide = function() {

	};

	/**
	 * vue数据
	 */
	var vm_notes = null;

	self.bindData = function() {

		if(vm_notes != null) {
			return;
		}

		//vue
		vm_notes = new Vue({
			el: "#price-item",
			data: {
				parValue: "", //票面金额
				bankTypeValue: "", //承兑行类型值
				bankType: "", //承兑行类型 1-5
				endDate: "", //到期日
				moneyDisplay: true, //票面金额样式控制
				moneyActive: false,
				bankDisplay: true, //承兑行类型样式控制
				bankActive: false,
				endDateDisplay: true, //到期日样式控制
				endDateActive: false
			},
			methods: {
				/**
				 * 日期选择
				 */
				showDatePicker: function() {
					self.showDatePicker();
				},
				/**
				 * 承兑行选择
				 */
				showBanktype: function() {
					self.showBanktype();
				},
				/**
				 * 票面金额
				 */
				money: function() {
					self.money();
				}
			},
			computed: {
				/**
				 * 票面金额样式
				 */
				el_money: function() {
					if(this.parValue) {
						this.moneyDisplay = false;
						this.moneyActive = true;
					} else {
						this.moneyDisplay = true;
						this.moneyActive = false;
					}
				},
				/**
				 * 承兑行样式
				 */
				el_bank: function() {
					if(this.bankTypeValue) {
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
				},
				btnStatus: function() {
					var val = this.parValue && this.bankTypeValue && this.endDate;
					return !val;
				}
			}

		});
	}

	var fn_successCallback = null;

	/**
	 * 初始化
	 * 
	 */
	self.init = function(fncallback) {

		if(!initHtml) {
			self.append();
		}

		self.bindData(); //初始化vue
		
		//监听确认按钮实时变化
		vm_notes.$watch('btnStatus', function(newvalue, oldvalue) {
			fncallback(newvalue);
		});
	};

	/*
	 * 编辑数据时－设置初始值
	 */
	self.setData = function(initdata) {
		//初始化vue
		if(initdata) {
			vm_notes.parValue = initdata[0].billAmount;
			vm_notes.endDate = initdata[0].billEndDate;
			vm_notes.bankType = initdata[0].bankType;
			switch(initdata[0].bankType) {
				case "1":
					vm_notes.bankTypeValue = "国股银行"
					break;
				case "2":
					vm_notes.bankTypeValue = "城商银行"
					break;
				case "3":
					vm_notes.bankTypeValue = "农商外资"
					break;
				case "4":
					vm_notes.bankTypeValue = "农信农合"
					break;
				case "5":
					vm_notes.bankTypeValue = "村镇银行"
					break;
				default:
					break;
			}
		}

//		handle_payValue();

	};

	/**
	 * 获取表单值 
	 */
	self.getData = function() {
		var data = vm_notes.$data;
		return data;
	};

	//	/**
	//	 * ----票面金额的判断 
	//	 */
	self.money = function() {
		handle_payValue();
	}

	/**
	 * 日期控件
	 */
	//到期日
	var options = {
		"type": "date"
	};

	var picker = new mui.DtPicker(options);

	self.showDatePicker = function() {

		picker.show(function(rs) {

				var localDate = new Date();
				localDate1 = FormatDate(localDate);
				localNew = 	new Date(localDate1).getTime();	
				
				
				chooseDate = new Date(rs.value).getTime();
				timeDif = chooseDate - localNew;
			
			
				days = Math.floor(timeDif / (24 * 3600 * 1000));

			if(days > 200 || days <= 0) {
				mui.toast("计息天数不能大于200天,需大于当前日期", 3000);
				return;
			}

			vm_notes.endDate = rs.text;

		});

	};

	/**
	 * 承兑行类型
	 */
	self.showBanktype = function() {
		mui.openWindow({
			url: 'bankType.html',
			id: 'bankType.html',
			show: {
				aniShow: 'slide-in-bottom'
			}
		});

		window.addEventListener("bankEvent", function(event) {
			var bankType = document.querySelector(".bank-type");
			vm_notes.bankTypeValue = event.detail.bankType;
			vm_notes.bankType = event.detail.type;
		});
	};

	/**
	 * 
	 */
	self.resetForm = function() {
		//重置
		vm_notes.bankTypeValue = "";
		vm_notes.parValue = "";
		vm_notes.endDate = "";
	};
	
	/**
	 * 日期格式化
	 * @param {Object} strTime
	 */
	function FormatDate (strTime) {
	    var date = new Date(strTime);
	    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
	}

	
	/**
	 * @description 票面金额 判断
	 */
	function handle_payValue() {
		var parValue = gel("par-value");
		parValue.addEventListener("input", function() {


			pjValue = vm_notes.parValue;
	
			vm_notes.parValue = this.value.replace(/[^\d\.]/g, '');
	
			var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{0,2})?$/;
	
			//
			if(pjValue.length > 11) {
	
				vm_notes.parValue = pjValue.slice(0, 11);
				pjValue = vm_notes.parValue;
	
			}
	
			this.value = vm_notes.parValue;
	
			if(!reg.test(pjValue) && pjValue.length) {
				mui.toast("金额需为一亿以内，金额小数位最多2位");
				return;
			}

	});

	parValue.addEventListener("keyup", function() {
		this.value = this.value.replace(/[^\d\.]/g, '');
		vm_notes.parValue = this.value;
	});


	}

	/**
	 * @description 票面金额 格式化
	 */
	function AngelMoney(s) {
		if(s == "") {
			s = "0";
		}

		if(/[^0-9\.]/.test(s)) return "不是数字！";

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

});