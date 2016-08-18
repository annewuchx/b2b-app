/**
 * 票据资产
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {
	$.init({
		//		preloadPages: [{
		//			url: 'userpjpicture.html',
		//			id: 'userpjpicture.html'
		//		}],
		//		preloadLimit: 5
	});

	/**
	 * 价格查询参数   modal
	 */
	var priceRanges = [{
		text: '10万以内',
		value: "0"
	}, {
		text: '10-20万',
		value: "10"
	}, {
		text: '20-30万',
		value: "20"
	}, {
		text: '30-50万',
		value: "30"
	}, {
		text: '50-100万',
		value: "50"
	}, {
		text: '100-500万',
		value: "100"
	}, {
		text: '500万以上',
		value: "500"
	}];

	/**
	 * 日期查询参数  modal
	 */
	var dateRages = [{
		text: '0-3个月',
		value: "1"
	}, {
		text: '4-6个月',
		value: "2"
	}];

	/**
	 * 类型查询参数
	 */
	var typeRanges = [{
		text: '国股银行',
		value: "1"
	}, {
		text: '城商银行',
		value: "2"
	}, {
		text: '农商外资',
		value: "3"
	}, {
		text: '农合农信',
		value: "4"
	}, {
		text: '村镇银行',
		value: "5"
	}];

	/**
	 * 状态查询参数  modal
	 */
	var statusRanges = [{
		text: '可用',
		value: "0"
	}, {
		text: '融资中',
		value: "1"
	}, {
		text: '托收中',
		value: "2"
	}];

	$.ready(function() {

		var userObj = win.app.getState();
		var piaojuTotalPage = [],
			filterConditions = {};
		var ui = gel('filterPj');
		




		/**
		 * vue 实例化
		 */
		var bill_vm = new Vue({
			el: "#filterPj",
			data: {
				statusRanges: statusRanges,    //modal
				dateRages: dateRages,     //modal
				priceRanges: priceRanges,    //modal
				typeRanges: typeRanges     //modal
			},
			methods: {
				ok: fn_getFilterBill,     //modal   确定
				cancle: fn_cancleModal,     //modal   取消
				resetConditions: fn_resetConditions,   //modal 重置
				multiSelectConditions: fn_multiSelectConditions,     //modal   多选
			}
		});



		/**
		 * 重置modal
		 */
		function fn_resetConditions() {
			fn_clearFilterModal();
		}
		/**
		 * 取消modal
		 */
		function fn_cancleModal() {
			
			var current = plus.webview.currentWebview();
			current.hide();
			
		}

		/**
		 * 过滤条件多选
		 * @param {Object} event
		 */
		function fn_multiSelectConditions(event) {
			var self = event.target;
			if(self.classList.contains('active')) {
				self.classList.remove('active');
			} else {
				self.classList.add('active');
			}
		}

		
		/**
		 * 根据类名获取对应active标签的值
		 * @param {String} className
		 */
		function fn_getFilterKeyword(className) {
			var lidom = dQSall(className);
			var arr = [];
			for(var i = 0; i < lidom.length; i++) {
				var self = lidom[i];
				if(self.classList.contains('active')) {
					arr.push(self.getAttribute('data-value'))
				}
			}
			return arr.join();
		}

		/**
		 * 
		 * @param {String} name
		 */

		function dQS(name) {
			return doc.querySelector(name);
		}

		/**
		 * 
		 * @param {String} name
		 */
		function dQSall(name) {
			return doc.querySelectorAll(name);
		}



		/**
		 * get filter result
		 */
		function fn_getFilterBill() {

			//筛选条件清空
			filterConditions = {};


			//获取选中的参数
			var startDate = fn_getFilterKeyword('.due-date li');

			var bankType = fn_getFilterKeyword('.bank-type li');
			var orderStatus = fn_getFilterKeyword('.order-status li');
			var amount = fn_getFilterKeyword('.bill-money li');
			filterConditions.startDate = startDate;

			filterConditions.bankType = bankType;
			filterConditions.orderStatus = orderStatus;
			filterConditions.amount = amount;

			//trigger frontPage  param: filterConditions

			
			
			var webview = plus.webview.getWebviewById('userpjlistsubpage.html');
			var webview1 = plus.webview.getWebviewById('userpjlist.html');
			if(webview == null) {
				webview = plus.webview.create('userpjlistsubpage.html', 'userpjlistsubpage.html');
				webview.onloaded = function() {
					mui.fire(webview, 'pjsxEvent', {
						filterConditions: filterConditions
					});
					plus.webview.show(webview1, "pop-in");
				};
			} else {
				mui.fire(webview, 'pjsxEvent', {
					filterConditions: filterConditions
				});
				plus.webview.show(webview1, "pop-in");
			}

		};

		/**
		 * 退出modal 选择条件清0
		 */
		function fn_clearFilterModal() {
			var btnLists = dQSall('.time-pick button');
			$.each(btnLists, function(index, item) {
				item.innerHTML = '请选择时间';
			})
			var activeList = dQSall('.filter-pj .active');
			$.each(activeList, function(index, item) {
				item.classList.remove('active');
			})
		}


	})

})(mui, document, window);