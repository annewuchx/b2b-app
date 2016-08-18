/**
 * 资源文件包－更新 
 * @param {Object} win
 */
(function(win, $) {

	//当前使用版本号
	var currentVer = null;

	// 下载资源包文件
	var wgtUrl = null,
		fullUrl = null;
	//var wgtUrl = "http://10.100.201.177:8020/yck.b2b.h5app.v1/unpackage/release/com.yinchengku.b2b.wgt";

	// 检测更新
	var checkUrl = CONFIG.appRootUrl + "about/androidVersion",
		checkUrl_IOS = CONFIG.appRootUrl + "about/appleVersion";

	/**
	 * 
	 */
	function plusReady() {

		if($.os.ios) {
			checkUrl = checkUrl_IOS;
		}

		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			currentVer = inf.version;
		});

		document.getElementById('btnCheckVersion').addEventListener('tap', function() {
			checkUpdate();
		});
	}

	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}

	/**
	 * 版本检查－是否更新？ [0=不更新, 1＝资源包, 2＝安装包]
	 * @param {Object} oldv
	 * @param {Object} newv
	 */
	function checkVersion(oldv, newv) {
		//判断版本－是大更新还是资源包更新？
		//version = x.y.z   ---  第一个版本为大版本，需要整个安装包更新，其余为资源包更新

		var isUpdate = 0;

		var arrOldv = oldv.split('.');
		var arrNewv = newv.split('.');

		if(oldv == newv) {
			isUpdate = 0;
		} else if(arrOldv.length != arrNewv.length || arrOldv[0] != arrNewv[0]) {
			isUpdate = 2;
		} else {
			isUpdate = 1;
		}

		return isUpdate;
	}

	/**
	 * check version
	 */
	function checkUpdate() {
		plus.nativeUI.showWaiting("检测更新...");
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {

			switch(xhr.readyState) {
				case 4:

					plus.nativeUI.closeWaiting();

					if(xhr.status == 200) {

						successCallback(xhr.responseText);

					} else {
						//console.log("检测更新失败！");
						plus.nativeUI.alert("检测更新失败！");
					}
					break;
				default:
					break;
			}
		}
		xhr.open('GET', checkUrl);
		xhr.send();
	}

	/**
	 * ajax 回调
	 * @param {Object} responseText
	 */
	function successCallback(responseText) {
		//{
		//"version": {
		//  "appSource": "3",
		//  "appType": "1",
		//  "context": "域名更改",
		//  "createTime": {
		//    "date": 23,
		//    "day": 6,
		//    "hours": 19,
		//    "minutes": 29,
		//    "month": 3,
		//    "nanos": 0,
		//    "seconds": 21,
		//    "time": 1461410961000,
		//    "timezoneOffset": -480,
		//    "year": 116
		//  },
		//  "createUser": 262,
		//  "deleteFlag": "0",
		//  "downloadUrl": "https://www.pgyer.com/FRh8",
		//  "id": 73,
		//  "version": "1.7.4"
		//}
		//}

		var checkObj = JSON.parse(responseText);

		var upgradeObj = JSON.parse(checkObj.bodyData).version;

		var newVer = upgradeObj.version;

		var downloadUrl = upgradeObj.downloadUrl;

		var arrUrls = downloadUrl.split(',');
		fullUrl = arrUrls[0];

		if(arrUrls.length > 1) {
			wgtUrl = arrUrls[1];
		}

		var checkStatus = checkVersion(currentVer, newVer);

		if(checkStatus == 0) {
			plus.nativeUI.alert("已是最新版本！");

		} else if(checkStatus == 1) {
			// 提示用户是否升级
			plus.nativeUI.confirm(upgradeObj.context, function(i) {
				if(0 == i.index) {
					//立即更新
					downWgt(); // 下载升级包

				}
			}, "更新资源包", ["立即更新", "取　　消"]);

		} else if(checkStatus == 2) {

			// 提示用户是否升级
			plus.nativeUI.confirm(upgradeObj.context, function(i) {
				if(0 == i.index) {
					//立即更新
					downloadFull();
				} else {
					//取　　消
				}
			}, "更新应用", ["立即更新", "取　　消"]);

		}
	}

	/**
	 * 下载完整安装包
	 */
	function downloadFull() {
		if(fullUrl != null && fullUrl.length > 0) {
			plus.runtime.openURL(fullUrl);
		} else {
			plus.nativeUI.alert("下载安装包失败，请重试！");
		}
	}

	/**
	 * 下载资源包文件 
	 */
	function downWgt() {

		plus.nativeUI.showWaiting("更新资源文件...");

		var dtask = plus.downloader.createDownload(wgtUrl, {
			//method:"GET",
			filename: "_doc/update/"
				//timeout: 120, //120s
				//retry: 3,
				//priority: 0,
				//retryInterval: 30 //30s
		}, completedCB);

		dtask.addEventListener("statechanged", onStateChanged, false);

		dtask.start();
		//暂停下载任务 
		//dtask.pause();
		//取消下载任务 
		//dtask.pause();

		/**
		 * DownloadStateChangedCallback
		 * @param {Object} download
		 * @param {Object} status
		 */
		function onStateChanged(download, status) {

			if(download.state == 4) {
				if(status == 404) {

					//console.log("wgt not exist");
					//plus.nativeUI.alert("下载升级包失败！");

				} else if(status == 200) {
					//console.log("file download ok=" + JSON.stringify(download));
				}
			}

			//console.log("onStateChanged=" + download.state + " status=" + status)
		}

		/**
		 * DownloadCompletedCallback 
		 * @param {Object} download
		 * @param {Object} status
		 */
		function completedCB(download, status) {

			if(status == 200) {
				//console.log("下载升级包成功：" + download.filename);
				installWgt(download.filename); // 安装wgt包
			} else {
				//console.log("下载升级包失败！");
				//plus.nativeUI.alert("下载升级包失败！");

				//资源包文件不存在,下载完整更新包
				//to do

				// 提示用户是否升级
				plus.nativeUI.confirm("下载升级包失败,请重新下载安装包！", function(i) {
					if(0 == i.index) {
						//立即更新
						downloadFull();
					}
				}, "下载升级包失败", ["立即更新", "取　　消"]);

			}
			plus.nativeUI.closeWaiting();
		}

	}

	/**
	 * 更新应用资源
	 * @param {Object} path
	 */
	function installWgt(path) {

		plus.nativeUI.showWaiting("安装资源包文件...");

		plus.runtime.install(path, {}, function() {

			plus.nativeUI.closeWaiting();

			//console.log("安装资源包文件成功！");

			plus.nativeUI.confirm("应用资源更新完成,是否重新打开应用?", function(e) {
				if(e.index == 0) {
					//console.log("确定重新打开应用！");
					plus.runtime.restart();
				}
			}, "确定重新打开应用?", ["确定", "取消"]);

			//			plus.nativeUI.alert("应用资源更新完成！", function() {
			//
			//				plus.runtime.restart();
			//
			//			});

		}, function(e) {

			plus.nativeUI.closeWaiting();

			//console.log("安装资源包文件失败[" + e.code + "]：" + e.message);

			var msg = e.message;

			if(e.code == -1205) {
				msg = "资源升级包版本已最新";
			}

			plus.nativeUI.alert("安装资源包文件失败[" + e.code + "]：" + msg);

		});
	}

})(window, mui);