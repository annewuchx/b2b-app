/**
 * 用户消息
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {
	/**
	 * init
	 */
	$.init({
		beforeback: function() {
			var mainwv = plus.webview.getWebviewById('mainindex.html');
		
			$.fire(mainwv, 'RefreshPage');
			return true;
		}
	});

	/**
	 * 阻尼系数
	 */
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

	/**
	 * 循环初始化所有下拉刷新，上拉加载。
	 */
	var pindex = 1,
		firstResh = true,
		endPullup = false,
		messagedata = [],
		messageSys = [],
		message_vm,
		messageAct = [];
	lastdate = "";
	lastdate1 = "";
	lastdate2 = "";
	/**
	 * ready
	 */
	$.ready(function() {
		$('.mui-scroll-wrapper').scroll({
			indicators: false //是否显示滚动条
		});

		gel('allRead').addEventListener('tap', function() {

			var userObj = win.app.getState();

			var serchData = {
				userId: userObj.userId,
			};

			win.servicebus.messageReadAll(serchData, function() {
				service_getData(1);
			});

		})

		/**
		 * loading
		 */
		setTimeout(function() {
			$(".mui-loader")[0].style.display = "none";
			gel('refreshContainer').style.display = "block";
		}, 1000);

		/*
		 * 初始化 vue 数据绑定
		 * */
		message_vm = new Vue({
			el: '#refreshContainer',
			data: {
				messageSys: messageSys,
				messageAct: messageAct
			},
			computed: {
				messagedata: function() {
					return this.messageSys.concat(this.messageAct)
				}
			},
			methods: {
				getMessageDetal: fn_getMessageDetal,
				deleteMsg: fn_deleteMsg,
				time: listTime,
				sliceString: processEcllips,
				group: function(date1) {
					if(lastdate == date1) {
						return false;
					} else {
						lastdate = date1;
						return true;
					}
				},
				group1: function(date1) {
					if(lastdate1 == date1) {
						return false;
					} else {
						lastdate1 = date1;
						return true;
					}
				},
				group2: function(date1) {
					if(lastdate2 == date1) {
						return false;
					} else {
						lastdate2 = date1;
						return true;
					}
				}
			}
		});
		/**
		 * 获取数据
		 */
		service_getData(1);

		/**
		 * 三个 menue
		 */
		$.each(doc.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						pindex = 1;
						setTimeout(function() {
							service_getData(1);
							self.endPullDownToRefresh();
						}, 1000);

					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							if(!endPullup) {
								pindex++;
							}
							service_getData(pindex);
							self.endPullUpToRefresh(endPullup);
						}, 1000);

					}
				}
			});
		});
	});

	/**
	 *  初始化 获取message列表
	 */
	function service_getData(pNum) {
		lastdate = "";
		lastdate1 = "";
		lastdate2 = "";
		var userObj = win.app.getState();
		var serchData;
		if(typeof(userObj.userId) != 'undefined') {
			serchData = {
				userId: userObj.userId,
				pageNum: pNum
			};
			win.servicebus.messageIndex(serchData, fn_messageIndex);
		}
	}

	/**
	 * 处理上拉下拉的数据
	 * @param {Object} data
	 */
	function categoryData(data) {
		if(data && data.length > 0) { //message不为空
			$.each(data, function(index, item) {
				if(item.messageType == 1) { //活动消息
					messageAct.push(item);
				}
				if(item.messageType == 0) { //系统消息
					messageSys.push(item);
				}
			});

			message_vm.$set('messageSys', messageSys);
			message_vm.$set('messageAct', messageAct);
		}
	}

	/**
	 * 处理拉取的消息
	 * @param {Object} data
	 */
	function fn_messageIndex(data) {
		if(!data || !JSON.parse(data.bodyData)) {
			pindex--;
			$.toast('系统异常');
			return;
		}
		var msgObj = JSON.parse(data.bodyData);
		if(msgObj.msgList.length == 0) { // 没有更多的数据了

			endPullup = true;
			return;
		}
		if(msgObj.pageNum == 1 && firstResh) { //第一次 下拉 刷新
			firstResh = false;
			categoryData(msgObj.msgList)
			return;
		}

		if(msgObj.pageNum == 1 && !firstResh) { //非第一次 下拉 刷新
			messageSys = [];
			messageAct = [];
			categoryData(msgObj.msgList);
		} else { //上拉加载
			categoryData(msgObj.msgList);
			endPullup = false;
		}

	}

	/**
	 * 打开 detail页
	 * @param {Object} arr
	 * @param {Number} index
	 */
	function fn_getMessageDetal(arr, index) {
		arr[index].readFlag = 1; //消息 1 已读
		var self = this;
		var mid = arr[index].messageId;
		if(window.plus) {
			var detailPageView = plus.webview.getWebviewById('usermessagedetail.html');
			if(detailPageView) {
				handle_showDetail(detailPageView, mid);
			} else {
				//console.log('create method');
				detailPageView = plus.webview.create('usermessagedetail.html', 'usermessagedetail.html');
				detailPageView.onloaded = function() {
					handle_showDetail(detailPageView, mid);
				};
			}
		} else {
			$.openWindow('usermessagedetail.html', {
				extras: {
					mid: mid
				}
			});
		}
	}
	/**
	 * webview传值
	 * @param {Object} webview
	 * @param {String} mid
	 */
	function handle_showDetail(webview, mid) {
		$.fire(webview, 'refreshPage', {
			mid: mid
		});
		webview.show();
	}

	/**
	 * @description 时间
	 * @param {Object} t
	 */
	function listTime(t) {
		//t = "2016-06-07 18:17:02"
		var arrDate = t.split(' ')[0];
		var arrYYYYMMDD = arrDate.split('-');
		var time = arrYYYYMMDD[0] + "年" + arrYYYYMMDD[1] + "月" + arrYYYYMMDD[2] + "日";
		return time;
	}

	function processEcllips(text) {
		return text.substring(0, 50) + "...";

	}

	/**
	 * 消息删除
	 * @param {Object} msgId
	 */
	function fn_deleteMsg(msgId, dataId, type, liId) {
		var btnArray = ['取消', '确认'];
		mui.confirm('确认删除该条消息吗？', '银承库', btnArray, function(e) {
			if(e.index == 1) {
				win.servicebus.messageDelete({
					id: msgId
				}, function(data) {
					var liobj = gel(liId + dataId);
					liobj.setAttribute('class', 'mui-table-view-cell');
					liobj.firstElementChild.setAttribute('class', 'mui-slider-right mui-disabled');
					liobj.firstElementChild.firstElementChild.setAttribute('style', '');
					liobj.lastElementChild.firstElementChild.setAttribute('style', 'margin: 0px;');
					if(data.returnCode == 100000) {
						if(type == 1) { //活动消息
							messageAct.splice(dataId, 1);
						}
						if(type == 0) { //系统消息
							messageSys.splice(dataId, 1);
						}
						message_vm.$set('messageSys', messageSys);
						message_vm.$set('messageAct', messageAct);
						$.toast("删除成功");
					} else {
						$.toast("删除失败");
					}
				});
			} else {
				var liobj = gel(liId + dataId);
				liobj.setAttribute('class', 'mui-table-view-cell');
				liobj.firstElementChild.setAttribute('class', 'mui-slider-right mui-disabled');
				liobj.firstElementChild.firstElementChild.setAttribute('style', '');
				liobj.lastElementChild.firstElementChild.setAttribute('style', 'margin: 0px;');
			}
		});

	}

})(mui, document, window)

//fn_createDb();
//fn_insertDb();
function fn_createDb() {
	html5sql.openDatabase('com.yinchengku.appdb', 'this app database', 5 * 1024 * 1024);
	var strSQL = "";
	strSQL = "CREATE table if not exists messageTable (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT , showdate text not null,status text not null,title text not null,content text not null);"
	html5sql.process(strSQL, successCallback, errorCallback);
}
/*
 * 
 */
function fn_insertDb() {
	var dataSQL = "INSERT INTO messageTable (showdate,status,title,content) VALUES ('all2015年11月14日','1','您有一笔融资订单已打款','尊敬的客户，融资订单（*4565）的款项已经成功汇入对公账号（*234）该漫画叙述了一只来自22世纪的猫型机器人——哆啦A梦，受主人野比世修的托付，回到20世纪，借助从四维口袋里拿出来的各种未来道具，来帮助世修的高祖父——小学生野比大雄化解身边的种种困难问题');" +
		"INSERT INTO messageTable (showdate,status,title,content) VALUES ('all2015年11月14日','1','您有一笔融资订单已打款','尊敬的客户，融资订单（*4565）的款项已经成功汇入对公账号（*234）该漫画叙述了一只来自22世纪的猫型机器人——哆啦A梦，受主人野比世修的托付，回到20世纪，借助从四维口袋里拿出来的各种未来道具，来帮助世修的高祖父——小学生野比大雄化解身边的种种困难问题');" +
		"INSERT INTO messageTable (showdate,status,title,content) VALUES ('all2015年11月14日','1','您有一笔融资订单已打款','尊敬的客户，融资订单（*4565）的款项已经成功汇入对公账号（*234）该漫画叙述了一只来自22世纪的猫型机器人——哆啦A梦，受主人野比世修的托付，回到20世纪，借助从四维口袋里拿出来的各种未来道具，来帮助世修的高祖父——小学生野比大雄化解身边的种种困难问题');" +
		"INSERT INTO messageTable (showdate,status,title,content) VALUES ('all2015年11月14日','1','您有一笔融资订单已打款','尊敬的客户，融资订单（*4565）的款项已经成功汇入对公账号（*234）该漫画叙述了一只来自22世纪的猫型机器人——哆啦A梦，受主人野比世修的托付，回到20世纪，借助从四维口袋里拿出来的各种未来道具，来帮助世修的高祖父——小学生野比大雄化解身边的种种困难问题');";
	html5sql.process(dataSQL, successCallback, function() {
		console.info("inser into new data");
	});
	var selectSQL = "SELECT * FROM messageTable;"
	html5sql.process(selectSQL, function(transaction, results) {
		console.info('table', results);
	}, successCallback, errorCallback);
}
/*
 * 
 */
function successCallback() {
	//console.log('ok', arguments)
}
/*
 * 
 */
function errorCallback(error, statement) {
	//console.log('error', arguments)
}