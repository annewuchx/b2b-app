/*
 * 
 */
(function($, doc, win) {
	/*
	 * 
	 */
	$.init();

	mui.ready(function() {
		//登陆信息
		var userinfo = win.app.getState();

		initializationData();

		/*
		 * 初始化方法
		 */
		function initializationData() {

			if(userinfo != null && userinfo.userId != null) {

				var userId = userinfo.userId;
				win.servicebus.userInfo({
					userId: userId
				}, function(data) {
					if(data.returnCode != "100000") {
						mui.alert(data.returnMsg, '银承库', function() {});
					} else {
						if(data.bodyData != null) {
							var infoMessage = JSON.parse(data.bodyData).infoMessage;

							gel("uphone").innerHTML = infoMessage.mobile.substring(0, 3) + "****" + infoMessage.mobile.substring(7, 11); //replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
							gel("hPhone").value = infoMessage.mobile;
							gel("uemail").innerHTML = infoMessage.mail == "" ? "未绑定" : infoMessage.mail;
							gel("uCompany").innerHTML = infoMessage.authFlag == 0 ? infoMessage.companyName : infoMessage.mobile;

							if(infoMessage.authFlag == 0) {
								gel("myimg").style.display = "inline";
								gel("rzbtn").style.display = "none";
								gel("jymm").style.display = "block";
							} else {
								gel("myimg").style.display = "none";
								gel("rzbtn").style.display = "block";
								gel("jymm").style.display = "none";
								if(infoMessage.authFlag == 1) {
									gel("rzhtml").innerHTML = "未认证";
								} else if(infoMessage.authFlag == 2) {
									gel("rzhtml").innerHTML = "重新认证";
								} else {
									gel("rzhtml").innerHTML = "认证中";
									gel("rzhtml").disabled = "disabled";
								}
							}

							if(infoMessage.mail == "") {
								gel("uemail").style.color = "rgb(204,204,204)";
							} else {
								gel("uemail").style.color = "rgb(51,51,51)";
							}
						} else {
							mui.toast('服务器异常');
						}
						//							gel("utype").style.opacity = infoMessage.authFlag == 0 ? '1' : '0';

					}

					setTimeout(function() {
						mui.hideLoading();
					}, 600);
				}, function() {
					mui.hideLoading();
				})
			} else {
				mui.hideLoading();
			}
		};

		//忘记交易密码
		gel('jymm').addEventListener('tap', function(event) {
			var phone = gel("hPhone").value;
			$.openWindow({
				id: 'userfogotpwd.html',
				url: 'userfogotpwd.html',
				show: {
					aniShow: 'pop-in'
				},
				extras: {
					phone: phone
				}
			});
		});
		//退出登录
		gel('escLongin').addEventListener('tap', function(event) {
			var btnArray = ['否', '是'];
			$.confirm('退出当前用户，确认？', '退出', btnArray, function(e) {
				if(e.index == 1) {
					win.app.setState(null);
					localStorage.setItem("userIndex_accountOwnercash", "");
					$.toast('已退出');
					$.toMain();
					$.RefreshAllOpenPage();
					mui.closeWin();
				} else {
					//console.log('cancel');
				}
			})
		});
		
		gel('rzhtml').addEventListener('tap',function(event){
			mui.openWindow({
				id: 'verifiedstep1.html',
				url: 'verifiedstep1.html',
				extras: {
					webviewId: "userotherinfo.html"
				}
			});
		});
	})
})(mui, document, window);