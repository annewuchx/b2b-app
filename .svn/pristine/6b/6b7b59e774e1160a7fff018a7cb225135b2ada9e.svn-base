/**
 * 资金流水
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */
(function($, doc, win) {
	var userinfo = win.app.getState();;
	var page = 0,
		dataList = [],
		lastdate = '';

	/**
	 * 
	 */
	$.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	/**
	 * 
	 */
	$.ready(function() {
		new Vue({
			el: ".mui-content",
			data: {
				billData: dataList
			},
			methods: {
				group: function(date1) {
					if(lastdate == date1) {
						return false;
					} else {
						lastdate = date1;
						return true;
					}
				},
			}
		});
	});

	/**
	 * 下拉刷新  每次清空列表
	 */
	function pulldownRefresh() {

		lastdate = '';
		dataList.splice(0, dataList.length);
		page = 0;

		//关闭“正在刷新”的雪花进度提示
		$('#pullrefresh').pullRefresh().endPulldownToRefresh();
		//可重置上拉加载控件
		$('#pullrefresh').pullRefresh().refresh(true);

		pullupRefresh();

	}

	/**
	 * 上拉加载   下拉刷新     发送请求 获取数据
	 */
	function pullupRefresh() {

		page++;
		var totalPages = 1;

		if(userinfo != null && typeof userinfo.userId != 'undefined') {
			var data = {
				userId: userinfo.userId,
				pageNum: page
			};

			window.servicebus.accountCashflow(data, function(data) {
				var msg = data.returnMsg;
				if(data.returnCode != "100000") {
					$.toast(msg)
				} else {
					totalPages = JSON.parse(data.bodyData).totalPages;
					updateDataList(data);
				}
			})
		}

	}

	/**
	 * 处理数据
	 * @param {Object} data
	 */
	function updateDataList(data) {

		if(data.bodyData == null || data.bodyData == '') {
			//可重置上拉加载控件
			$('#pullrefresh').pullRefresh().refresh(true);
			$('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			$.alert('服务器传输数据错误', '银承库');
			return;
		}

		var bData = JSON.parse(data.bodyData).cashDetail;

		if(bData.length > 0) {

			for(var i = 0; i < bData.length; i++) {
				var fDate = bData[i].tradeTime;
				//改变fDate的样式
				var newFdateMonth = parseInt(fDate.substring(5)) > 9 ? fDate.substring(5) : fDate.substring(6);
				var newFdate = fDate.substring(0, 4) + '年' + newFdateMonth + '月';
				var obj = {
					tradeDate: newFdate,
					notesList: [bData[i]]
				};
				dataList.push(obj);
			}

			setTimeout(function() {
				//可重置上拉加载控件
				$('#pullrefresh').pullRefresh().refresh(true);
				$('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			}, 200);

		} else {

			page--;
			//关闭“正在刷新”的雪花进度提示
			$('#pullrefresh').pullRefresh().endPulldownToRefresh();
			//没有更多数据
			$('#pullrefresh').pullRefresh().endPullupToRefresh(true);

		}
	}

	$.plusReady(function() {
		setTimeout(function() {
			$('#pullrefresh').pullRefresh().pullupLoading();
		}, 200);
	});

	//	//进入页面执行的代码------------------------------------------------------------------
	//	if($.os.plus) {
	//		$.plusReady(function() {
	//			setTimeout(function() {
	//				$('#pullrefresh').pullRefresh().pullupLoading();
	//			}, 1);
	//
	//		});
	//	} else {
	//		$.ready(function() {
	//			$('#pullrefresh').pullRefresh().pullupLoading();
	//		});
	//	}

}(mui, document, window));