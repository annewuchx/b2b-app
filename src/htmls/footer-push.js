/**
 * 消息推送处理 
 * @param {Object} win
 * @param {Object} $
 */

(function(win, $) {

	/**
	 * 
	 */
	$.plusReady(handlePlusReady);

	/**
	 * 
	 */
	function handlePlusReady() {

		//接受消息
		plus.push.addEventListener('receive', function(msg) {
			if (msg.aps) {
				alert('接收到在线APNS消息');
			} else {
				alert('接收到在线透传消息');
			}
			// 测试在线，透传消息，设置角标
			BadgeManager.setInc('order', 1);
		});

		// 清除订单角标
		//BadgeManager.removeBadgeNumber('order');

	}

})(window, mui);