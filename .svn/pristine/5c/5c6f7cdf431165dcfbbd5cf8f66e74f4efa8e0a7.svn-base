/*
 * 
 */
(function($, doc, win) {
	/**
	 * 
	 * @param {String} name
	 */
	var classSelector = function(name) {
		return '.' + $.className(name);
	};
	/*
	 * init
	 */
	$.init();
	/*
	 *  mui ready
	 */
	$.ready(function() {

		mui.showLoading(); //loading

		var banklist = [],
			bank_vm = {},
			originbanklist = [];

		fn_getBankList(); //获取银行列表

		fn_filterKeyword(); //关键字输入匹配

		fn_icoClear(); //icon clear

		fn_passValue(); //向企业认证2传值

	});

	/**
	 * icon clear 
	 */
	function fn_icoClear() {

		$("#searchcontainer").on('tap', classSelector('icon-clear'), function() {

			$('.bankListContainer-empty-alert')[0].style.display = 'none';

			bank_vm.$set('banklist', originbanklist);

		}, false);
	}

	/**
	 * 输入匹配帅选
	 */
	function fn_filterKeyword() {

		var el_muiSearchBank = gel('muiSearchBank');

		el_muiSearchBank.addEventListener('input', function() {

			var keyword = this.value.toLowerCase();

			banklist1 = originbanklist.filter(function(item) {
				
				if (item != null && keyword) {
					return item.value.toLowerCase().indexOf(keyword) >= 0;
					
				} else {
					return false
				}
			});

			if (keyword == '') {
				$('.bankListContainer-empty-alert')[0].style.display = 'none';
				bank_vm.$set('banklist', originbanklist);

			} else {

				if (banklist1 == null || banklist1.length == 0) {
					$('.bankListContainer-empty-alert')[0].style.display = 'block';
					bank_vm.$set('banklist', []);
				} else {
					$('.bankListContainer-empty-alert')[0].style.display = 'none';
					bank_vm.$set('banklist', banklist1);
				}

			}
		}, false);
	}

	/*
	 * 发送请求 获取银行数据
	 */
	function fn_getBankList() {
		win.servicebus.commonBanktypes(fn_processBankData,function(){
			$.hideLoading();
			$('.bankListContainer-empty-alert')[0].style.display = 'block';
		});
	}
	/**
	 * successCallback
	 * @param {Object} data
	 */
	function fn_processBankData(data) {
		mui.hideLoading(); //隐藏loading
		originbanklist = JSON.parse(data.bodyData).banktypes;
		fn_fillPrinceData(originbanklist);
	}
	/*
	 * vue数据绑定
	 * */

	function fn_fillPrinceData(list) {
		bank_vm = new Vue({
			el: '#bankListContainer',
			data: {
				banklist: list
			}
		});
	}

	/**
	 * 向企业认证2 传值
	 */
	function fn_passValue() {

		$('#bankListContainer').on('tap', 'a', function() {

			var self = this;
			var data = {
				bank: self.innerText,
				bankid: self.getAttribute('data-id')
			}

			if (win.plus) {
				var cwv = plus.webview.currentWebview();
				var frontwv = plus.webview.currentWebview().opener();
				$.fire(frontwv, 'bankEvent', data);
				cwv.close();
				frontwv.show();
				
			} else {
				$.alert("暂不支持app之外的访问");
			}

		});
	}
})(mui, document, window);