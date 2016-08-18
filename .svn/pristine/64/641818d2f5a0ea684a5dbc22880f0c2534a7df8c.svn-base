/*
 * 承信预约
 */
(function($, doc, win) {
	/*
	 * 
	 */
	$.init();
	/*
	 * 
	 */
	$.ready(function() {

		var userId = null;
		var user = win.app.getState();

		if(user != null && typeof(user.userId) != 'undefined') {
			userId = user.userId;
		}

		var storeId = null;
		win.servicebus.getBespeakBespeak({
			userId: userId

		}, function(data) {

			new Vue({
				el: '#reserveAmountId',
				data: {
					reserveAmount: JSON.parse(data.bodyData)
				},
				methods: {
					sumbit: function() {

						var bespeakAmountcheck = /^(0|([1-9]\d*))(\.\d{1,6})?$/;
						var bespeakAmount = gel('billAmount').value;

						if(storeId == null) {
							return alert("请选择地区");
						}
						if(!bespeakAmountcheck.test(bespeakAmount)) {
							return alert("票面总额格式错误");
						}
						if(typeof(JSON.parse(data.bodyData).rule) == 'undefined') {
							return alert("不在预约时间");
						}

						win.servicebus.getBespeakIndex({
							userId: userId,
							storeId: storeId,
							bespeakRuleId: JSON.parse(data.bodyData).rule.id,
							bespeakAmount: bespeakAmount
						}, function(data) {

							if(data.returnCode == 100000) {
								alert("提交成功！待业务经理确认后享受优惠。您今天还有" + JSON.parse(data.returnMsg).number + "次(变量)预约机会。3s后自动跳转记录页");
								setTimeout(function() {
									mui.openWindow({
										url: 'reserverecordsindex.html',
										id: 'reserverecordsindex.html'
									});
								}, 30000);
							} else {
								alert(data.returnMsg);
							}

						});

					}

				}
			})
		});

		document.addEventListener('firmAddress', function(event) {
			storeId = event.detail.id;
			gel('address').innerHTML = event.detail.province;
		});

		document.addEventListener('billAmountAdd', function(event) {
			gel("billAmount").value = (parseFloat(event.detail.money) / 10000).toFixed(6);
		});

	});
}(mui, document, window));