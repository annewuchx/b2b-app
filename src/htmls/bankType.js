/*
 * 
 */
(function($, doc, win) {
	var classSelector = function(name) {
		return '.' + $.className(name);
	};

	var bank_data = {}; //原始数据
	var bank_vm = {}; //初始数据

	var bank_data1 = []; //总数据
	var bank_data2 = []; //搜索结果
	var bank_data_new = [];
	mui.showLoading();
	//api测试
	win.servicebus.getBankTypeList({

	}, handle_success, handle_error);
	/**
	 * 承兑行列表请求成功后的回调
	 * @param {Object} data
	 */
	function handle_success(data) {
		mui.hideLoading();
		if(data == null || data.bodyData == null || data.returnCode != "100000"){
			mui.toast(data.returnMsg);
			return;
		}
		//获得服务器响应
		bank_data = JSON.parse(data.bodyData).bankTypeList;
		bank_vm = new Vue({
			el: ".mui-content",
			data: {
				bank_data: bank_data,
				bank_data1: bank_data1,
				bank_data2: bank_data2
			},
			methods: {
				handle_bankType: handle_bankType,
			}
		});
	}
	function handle_error(){
		mui.hideLoading();
	}

	/**
	 * @description 银行类型
	 */
	function handle_bankType(event) {
		var wv = plus.webview.currentWebview();
		var ownerView = plus.webview.currentWebview().opener();
		var self = event.currentTarget;
		var bank = "";
		var type = self.getElementsByTagName("span")[0].innerText;
		if(type != "1" && type != "2" && type != "3" && type != "4" && type != "5"){
			type = "1";
			bank = "国股银行";
		}else{
			type = self.getElementsByTagName("span")[0].innerText;
			bank = self.getElementsByClassName("bank")[0].innerText;
		}
		mui.fire(ownerView, 'bankEvent', {
			bankType: bank,
			type: type
		});
		wv.hide();
		wv.close('none', 0);
	}

	/**
	 * 
	 */
	var search = document.getElementById("search");
	document.querySelector(".bank-type2").classList.add("toggle");

	/**
	 * 
	 */
	search.addEventListener('input', function() {

		document.querySelector(".bank-type").classList.add("toggle");
		var keyword = this.value.toLowerCase();
		//api测试
		win.servicebus.searchBankType({
			bankName: keyword
		}, handleSuccess);

		function handleSuccess(data) {
			//获得服务器响应
			if (data.returnCode == "100000" && data != null && data.bodyData != null) {
	
				var msg = JSON.parse(data.bodyData).bankList;
				msg.forEach(function(v) {

					v.shortName = v.shortName.toLowerCase().replace(keyword, '<em style="font-style: inherit; color: blue;">' + keyword + '</em>');

				});

				bank_vm.$set('bank_data1', msg);

				bank_data_new = bank_vm.bank_data1.filter(function(item) {
					if (item != null && keyword) {
						return item.shortName.toLowerCase().indexOf(keyword) >= 0 || item.cnaps.indexOf(keyword) >= 0;
					} else {
						return false;
					}
				});

				if (keyword == '') {

					document.querySelector(".bank-type").classList.remove("toggle");
					mui('.bankListContainer-empty-alert')[0].style.display = 'none';
					bank_vm.$set('bank_data2', []);

				} else {
					if (bank_data_new == null || bank_data_new.length == 0) {
						mui('.bankListContainer-empty-alert')[0].style.display = 'block';
						document.querySelector(".bank-type2").classList.add("toggle");
					} else {
						mui('.bankListContainer-empty-alert')[0].style.display = 'none';
						document.querySelector(".bank-type2").classList.remove("toggle");
						bank_vm.$set('bank_data2', bank_data_new);
					}
				}


			} else {
				//todo
				mui.toast(data.returnMsg);
			}
		}

	});

	/*
	 * 
	 */
	$("#searchcontainer").on('tap', classSelector('icon-clear'), function() {
		document.querySelector(".bank-type2").classList.add("toggle");
		document.querySelector(".bank-type").classList.remove("toggle");
		mui('.bankListContainer-empty-alert')[0].style.display = 'none';
	}, false);

})(mui, document, window);