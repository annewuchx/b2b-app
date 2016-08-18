/**
 * servicebus.js
 * peterZhu
 * 20160608
 */
(function($, win) {
	//
	win.servicebus = (win.servicebus == null || typeof win.servicebus === "undefined") ? {} : win.servicebus;

	//
	win.servicebus = {
		/**
		 * 获取消息列表
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		messageIndex: function(data, successCallback, errorCallback, options) {
			//
			$.ajax_query('message/index', {
				data: data,
				timeout: 10000,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 消息 - 详情
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		messageEdit: function(data, successCallback, errorCallback, options) {
			$.ajax_query('message/edit', {
				data: data,
				timeout: 10000,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 票据融资 - 我的票据
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		raiseOrderQueryMyBill: function(data, successCallback, errorCallback, options) {
			$.ajax_query('raiseOrder/queryMyBill', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 企业认证2 - 选择省市 
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		commonProvinces: function(successCallback, errorCallback, options) {
			$.ajax_query('common/provinces', {
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 *  企业认证2 - 获取所有的银行总行
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		commonBanktypes: function(successCallback, errorCallback, options) {
			$.ajax_query('common/banktypes', {
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		getSubbanksSubname: function(data, successCallback, errorCallback, options) {
			$.ajax_query('common/getsubbanks/subname', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 票据资产筛选
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		accountBillDetailCondition: function(data, successCallback, errorCallback, options) {
			$.ajax_query('account/billdetail/condition', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 密码登录
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		indexPasswdLogin: function(data, successCallback, errorCallback, options) {
			$.ajax_query('index/passwdlogin', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 快捷登录
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		indexQuickLogin: function(data, successCallback, errorCallback, options) {
			$.ajax_query('index/quicklogin', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 注册
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		indexRegister: function(data, successCallback, errorCallback, options) {
			$.ajax_query('index/register', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 获取验证码   0 登录 1 注册 2 找回密码 3 联系我们
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		commonGetcode: function(data, successCallback, errorCallback, options) {
			$.ajax_query('common/getcode', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 登录 注册  验证用户名是否存在
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		indexCheckuser: function(data, successCallback, errorCallback, options) {
			$.ajax_query('index/checkuser', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 提交企业认证
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		companyauthAuth: function(data, successCallback, errorCallback, options) {
			$.ajax_query('companyauth/auth', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 预约取消
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		getBespeakCancle: function(data, successCallback, errorCallback, options) {
			$.ajax_query('bespeak/cancle', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 预约场次
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		getBespeakBespeak: function(data, successCallback, errorCallback, options) {
			$.ajax_query('bespeak/bespeak', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 提交预约申请
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		getBespeakIndex: function(data, successCallback, errorCallback, options) {
			$.ajax_query('bespeak/index', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 承信预约记录
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		getBespeakRecord: function(data, successCallback, errorCallback, options) {
			$.ajax_query('bespeak/record', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},

		/**
		 * 智能报价 
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		smartQuotation: function(data, successCallback, errorCallback, options) {
			$.ajax_query('appRate/rateInfoForApp', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},

		/**
		 * 批量报价 
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		batchQuotation: function(data, successCallback, errorCallback, options) {
			$.ajax_query('appRate/getRateInfoForBatch', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 票据融资 
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		pjFinancing: function(data, successCallback, errorCallback, options) {
			$.ajax_query('raiseOrder/queryMyBill', {
				data: data,
				timeout: 30 * 1000,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 确认融资订单
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		confirmBill: function(data, successCallback, errorCallback, options) {
			$.ajax_query('raiseOrder/confirmBill', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 确认融资
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		confirmFinance: function(data, successCallback, errorCallback, options) {
			$.ajax_query('raiseOrder/confirmFinance', {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 融资订单详情
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		orderDetail: function(data, successCallback, errorCallback, options) {
			$.ajax_query('raiseOrder/orderDetail', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 融资订单列表
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		order: function(data, successCallback, errorCallback, options) {
			$.ajax_query('raiseOrder/order', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 选择办理业务的地点
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		chooseArea: function(data, successCallback, errorCallback, options) {
			$.ajax_query('query/chooseArea', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 承兑行列表
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		getBankTypeList: function(data, successCallback, errorCallback, options) {
			$.ajax_query('appRate/getBankTypeList', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 搜索承兑行列表
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		searchBankType: function(data, successCallback, errorCallback, options) {
			$.ajax_query('appRate/searchBankType', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 查询门店列表 
		 * @param {Object} data	{ longitude,latitude | provinceId, areaId }
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		queryStore: function(data, successCallback, errorCallback, options) {
			$.ajax_query("query/queryStore", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 提现
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		accountWithdraw: function(data, successCallback, errorCallback, options) {
			$.ajax_query("account/withdraw", {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 用户提现--验证码
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		commonUserGetcode: function(data, successCallback, errorCallback, options) {
			$.ajax_query("common/user/getcode", {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 我要提现
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		accountGetdraw: function(data, successCallback, errorCallback, options) {
			$.ajax_query("account/getdraw", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 新增银行账户
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		bankAddBank: function(data, successCallback, errorCallback, options) {
			$.ajax_query("bank/addbank", {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 票据指数 
		 * @param {Object} data	
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		billIndexIndex: function(data, successCallback, errorCallback, options) {
			$.ajax_query("billIndex/index", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 银行卡设为默认
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		bankUpdateBank: function(data, successCallback, errorCallback, options) {
			$.ajax_query("bank/upbank", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 删除银行卡
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		bankDelBank: function(data, successCallback, errorCallback, options) {
			$.ajax_query("bank/delbank", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 获取银行卡列表
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		bankList: function(data, successCallback, errorCallback, options) {
			$.ajax_query("bank/banklist", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 我的账户
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		accountOwnercash: function(data, successCallback, errorCallback, options) {
			$.ajax_query("account/ownercash", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 获取Android最新版本
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		androidVersion: function(data, successCallback, errorCallback, options) {
			$.ajax_query("about/androidVersion", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 获取ios最新版本
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		iosVersion: function(data, successCallback, errorCallback, options) {
			$.ajax_query("about/appleVersion", {
				data: data,
				success: successCallback,
				error: errorCallback
			});

		},
		/**
		 * 门店选择
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		queryChooseStore: function(data, successCallback, errorCallback, options) {
			$.ajax_query("query/chooseStore", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},

		/**
		 * 
		 * @param {Object} successCallback
		 */
		imgUpload: function(successCallback) {
			return plus.uploader.createUpload(CONFIG.appRootUrl + "common/upload", {
				method: "POST"
			}, successCallback);
		},
		/**
		 * 票据图片详情
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		accountBillDetail: function(data, successCallback, errorCallback, options) {
			$.ajax_query('account/billdetail/' + data.userId + '/' + data.pid, {
				timeout: 10000,
				success: successCallback,
				error: errorCallback
			});
		},
		/**信用提升
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		bespeakCredit: function(data, successCallback, errorCallback, options) {
			$.ajax_query('bespeak/credit', {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 资金流水
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		accountCashflow: function(data, successCallback, errorCallback, options) {
			$.ajax_query("account/cashflow", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 现金账户
		 * @param {Object} data
		 * @param {Function} successCallback
		 * @param {Function} errorCallback
		 * @param {Object} options
		 */
		accountCashbalance: function(data, successCallback, errorCallback, options) {
			$.ajax_query("account/cashbalance", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		/**
		 * 联系我们
		 */
		bookIndex: function(data, successCallback, errorCallback, options) {
			$.ajax_query("book/index", {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			})
		},
		/**
		 * 选择办理业务地点
		 */
		queryArea: function(data, successCallback, errorCallback, options) {
			$.ajax_query("query/queryArea", {
				data: data,
				type: 'get',
				success: successCallback,
				error: errorCallback
			})
		},
		/**
		 * 找回交易密码
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		forgetpwOne: function(data, successCallback, errorCallback, options) {
			$.ajax_query("forgetpw/one", {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			})
		},
		/**
		 * 重置交易密码
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		forgetpwTwo: function(data, successCallback, errorCallback, options) {
			$.ajax_query("forgetpw/two", {
				data: data,
				type: 'post',
				success: successCallback,
				error: errorCallback
			})
		},
		/**
		 * 资金流水
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		banklist: function(data, successCallback, errorCallback, options) {
			$.ajax_query("bank/banklist", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},

		/*
		 * 首页－刷新登录状态
		 */
		refreshLogin: function(data, successCallback, errorCallback) {
			$.ajax({
				url: CONFIG.appRootUrl + "user/check",
				async: true,
				success: successCallback,
				error: errorCallback
			});
		},

		/**
		 * 消息删除
		 * @param {Object} data
		 * @param {Object} successCallback
		 * @param {Object} errorCallback
		 * @param {Object} options
		 */
		messageDelete: function(data, successCallback, errorCallback, options) {
			$.ajax_query("message/delete", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		userInfo: function(data, successCallback, errorCallback, options) {
			$.ajax_query("user/info", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		},
		messageReadAll: function(data, successCallback, errorCallback, options) {
			$.ajax_query("message/readAll", {
				data: data,
				success: successCallback,
				error: errorCallback
			});
		}

	};

})(mui, window);