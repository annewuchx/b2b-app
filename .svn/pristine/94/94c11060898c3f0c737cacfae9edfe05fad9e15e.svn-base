(function($, doc, win) {
	$.init({});

	$.ready(function() {
		/**
		 * 监听 获取消息id
		 */
		win.addEventListener('refreshPage', function(event) {
			win.servicebus.messageEdit({
				id: event.detail.mid
			}, fn_getMessageDetail);
		});
		/**
		 * 获取消息详情
		 * @param {Object} data
		 */

		function fn_getMessageDetail(data) {
			var msgDetail = JSON.parse(data.bodyData).message[0];
			msgDetail.createTime = fn_formatDate(msgDetail.createTime);
			var html = '';
			html += '<p style="margin:25px 0 10px 0;padding:0px 15px;font-size:17px;color:rgb(51,51,51);">' + msgDetail.title + 
			'</p><h4 style="padding-bottom:15px;margin:0px 15px;font-weight:300;font-size:15px;'+
			'color:#888888;">' + msgDetail.createTime + '</h4>'+
			'<p style="padding:15px;font-size:15px;'+
			'font-weight:300;color:#888888;word-break:break-all;">' + msgDetail.message + '</p>';

			doc.querySelector('.mui-content').innerHTML = html;
		}

		/**
		 * 日期格式化
		 * @param {Object} str
		 */
		function fn_formatDate(str) {
			return str.slice(0, 4) + '年' + str.slice(5, 7) + '月' + str.slice(8, 10) + '日';
		}
	});
})(mui, document, window);