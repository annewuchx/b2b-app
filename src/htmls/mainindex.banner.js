/*
 * 
 */
define(function(require, exports, module) {
	var arrList = [];
	var arrList2 = [];
	var arrListLength = 0;
	var arrListNum = 0; //banner list number
	var mainIndexImagePath = "_downloads/yck/image/";
	var mainIndexImageList = [];
	var $ = mui;

	exports.init = function() {
		loadBanner();
	};

	/*
	 * 加载轮播图
	 */
	function loadBanner() {
		$.ajax_query("homePage/index", {
			success: function(data) {
				if(data.returnCode != "100000") {
					renderBanner(null);
				} else {
					if(data.bodyData != null) {
						var returnMsg = JSON.parse(data.bodyData);
						renderBanner(returnMsg.image);
					} else {
						mui.toast('服务器异常');
					}

				}
			},
			error: function(xhr, type, errorThrown) {
				renderBanner(null);
			}
		});
	}

	/*
	 * 
	 */
	function renderBanner(list) {
		var template = '<div class="mui-slider-item"><a href="javascript:;"><img data-lazyload="{0}" src="{0}"></a></div>';

		var template2 = '<div class="mui-indicator"></div>';
		if(list == null || list.length　 == 0) {
			var imageLists = plus.storage.getItem(window.resources.keys.mainIndexPath);
			
			if(imageLists != null) {
				imageLists = JSON.parse(imageLists);
				arrListLength = imageLists.length;
				for(var i = 0, l = imageLists.length; i < l; i++) {
					arrList.push("");
					arrList2.push("");
				}
				for(var i = 0; i < imageLists.length; i++) {
					setImgFromLocal(imageLists[i],i+1);
				}
			}

		} else {
			arrListLength = list.length;
			for(var i = 0, l = list.length; i < l; i++) {
				arrList.push("");
				arrList2.push("");
			}
			for(var i = 0, l = list.length; i < l; i++) {
				setImg(list[i],i+1);
			}
		}

	}

	/**
	 * 设置图片
	 * 1.从本地获取,如果本地存在,则直接设置图片
	 * 2.如果本地不存在则联网下载,缓存到本地,再设置图片
	 * @param {Object} loadUrl
	 */
	function setImg(loadUrl,order) {

		if(loadUrl == null) return;

		//图片下载成功 默认保存在本地相对路径的"_downloads"文件夹里面, 如"_downloads/logo.jpg"

		var filename = loadUrl.substring(loadUrl.lastIndexOf("/") + 1, loadUrl.length);
		var relativePath = mainIndexImagePath + filename;
		//检查图片是否已存在
		plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
			//如果文件存在,则直接设置本地图片
			setImgFromLocal(relativePath,order);
		}, function(e) {
			//如果文件不存在,联网下载图片
			setImgFromNet(loadUrl, relativePath,order);
		});

	}

	/*
	 * 给图片标签<img>设置本地图片
	 * relativePath 本地相对路径 例如:"_downloads/logo.jpg"
	 */
	function setImgFromLocal(relativePath,order) {
		arrListNum++;
		mainIndexImageList.push(relativePath);
		var template = '<div class="mui-slider-item"><a href="javascript:;"><img data-lazyload="{0}" src="{0}"></a></div>';

		var template2 = '<div class="mui-indicator"></div>';
		//本地相对路径("_downloads/logo.jpg")转成SD卡绝对路径("/storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/logo.jpg");
		var sd_path = plus.io.convertLocalFileSystemURL(relativePath);
		//给<img>设置图片

		if(order == 1) {
			template = '<div class="mui-slider-item mui-active"><a href="javascript:;"><img data-lazyload="{0}" src="{0}"></a></div>';
			template2 = '<div class="mui-indicator mui-active"></div>';
		}
		arrList[order-1]=(template.replace('{0}', sd_path).replace('{0}', sd_path));
		arrList2[order-1]=(template2);
		if(arrListLength == arrListNum) {
			document.querySelector('.mui-slider-group').innerHTML = arrList[arrList.length - 1].replace('mui-slider-item', 'mui-slider-item mui-slider-item-duplicate') + arrList.join('') + arrList[0].replace('mui-slider-item mui-active', 'mui-slider-item mui-slider-item-duplicate');
			document.querySelector('.mui-slider-indicator').innerHTML = arrList2.join('');

			mui('#slider').slider({
				interval: 6000
			});
			//回到第一张
			mui('#slider').slider().gotoItem(0);
			plus.storage.setItem(window.resources.keys.mainIndexPath, JSON.stringify(mainIndexImageList));
		}
	}

	/*
	 * 联网下载图片,并设置给img
	 */
	function setImgFromNet(loadUrl, relativePath,order) {
		//创建下载任务
		var dtask = plus.downloader.createDownload(loadUrl, {
			filename: mainIndexImagePath,
			timeout: 10,
			retry: 0
		}, function(d, status) {
			if(status == 200) {
				//下载成功
				//				mainIndexImageList.push(d.filename);
				//				if(arrListLength == arrListNum) {
				//					plus.storage.setItem(window.resources.keys.mainIndexPath, JSON.stringify(mainIndexImageList));
				//				}
				setImgFromLocal(d.filename,order);
			} else {
				//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
				//dtask.abort();//文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
				if(relativePath != null)
					delFile(relativePath);
			}
		});
		//启动下载任务
		dtask.start();
	}

	/*
	 * 删除指定文件
	 */
	function delFile(relativePath) {
		plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
			entry.remove(function(entry) {}, function(e) {});
		});
	}

});