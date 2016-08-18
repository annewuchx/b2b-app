/**
 * 银行列表
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {

	$.init({

	});
		$.hideLoading()

	$.plusReady(function() {
		
	

		var userinfo = win.app.getState();
		var banks = {
			banks: []
		};
		var selectBankId = '';

		/**
		 * 获取银行卡列表
		 */

		var cwv = plus.webview.currentWebview();

		console.log(JSON.stringify(cwv))

		selectBankId = cwv.bindBankId;

		if(typeof userinfo.userId == 'undefined') {
			$.hideLoading();
			return;
		}

		$.showLoading();
		/**
		 * 获取银行列表
		 */
		win.servicebus.bankList({
			userId: userinfo.userId
		}, fn_bankListSuccess, function() {
			$.hideLoading();
		});

		/**
		 * 选择银行卡
		 */
		$("#banks").on('tap', '.bank_list', function(even) {
			var bankId = this.getAttribute("bankId");
			var bankName = this.getAttribute("bankName");
			var bankNo = this.getAttribute("bankNo");
			var bankCardId = this.getAttribute("bankCardId");

			var thisWebView = plus.webview.currentWebview(); //得到当前页面webview

			if(thisWebView.webviewId != "userindex.html") {
				var webview = thisWebView.opener(); //获取上个页面传过来的值并根据值找到对应的webview
				//调用公共自定义发发
				$.fire(webview, 'customEvent', {
					bank: bankId,
					bankName: bankName,
					bankNo: bankNo,
					bankCardId: bankCardId
				});
				//关闭当前view
				plus.webview.close(thisWebView);
			}
		});

		/**
		 * 添加银行卡
		 */
		doc.querySelector('.bank-new').addEventListener('tap', function(event) {
			var thisWebViewId = plus.webview.currentWebview().id;

			$.openWindow({
				id: "userbanknew.html",
				url: "userbanknew.html",
				extras: {
					webViewId: thisWebViewId
				}
			});
		});
		/**
		 * 刷新页面
		 */
		win.addEventListener('RefreshBankPage', function(event) {
			location.reload();

		});

		/**
		 *  判断是否是提现中选择的银行
		 * @param {Object} arr
		 */
		function processArr(arr) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].bankCardId == selectBankId) {
					arr[i].selectFlag = '1'; //选中的银行卡
				} else {
					arr[i].selectFlag = '0';
				}
			}

		}

		/**
		 * 获取银行列表 success callback
		 * @param {Object} data
		 */
		function fn_bankListSuccess(data) {

			if(data.returnCode != "100000") {
				$.alert(data.returnMsg, '银承库', function() {});
			} else {
				localStorage.setItem("userBankList", data.bodyData);
				banks["banks"] = JSON.parse(data.bodyData).banks;
				processArr(banks["banks"])
					//console.log(JSON.stringify(banks["banks"]))
				new Vue({
					el: ".mui-content",
					data: banks
				});
			}
			//选中选择的card
			$.hideLoading();
		}

		/**
		 *  银行卡格式化
		 */
		Vue.filter('formatCard', function(num) {
			var newNum ='';
			
			var length = num.length;
			var group = parseInt(length /4);
			var left = num.length % 4;
			
			for (var i =0;i<group;i++){
				newNum = newNum + num.substring(4*i,4*i+4)+' ';
			}
			if(left>0){
				newNum = newNum + num.substring(length-left);
			}
			
			return newNum;
		});
	});

})(mui, document, window)