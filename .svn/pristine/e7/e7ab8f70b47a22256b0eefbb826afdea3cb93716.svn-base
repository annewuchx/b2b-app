(function($, model) {

	var ui = gel('withdraw-submit');

	var mask = mui.createMask();

	/**
	 * modal show
	 * @param {Object} callback
	 */
	model.show = function(callback) {
		mask.show();
		model.callback = callback;
		ui.classList.add('active');
		//处理物理返回键
		model.__back = mui.back;
		mui.back = function() {
			model.hide();
		};
	};
	/**
	 * modal hide
	 */
	model.hide = function() {
		ui.classList.remove('active');
		mask.close();
		model.callback = null;
		//处理物理返回键
		mui.back = model.__back;
	};
	/**
	 * 点击遮罩层
	 */
	mask[0].addEventListener('tap', function() {
		model.hide();
	}, false);

	/**
	 * 
	 * @param {Object} title
	 */
	model.init = function(title) {
		var title = title;
		/**
		 * 提现  modal 数据绑定
		 */
		new Vue({
			el: "#withdraw-submit",
			data: title
		});
	}

})(mui, window.pw_unit = {});