/**
 * 银行列表
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {

	$.init({

	});

	$.ready(function() {

		var userinfo = win.app.getState();
		var banks = {
			banks: []
		};

		/**
		 * 获取银行卡列表
		 */

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
		 * 银行卡设置为默认
		 */
		function fn_defaultCard(event) {
			//		$("#banks").on('tap', '.mui-btn-yellow', function(even) {
			$.showLoading();
			var bankId = event.target.parentElement.id;

			if(typeof userinfo.userId == 'undefined') {
				$.hideLoading();
				return;
			}

			window.servicebus.bankUpdateBank({
				userId: userinfo.userId,
				bindBankId: bankId
			}, fn_updataBankSuccess);

			/**
			 * 银行设置为默认 successCallback
			 * @param {Object} data
			 */
			function fn_updataBankSuccess(data) {
				//				console.log(data)
				$.hideLoading();
				if(data.returnCode != "100000") {
					$.alert(data.returnMsg, '银承库', function() {});
				} else {

					location.reload();
				}
			}
		}
		//		});

		/**
		 * 删除银行卡
		 */
		function fn_deleteCard(index, event) {

			var btnArray = ['取消', '确认'];
			var bankNum = '';
			var bankname = banks.banks[index].bankName;
			if(banks.banks[index].bankNumber.length > 4) {
				bankNum = banks.banks[index].bankNumber.substr(-4);
			} else {
				bankNum = banks.banks[index].bankNumber;
			}

			$.confirm('确认删除对公账号“' + bankname + '(' + bankNum + ')”？', '银承库', btnArray, function(e) {
					if(e.index == 1) {
						var bankId = event.target.parentElement.id;
						$.showLoading();
						if(typeof userinfo.userId == 'undefined') {
							$.hideLoading();
							return;
						}

						window.servicebus.bankDelBank({
							userId: userinfo.userId,
							bindBankId: bankId
						}, fn_delBankSuccess)
					} else {
						var fath = gel('banklist-' + index);
						fath.setAttribute('class', 'mui-table-view-cell bank_list');
						fath.firstElementChild.setAttribute('class', 'mui-slider-right mui-disabled');
						fath.firstElementChild.firstElementChild.setAttribute('style', '');
						fath.firstElementChild.lastElementChild.setAttribute('style', '');
						gel('leftCon-' + index).firstElementChild.setAttribute('style', '');
					}
				})
				/**
				 * 删除银行卡 success callback
				 * @param {Object} data
				 */
			function fn_delBankSuccess(data) {

				$.hideLoading();
				if(data.returnCode != "100000") {
					$.alert(data.returnMsg, '银承库', function() {
						location.reload();
					});
				} else {
					var bankDiv = event.target.parentNode.parentNode;; //.remove();
					bankDiv.className = "mui-table-view-cell bank_list bank_list_delete";
					setTimeout(function() {
						bankDiv.remove();
					}, 300);
				}
			}
		}
		/**
		 * 选择银行卡
		 */
		$("#banks").on('tap', '.bank_list', function(even) {
			var bankId = this.getAttribute("bankId");
			var bankName = this.getAttribute("bankName"); //支行名
			var bankNameMain = this.getAttribute("bankNameMain"); //总行名
			var bankNo = this.getAttribute("bankNo");
			var bankCardId = this.getAttribute("bankCardId");
			var thisWebView = plus.webview.currentWebview(); //得到当前页面webview

			if(thisWebView.webviewId != "userindex.html") {
				var webview = thisWebView.opener(); //获取上个页面传过来的值并根据值找到对应的webview
				//调用公共自定义发发
				$.fire(webview, 'customEvent', {
					bankCardId: bankCardId,
					bank: bankId,
					bankName: bankName,
					bankNo: bankNo,
					bankNameMain: bankNameMain
				});
				//关闭当前view
				plus.webview.close(thisWebView);
			}
		});

		/**
		 * 添加银行卡
		 */
		doc.querySelector('.bank-new').addEventListener('tap', function(event) {

			console.log(JSON.stringify(userinfo))

			if(userinfo.authFlag != "0") { //未认证
				$.alert('认证后才可新增银行账户', '银承库');
				return;
			}
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
		 * 获取银行列表 success callback
		 * @param {Object} data
		 */
		function fn_bankListSuccess(data) {
			console.log("000000000000");
			if(data.returnCode != "100000") {
				$.alert(data.returnMsg, '银承库', function() {});
			} else {
				localStorage.setItem("userBankList", data.bodyData);
				banks["banks"] = JSON.parse(data.bodyData).banks;

				new Vue({
					el: ".mui-content",
					data: banks,
					methods: {
						deleteCard: fn_deleteCard,
						defaultCard: fn_defaultCard
					}
				})

			}
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