/**
 * 新增银行账户
 */

(function($, win, doc) {

	$.init();

	$.ready(function() {

		$.hideLoading();

		seajs.config({
			base: "../"
		});

		var cityid = '',
			bankid = '';

		var userinfo = win.app.getState();

		var userData = JSON.parse(localStorage.getItem("userIndex_accountOwnercash"));

		if(userData && userData.ownerCash && userData.ownerCash.companyName) {
			gel("payeeAccountName").value = userData.ownerCash.companyName; //从localStorage读取开户名
		}

		fn_getProvice(); //select province

		fn_getBank(); //select bank

		fn_getBranch(); //select branch
		
		
		/**
		 * 控制银行账号输入的类型
		 */
		gel('payeeAccount').addEventListener('input',function(){
			this.value = this.value.replace(/[^a-zA-Z0-9\-]/g, '');
		})

		/**
		 * 选择省市
		 */
		function fn_getProvice() {
			document.querySelector('.mui-province').addEventListener('tap', function() {

				var target = 'openProvince.html';
				$.openWindow(target, target);

				//				seajs.use('./controllers/province-city/main', function(cityModel) {
				//					cityModel.init(1);
				//					cityModel.show(function(items) {
				//						gel('opnerCity').value = items[0].text + " " + items[1].text;
				//						gel('opnerCity').setAttribute('province-id', items[0].value);
				//						gel('opnerCity').setAttribute('city-id', items[1].value);
				//						cityid = items[1].value;
				//						gel('selectBranch').value = '';
				//					});
				//
				//				});

			}, false)

			/*
			 * 监听省市返回事件
			 */
			window.addEventListener('provinceEvent', function(event) {

				gel('opnerCity').value = event.detail.province + " " + event.detail.city;
				gel('opnerCity').setAttribute('province-id', event.detail.pid);
				gel('opnerCity').setAttribute('city-id', event.detail.cid);
				cityid = event.detail.cid;
				gel('selectBranch').value = '';

			});

		}

		/**
		 * 选择银行
		 */

		function fn_getBank() {
			document.querySelector('.mui-bank').addEventListener('tap', function() {
				gel('selectBranch').value = '';
				var target = 'openBank.html';
				$.openWindow(target, target);
			});

			/*
			 * 监听银行返回事件
			 */
			window.addEventListener('bankEvent', function(event) {
				gel('selectBank').value = event.detail.bank;
				gel('selectBank').setAttribute('bank-id', event.detail.bankid);
				bankid = event.detail.bankid;
			});
		}

		/**
		 * 选择支行
		 */
		function fn_getBranch() {
			document.querySelector('.mui-branch').addEventListener('tap', function() {
				if(!gel('opnerCity').value) {
					$.toast("请输入开户省市");
					return;
				}
				if(!gel('selectBank').value) {
					$.toast("请输入开户银行");
					return;
				}

				var target = 'openBranch.html';
				$.openWindow({
					id: target,
					url: target,
					extras: {
						cid: cityid,
						bid: bankid
					}
				});

			});

			/*
			 * 监听分行返回事件
			 */
			window.addEventListener('branchEvent', function(event) {
				gel('selectBranch').value = event.detail.branch;
				gel('selectBranch').setAttribute('branch-id', event.detail.branchid);
			});
		}

		gel('sendMail').addEventListener('tap', function() {

			var newBankObj = {};
			newBankObj.userId = userinfo.userId;
			newBankObj.bankCardProvince = gel('opnerCity').getAttribute('city-id'); //	开户省
			newBankObj.payeeBankNo = gel('selectBank').getAttribute('bank-id'); //	开户银行
			newBankObj.payeeSubBankNo = gel('selectBranch').getAttribute('branch-id'); //	开户支行
			newBankObj.payeeAccount = gel("payeeAccount").value; //	银行卡号
			newBankObj.flag = gel("flag").classList.contains('mui-active') ? 1 : 0; //	默认标识

			if(typeof(userinfo.userId) == 'undefined') {
				$.toast('用户名不存在');
				return;
			}
			if(newBankObj.bankCardProvince == '' || newBankObj.bankCardProvince == null) {
				$.toast('开户省市不能为空');
				return;
			}
			if(newBankObj.payeeBankNo == '' || newBankObj.payeeBankNo == null) {
				$.toast('开户银行不能为空');
				return;
			}
			if(newBankObj.payeeSubBankNo == '' || newBankObj.payeeSubBankNo == null) {
				$.toast('开户支行不能为空');
				return;
			}

			if(newBankObj.payeeAccount == '') {
				$.toast('银行卡号不能为空');
				return;
			}
			if(newBankObj.payeeAccount.length > 40) {
				$.toast('银行卡号小于40位');
				return;
			}
			$.showLoading();
			win.servicebus.bankAddBank(newBankObj, fn_addBankSuccess, fn_addBankError);
		});
		/**
		 * 新增银行账户提交 Error
		 * @param {Object} data
		 */
		function fn_addBankError(xhr, type, errorThrown) {
			$.hideLoading()
		}
		/**
		 * 新增银行账户提交 Success
		 * @param {Object} data
		 */
		function fn_addBankSuccess(data) {
			$.hideLoading();

			if(data.returnCode != "100000") {
				$.alert(data.returnMsg, '银承库', function() {});
			} else {
				$.fire(plus.webview.currentWebview().opener(), "RefreshBankPage", {});
				setTimeout(function() {
					plus.webview.currentWebview().close();
				}, 1000);
			}
		}

	})

})(mui, window, document)