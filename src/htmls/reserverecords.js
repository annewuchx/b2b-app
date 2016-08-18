/*
 * 
 */
(function($, doc, win) {

	var userInfo = win.app.getState();
	var userId = null;
	if (userInfo != null && typeof(userInfo.userId) != 'undefined') {
		userId = userInfo.userId;
	}

	var datas = [];
	var nowdate = "";
	var pageNum = 1;
	var resreords = new Vue({
		el: '#list',
		data: {
			reserveList: datas
		},
		methods: {
			close: function(id) {
				// 方法内 `this` 指向 vm
				win.servicebus.getBespeakCancle({
					id: id,
					userId: userId
				}, function(data) {
					if (data.returnCode == 100000) {
						alert('取消成功');
						pulldownRefresh();
					} else {
						alert('取消失败');
					}
				});
			}
		}
	});

	$.init({
		pullRefresh: {
			container: '#refreshContainer',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var table = document.body.querySelector('.refreshUl');
			//写一个json数据，ajax去请求，把他们依次插入Vue 的data数组的最前面去
			pageNum = 1;
			win.servicebus.getBespeakRecord({
				userId: userId,
				pageNum: pageNum
			}, function(data) {
				if (data.returnCode == 100000) {
					pageNum++;
					//console.log(JSON.stringify(data));
					//					datas = JSON.parse(data.returnMsg).recordList;
					//					console.log(JSON.stringify(datas));
					nowdate = JSON.parse(data.bodyData).date;
					var datalist = JSON.parse(data.bodyData).recordList;
					for (var i = 0, len = datalist.length; i < len; i++) {
						if (datalist[i].status == 2) {
							//console.log(datalist[i].protectionEndTime);
							var timestamp1 = Date.parse(new Date(datalist[i].protectionEndTime));
							var time = timestamp1 - timestamp2;

							var days = Math.floor(time / (24 * 3600 * 1000));
							//计算出小时数
							var leave1 = time % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
							var hours = Math.floor(leave1 / (3600 * 1000));
							//计算相差分钟数
							var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
							var minutes = Math.floor(leave2 / (60 * 1000));
							newDate.setTime(time);
							var endtime = hours + ":" + minutes;
							var datalistobj = datalist[i];
							datalistobj["time"] = endtime;
							datalist[i] = datalistobj;
							setInterval(function() {
								time = time - 1000;
								if (time != 0) {
									newDate.setTime(time);
									days = Math.floor(time / (24 * 3600 * 1000));
									//计算出小时数
									leave1 = time % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
									hours = Math.floor(leave1 / (3600 * 1000));
									//计算相差分钟数
									leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
									minutes = Math.floor(leave2 / (60 * 1000));
									//									console.log(newDate.getDate());
									endtime = hours + ":" + minutes;
								} else {
									endtime = "00:00";
								}
								datalistobj["time"] = endtime;
								datalist[i] = datalistobj;
							}, 1000);
						}
					}
					resreords.$set('reserveList', datalist);
				}
			});
			mui('#refreshContainer').pullRefresh().refresh(true);
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1500);
	}
	var count = 0;
	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			//参数为true代表没有更多数据了。
			var table = document.body.querySelector('.refreshUl');
			//写一个json数据，ajax去请求，把他们依次插入Vue 的data数组的最后面去
			win.servicebus.getBespeakRecord({
				userId: userId,
				pageNum: pageNum
			}, function(data) {
				if (data.returnCode == 100000) {
					pageNum++;
					mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
					nowdate = JSON.parse(data.bodyData).date;
					var timestamp2 = Date.parse(new Date(nowdate));
					var newDate = new Date();
					var datalist = JSON.parse(data.bodyData).recordList;
					for (var i = 0, len = datalist.length; i < len; i++) {
						if (datalist[i].status == 2) {
							//console.log(datalist[i].protectionEndTime);
							var timestamp1 = Date.parse(new Date(datalist[i].protectionEndTime));
							var time = timestamp1 - timestamp2;

							var days = Math.floor(time / (24 * 3600 * 1000));
							//计算出小时数
							var leave1 = time % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
							var hours = Math.floor(leave1 / (3600 * 1000));
							//计算相差分钟数
							var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
							var minutes = Math.floor(leave2 / (60 * 1000));
							newDate.setTime(time);
							var endtime = hours + ":" + minutes;
							var datalistobj = datalist[i];
							datalistobj["time"] = endtime;
							datalist[i] = datalistobj;
							setInterval(function() {
								time = time - 1000;
								if (time != 0) {
									newDate.setTime(time);
									days = Math.floor(time / (24 * 3600 * 1000));
									//计算出小时数
									leave1 = time % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
									hours = Math.floor(leave1 / (3600 * 1000));
									//计算相差分钟数
									leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
									minutes = Math.floor(leave2 / (60 * 1000));
									//									console.log(newDate.getDate());
									endtime = hours + ":" + minutes;
								} else {
									endtime = "00:00";
								}
								datalistobj["time"] = endtime;
								datalist[i] = datalistobj;
							}, 1000);
						}
						datas.push(datalist[i]);
					}
					if (datalist.length == 0) {
						mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
					}
				}
			});
		}, 1500);
	}
	if (mui.os.plus) {
		$.plusReady(function() {
			setTimeout(function() {
				mui('#refreshContainer').pullRefresh().pullupLoading();
			}, 1000);
		});
	} else {
		$.ready(function() {
			mui('#refreshContainer').pullRefresh().pullupLoading();
		});
	}
}(mui, document, window));