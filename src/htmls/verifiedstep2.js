/*
 * 
 * 企业认证（2/2）
 */

(function($, doc, win) {
	/**
	 * init
	 */
	$.init();
	/**
	 * mui ready
	 */
	$.ready(function() {
		var dpr = parseInt(document.getElementsByTagName("html")[0].getAttribute("data-dpr"));

		gel("btn-group").style.marginTop = document.body.clientHeight - gel("header").clientHeight - 10 * dpr - gel("form-group").clientHeight - gel("btn-group").clientHeight + "px";

		/*
		 * 初始化 支行查询参数
		 * */
		var cityid = '',
			bankid = '';

		//		fn_billAccount(); //资金账户

		fn_clickXieyi(); //企业协议

		fn_getProvice(); //选择省市

		fn_getBank(); //选择银行

		fn_getBranch(); //选择支行

		gel('subform').disabled = true;
		gel('notSubmit').disabled = true;

		gel('yck-eye').addEventListener('tap', function(event) {
			var obj = event.target;
			var statu = obj.getAttribute("statu");
			if(statu == 0) {
				obj.setAttribute('statu', '1');
				gel('getPW').setAttribute('type', 'text');
				obj.classList.remove('yf-eyeclose');
				obj.classList.add('yf-eyeopen');

			} else {
				obj.setAttribute('statu', '0');
				gel('getPW').setAttribute('type', 'password');
				obj.classList.remove('yf-eyeopen');
				obj.classList.add('yf-eyeclose');

			}

		});

		/**
		 * 控制银行账号输入的类型
		 */
		gel('bankNum').addEventListener('input', function() {
			this.value = this.value.replace(/[^a-zA-Z0-9\-]/g, '').replace(/([\w\-]{4})(?=[\w\-])/g, "$1 ");

		})

	});
	/**
	 * plus ready
	 */
	$.plusReady(function() {

		fn_submitForm(); //提交表格

		fn_notSubmit(); // 暂不注册

		gel('subform').disabled = false;
		gel('notSubmit').disabled = false;

	});

	/*
	 * 企业认证协议
	 */
	function fn_clickXieyi() {
		gel('xieyi').addEventListener('tap', function() {
			$.openWindow({
				id: 'weituo.html',
				url: 'weituo.html'
			})
		})

	}

	/*
	 * 资金账户
	 */
	//	function fn_billAccount() {
	//		gel('acountDetail').addEventListener('tap', function() {
	//			var target = 'zijinaccount.html';
	//			$.openWindow(target, target);
	//
	//		})
	//	}

	/**
	 * 选择省市
	 */
	function fn_getProvice() {
		/*
		 * 选择省市   省市改变  银行 支行为空
		 */

		document.querySelector('.mui-province').addEventListener('tap', function() {

			var target = 'openProvince.html';
			$.openWindow(target, target);

		}, false);
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

		/*
		 * 选择银行 总行   银行改变  支行为空  
		 */

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
		/*
		 * 选择支行  传递参数
		 */
		document.querySelector('.mui-branch').addEventListener('tap', function() {

			if(!gel('opnerCity').value) {
				$.toast("请选择开户省市");
				return;
			}
			if(!gel('selectBank').value) {
				$.toast("请选择开户银行");
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

	/**
	 * 验证输入是否正确
	 */

	function checkInputvalid(obj) {
		var self = obj;

		if(self.payeeAccountName == '') {
			$.toast('请输入开户名');
			return;
		}
		if(self.bankCardProvince == null) {
			$.toast('请选择开户省市');
			return;
		}
		if(self.payeeBankNo == null) {
			$.toast('请选择开户银行');
			return;
		}
		if(self.payeeSubBankNo == null) {
			$.toast('请选择开户支行');
			return;
		}
		if(self.payeeAccount == '') {
			$.toast('请输入银行账号');
			return;
		}
		if(self.paypasswd == '') {
			$.toast('请输入交易密码');
			return;
		}
		if(self.paypasswd.length > 6) {
			$.toast('交易密码格式不正确，须为6位数字且与登录密码不同');
			return;
		}
		if(self.payeeAccount.length > 40) {

			$.toast('银行账号不正确');
			return;
		}

		win.servicebus.companyauthAuth(self, fn_verifiedUploadSuccess, fn_verifiedUploadError);

	}
	/**
	 * 认证提交失败
	 * @param {Object} xhr
	 * @param {Object} type
	 * @param {Object} errorThrown
	 */
	function fn_verifiedUploadError(xhr, type, errorThrown) {

	}
	/**
	 * 准备表单数据
	 */
	function fn_verifiedDataUpload() {
		var cwv = plus.webview.currentWebview();
		//准备表单 数据
		var verifiedUploadData = cwv.imgUpPath;
		verifiedUploadData.payeeAccountName = gel('opnerName').value;
		verifiedUploadData.bankCardProvince = gel('opnerCity').getAttribute('city-id');
		verifiedUploadData.payeeBankNo = gel('selectBank').getAttribute('bank-id');
		verifiedUploadData.payeeSubBankNo = gel('selectBranch').getAttribute('branch-id');
		verifiedUploadData.payeeAccount = gel('bankNum').value.replace(/\s/g, '');
		verifiedUploadData.paypasswd = gel('getPW').value;
		verifiedUploadData.manager = gel('managerName').value;
		//取出userid
		var userObj = win.app.getState();
		if(typeof(userObj.userId) != 'undefined') {

			console.log('in')
			verifiedUploadData.userId = userObj.userId;

			//检查输入是否合法
			checkInputvalid(verifiedUploadData);

		} else {
			$.toast('用户名不存在');
		}
	}

	/**
	 * document.querySelector 缩写
	 * @param {String} name
	 */
	function docQy(name) {
		return document.querySelector(name);
	}

	/**
	 * 企业认证上传成功回调
	 * @param {Object} data
	 */
	function fn_verifiedUploadSuccess(data) {

		if(data.returnCode == 100000) {

			$.alert('我们会在2个小时内（工作日 9:00-18:00）给您反馈，请耐心等待。', '提交成功!', '知道了', function() {
				fn_processSubmit();
			});

		} else {
			$.toast(data.returnMsg);
		}

	}

	/**
	 * 提交&暂不认证-返回指定页面事件
	 */
	function fn_processSubmit() {

		var cwv = plus.webview.currentWebview();

		var frontwv = plus.webview.getWebviewById('verifiedstep1.html');

		var userIndexView = plus.webview.getWebviewById('userindex_sub.html');
		$.fire(userIndexView, 'RefreshPage');

		//检查是否有指定跳转页面
		if(typeof(cwv.webviewId) != 'undefined' && cwv.webviewId != '') { //不为空  跳到指定页面
			fn_jumpToCertainPage(cwv);
		} else { //为空  跳首页

			$.fire($.WVFooter(), 'gohome');

			$.toMain();

			frontwv.close();

			$.closeWin();
		}

	}

	function fn_jumpToCertainPage(webview) {

		var frontwv = plus.webview.getWebviewById('verifiedstep1.html');
		frontwv.close('none', '0');

		webview.hide();
		webview.close('none', '0');
	}
	/*
	 * 提交申请
	 */
	function fn_submitForm() {

		gel('subform').addEventListener('tap', function() {
			fn_verifiedDataUpload();

		})
	}

	/*
	 * 暂不开通
	 */
	function fn_notSubmit() {

		gel('notSubmit').addEventListener('tap', function() {
			fn_processSubmit();

		})
	}

})(mui, document, window)