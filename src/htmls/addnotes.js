(function($, doc, win) {

	var model_priceitem = null;
	var data_updateObj = null;
	/**
	 * -----由批量保价页面过来 infoQuote事件
	 */
	var pjid = "";

	/*
	 * 
	 */
	mui.ready(function() {

		window.addEventListener('infoQuote', function(event) {

			pjid = event.detail.pjid;

			//添加
			if((pjid == "" || pjid == null) && pjid != 0) {
				document.querySelector(".mui-title").innerHTML = "添加报价信息";
				document.getElementById("add-notes").value = "确认添加";
			} else {
				//修改
				document.querySelector(".mui-title").innerHTML = "修改报价信息";
				document.getElementById("add-notes").value = "确认修改";

				var updatepj = "pricebatch_updatepj";

				item = JSON.parse(localStorage.getItem(updatepj));

				data_updateObj = item;

				seajs.use('./controllers/price-item/main', function(model) {
					model.setData(item);
				});
			}
		});

		/**
		 * 
		 */
		seajs.config({
			base: "../"
		});

		seajs.use('./controllers/price-item/main', function(model) {

			model_priceitem = model;

			model.init(function(isvalid) {
				document.getElementById('add-notes').disabled = isvalid;
				document.getElementById('add-notes').classList.add("h-right-active");
			});

			model.money();
			/**
			 *  确认按钮----修改、添加
			 */
			document.getElementById('add-notes').addEventListener('tap', function() {

				var data = model.getData();
				var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{0,2})?$/;
				var boo = reg.test(data.parValue);
				if( !boo ){
					$.toast("票面金额有误");
					return;
				}
				
				//to do 
				var wv = plus.webview.currentWebview();
				var vm = wv.opener();

				mui.fire(vm, 'pjnewEvent', {
					pjid: pjid,
					bankType: data.bankType,
					enddate: data.endDate,
					parValue: data.parValue
				});

				wv.close();
				//model.resetForm();
			});

		});

	});

}(mui, document, window));