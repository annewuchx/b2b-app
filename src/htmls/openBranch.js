(function($, doc, win) {
	$.init();
	var branch_vm = {},
		originbranchlist = [];

	/**
	 * mui ready
	 */
	$.ready(function() {
		fn_filterKeyword(); //筛选关键字

		fn_icoClear(); //ico clear
	});

	/**
	 * plus ready
	 */
	$.plusReady(function() {

		fn_getBranchList(); //获取列表

		fn_passValue(); //向verified2传值

	})

	/**
	 * 
	 * @param {String} name
	 */
	var classSelector = function(name) {
		return '.' + $.className(name);
	};

	/**
	 * icon clear 
	 */
	function fn_icoClear() {

		$("#searchcontainer").on('tap', classSelector('icon-clear'), function() {
			$('.branchListContainer-empty-alert')[0].style.display = 'none';
			bank_vm.$set('branchlist', originbranchlist);

		}, false);
	}

	/**
	 *  关键字搜索帅选
	 */
	function fn_filterKeyword() {

		var el_muiSearchBranch = gel('muiSearchBranch');
		el_muiSearchBranch.addEventListener('input', function() {
			var keyword = this.value.toLowerCase();
			branchlist1 = originbranchlist.filter(function(item) {
				if (item != null && keyword) {
					return item.value.toLowerCase().indexOf(keyword) >= 0;
				} else {
					return false
				}
			})

			if (keyword == '') {
				$('.branchListContainer-empty-alert')[0].style.display = 'none';
				branch_vm.$set('branchlist', originbranchlist);
			} else {
				if (branchlist1 == null || branchlist1.length == 0) {
					$('.branchListContainer-empty-alert')[0].style.display = 'block';
					branch_vm.$set('branchlist', []);
				} else {
					$('.branchListContainer-empty-alert')[0].style.display = 'none';
					branch_vm.$set('branchlist', branchlist1);
				}
			}
		}, false)
	}

	/**
	 * 请求 获取branchlist
	 */
	function fn_getBranchList() {
		mui.showLoading(); //loading
		var cwv = plus.webview.currentWebview();
		win.servicebus.getSubbanksSubname({
			areaId: cwv.cid,
			payBankType: cwv.bid
		}, fn_setBranchList,function (){
			$.hideLoading();
			document.querySelector('.branchListContainer-empty-alert').style.display = 'block';
		});
	}

	/**get branch list
	 * successcallback
	 * @param {Object} data
	 */
	function fn_setBranchList(data) {
		mui.hideLoading(); //隐藏loading
		originbranchlist = JSON.parse(data.bodyData).subBanks;
		if (originbranchlist.length == 0) {
			document.querySelector('.branchListContainer-empty-alert').style.display = 'block';
			return;
		}
		fn_fillBranchData(originbranchlist)

	}
	/**
	 * vue    填充数据
	 * @param {Object} list
	 */
	function fn_fillBranchData(list) {
		branch_vm = new Vue({
			el: '#branchListContainer',
			data: {
				branchlist: list
			}
		});
	}
	/**
	 * 向企业认证2 传数据
	 */
	function fn_passValue() {
		var cwv = plus.webview.currentWebview();
		$('#branchListContainer').on('tap', 'a', function() {
			var self = this;
			var frontwv = plus.webview.currentWebview().opener();
			cwv.close();
			$.fire(frontwv, 'branchEvent', {
				branch: self.innerText,
				branchid: self.getAttribute('branch-id')
			});
			frontwv.show();
		})
	}

})(mui, document, window)