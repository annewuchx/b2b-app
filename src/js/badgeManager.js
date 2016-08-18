/**
 * BadgeManager 静态类
 * 只需要关心对应业务的角标增长值，自动计算总的角标数，并设置App角标plus.runtime.setBadgeNumber
 * @author Peter Zhu
 * @version 1.0.0 build 201600712
 * Android - 2.2+ (支持): 目前仅支持小米(MIUI v5)，其它设备调用后无任何效果；
 * iOS - 4.3+ (支持): 应用需开启“Push Notifications”服务才生效。
 */
define(function(require, exports, module) {

	exports.BadgeManager = BadgeManager;

	function BadgeManager() {};

	/**
	 * 角标增长
	 * @param {String} key  键值
	 * @param {Number} step 增长值
	 */
	BadgeManager.setInc = function(key, step) {
		var key = "badge_" + key;
		var total_number = plus.storage.getItem("badge_total_number");
		var key_number = plus.storage.getItem(key);
		total_number = parseInt(total_number); // 字符串转数字
		key_number = parseInt(key_number);
		if (!key_number) key_number = 0;
		if (!total_number) total_number = 0;
		key_number = key_number + step;
		total_number = total_number + step;

		plus.storage.setItem(key, key_number.toString()); // 数字转字符串
		plus.storage.setItem("badge_total_number", total_number.toString());

		// 设置APP图标的角标
		plus.runtime.setBadgeNumber(total_number);
	}

	/**
	 * 角标减少
	 * @param {String} key  键值
	 * @param {Number} step 减少值
	 */
	BadgeManager.setDec = function(key, step) {
		var key = "badge_" + key;
		var total_number = plus.storage.getItem("badge_total_number");
		var key_number = plus.storage.getItem(key);
		total_number = parseInt(total_number);
		key_number = parseInt(key_number);
		if (!key_number) key_number = 0;
		if (!total_number) total_number = 0;
		key_number = key_number - step;
		total_number = total_number - step;

		if (key_number < 0) key_number = 0;
		if (total_number < 0) total_number = 0;

		plus.storage.setItem(key, key_number.toString());
		plus.storage.setItem("badge_total_number", total_number.toString());

		// 设置APP图标的角标
		plus.runtime.setBadgeNumber(total_number);
	}

	/**
	 * 根据key获取对应的角标值
	 * @param {String} key
	 */
	BadgeManager.getBadgeNumber = function(key) {
		var key = "badge_" + key;
		var key_number = plus.storage.getItem(key);
		key_number = parseInt(key_number);

		if (!key_number) key_number = 0;
		return key_number;
	}

	/**
	 * 删除key对应的角标值
	 * @param {String} key
	 */
	BadgeManager.removeBadgeNumber = function(key) {
		var key = "badge_" + key;
		var total_number = plus.storage.getItem("badge_total_number");
		var key_number = plus.storage.getItem(key);
		total_number = parseInt(total_number);
		key_number = parseInt(key_number);
		if (!key_number) key_number = 0;
		if (!total_number) total_number = 0;
		total_number = total_number - key_number;

		if (total_number < 0) total_number = 0;

		plus.storage.removeItem(key);
		plus.storage.setItem("badge_total_number", total_number.toString());

		// 设置APP图标的角标
		plus.runtime.setBadgeNumber(total_number);
	}
});