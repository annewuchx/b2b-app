/*
 * 
 */
(function($, doc, win) {
	/*
	 *	init
	 */
	$.init();

	/**
	 * document.querySelector 的缩写
	 * @param {Object} name
	 */
	function dQS(name) {
		return doc.querySelector(name);
	}

	/**
	 * mui ready
	 */
	$.ready(function() {

		$.hideLoading();

		var dpr = parseInt(document.getElementsByTagName("html")[0].getAttribute("data-dpr"));

		gel('btn-wrap').style.marginTop = document.body.clientHeight - gel("header").clientHeight - gel("legalContainer").clientHeight - gel("cardSelfContainer").clientHeight - gel("btn-wrap").clientHeight - 20 * dpr + "px";

		/**
		 * 是否为企业法人 switcher 控制
		 */
		dQS('.verified-switch').addEventListener('toggle', function(event) {
			dQS('.self-container').style.display = (event.detail.isActive ? 'block' : 'none');

			if(event.detail.isActive) {
				gel('btn-wrap').style.marginTop = 30 * dpr + "px";
			} else {

				gel('btn-wrap').style.marginTop = document.body.clientHeight - gel("legalContainer").clientHeight - gel("header").clientHeight - gel("cardSelfContainer").clientHeight - gel("btn-wrap").clientHeight - 20 * dpr + "px";

			}

		});

	});

	/**
	 * plus ready
	 */
	$.plusReady(function() {

		var uploadName, currentDom, originPath, containerSizeObj = {},
			imgSizeObj = {};

		//certificates 0  juristicRight 1   juristicLeft 2  cardRight 3     cardLeft 4
		var imgUploadPathObj = {

		};

		var cwv = plus.webview.currentWebview();

		if(typeof(cwv.webviewId) == 'undefined') { /* from reg.html 隐藏mui-back button*/

			var fa_dom = dQS('.verify_header');
			var son_dom = dQS('a.mui-verified-back');
			fa_dom.removeChild(son_dom);
		}
		/**
		 * 监听重选图片
		 */
		document.addEventListener('changeImg', function(event) {

			var pathKey = event.detail.imgid;
			imgUploadPathObj[pathKey] = event.detail.uploadImgPath;

			originPath = event.detail.trueNewImgPath

			currentDom = gel(event.detail.imgid);
			fillImg(event.detail.newImgPath);

		})

		/**
		 * capture
		 */
		$('div.mui-content').on('tap', '.yck-event-addimg', function(event) {

			containerSizeObj.width = this.clientWidth;

			containerSizeObj.height = this.clientHeight;

			uploadName = this.id;

			currentDom = this;

			var self = this;

			var captureImg = self.querySelector(".captureImg");
			if(captureImg) {
				displayFile(captureImg);
			} else {
				$('#picture').popover('toggle');

			}

		}, false)

		//actionsheet handle

		$('body').on('tap', '.mui-popover-action li>a', function() {

			var self = this;
			var index = self.getAttribute('data-index');

			handle_back(index);

		})

		fn_goToNextPage(); //next page

		fn_notGoToReg(); //not reg 

		/**
		 * 在列表中展示图片缩略图
		 * @param {Object} self
		 * @param {String} entry
		 */
		function fillImg(entry) {
			currentDom.innerHTML = '';

			var img = doc.createElement("img");
			img.setAttribute('class', 'captureImg captureImgBg');
			img.setAttribute('src', entry);
			img.alias = uploadName;
			img.entry = entry;
			img.originPath = originPath;
			currentDom.appendChild(img);

		}

		/**
		 * actionsheet callback
		 * @param {String} index
		 */
		function handle_back(index) {

			switch(parseInt(index)) {
				case 0:
					break;
				case 1:

					$('#picture').popover('toggle'); //关闭actionsheet

					if($.os.ios) {
						var AVCaptureDevice = plus.ios.importClass("AVCaptureDevice");
						var Status = AVCaptureDevice.authorizationStatusForMediaType("vide");
						if(3 != Status) {
							var btnArray = ['确定'];
							$.confirm('您的相机权限未打开，请在当前应用设置-隐私-相机来打开权限', '', btnArray, function(e) {
								plus.runtime.openURL('prefs:root=Privacy');
							});

						} else {
							fn_captureImg();
						}
					}

					if($.os.android) {

						fn_captureImg();

					}

					break;

				case 2:

					$('#picture').popover('toggle'); //关闭actionsheet

					plus.gallery.pick(function(path) {

						$.showLoading();

						createUpload(path);

					}, function(err) {
						sys_permission(err);

					}, null);
					break;
			}
		}

		/**
		 * 相册权限控制
		 * @param {Object} e
		 */

		function sys_permission(e) {
			if(plus.os.name == "iOS") {
				if(e.code == 8) {
					mui.alert("您的相册权限未打开，请在当前应用设置-隐私-相册来打开权限", function() {
						plus.runtime.openURL('prefs:root=Privacy');
					})
				}
			} else if(plus.os.name == "Android") {
				if(e.code != 12) {
					mui.alert("您的相册权限未打开，请在应用列表中找到您的程序，将您的权限打开", function() {
						var android = plus.android.importClass('com.android.settings');
						var main = plus.android.runtimeMainActivity();
						var Intent = plus.android.importClass("android.content.Intent");
						var mIntent = new Intent('android.settings.APPLICATION_SETTINGS');
						main.startActivity(mIntent);
					});
				}
			}
		};

		/**
		 * 拍照片
		 */
		function fn_captureImg() {
			var cmr = plus.camera.getCamera();
			cmr.captureImage(function(path) { //确定
				plus.io.resolveLocalFileSystemURL(path, function(entry) {

					plus.gallery.save(entry.toLocalURL(), function() {
						
					});

					$.showLoading();

					createUpload(entry.toLocalURL());
				}, function(e) {
					$.toast("读取拍照文件失败");
				});
			}, function(err) { //取消
				
			});

		}

		//缩放图片
		function zoomImage(path) {
			var index = path.lastIndexOf('.');
			var newPath = path.substr(0, index) + '_compress' + (new Date()).valueOf() + path.substr(index);

			plus.zip.compressImage({
					src: path,
					dst: newPath,
					quality: 100,
					width: containerSizeObj.width + "px" // 
				},
				function(event) {
					imgSizeObj = {
						width: event.width,
						height: event.height
					};
					clipImage(event.target);

				},
				function(error) {
					$.toast('获取图片失败!');
				});
		}

		/**
		 *压缩图片
		 * @param {String} path
		 */

		function compressImage(path) {

			var index = path.lastIndexOf('.');
			var newPath = path.substr(0, index) + '_compress' + (new Date()).valueOf() + path.substr(index);

			plus.zip.compressImage({
					src: path,
					dst: newPath,
					quality: 40
				},
				function(event) {

					imgSizeObj = {
						width: event.width,
						height: event.height
					}

					clipImage(event.target);

				},
				function(error) {
					$.toast("获取图片失败!");
				});
		}

		/**
		 * 裁剪图片
		 * @param {String} path
		 */
		function clipImage(path) {

			var obj = {};

			var index = path.lastIndexOf('.');
			var newPath = path.substr(0, index) + '_clip' + (new Date()).valueOf() + path.substr(index);

			if(imgSizeObj.height > containerSizeObj.height) {
				var hh = parseFloat((containerSizeObj.height / imgSizeObj.height).toFixed(2));

				var topRatio = parseFloat((1 - hh) / 2).toFixed(2) * 100 + '%';

				obj = {

					height: containerSizeObj.height + 'px',
					width: imgSizeObj.width + 'px',

					top: topRatio
				}

			} else {
				obj = {
					height: containerSizeObj.height + 'px',
					width: imgSizeObj.width + 'px',
				}
			}

			plus.zip.compressImage({
					src: path,
					dst: newPath,
					clip: obj
				},
				function(event) {
					$.hideLoading();
					fillImg(event.target);
				},
				function(error) {
					$.toast("获取图片失败!");
				});
		}

		/**
		 * 上传图片 
		 * @param {String} imgurl
		 */
		function createUpload(imgurl) {

			var upStatus = false;

			var task = window.servicebus.imgUpload(function(t, status) {

				upStatus = true;

				if(status == 200) { // H5上传 callback 

					var data = t.responseText;

					var uploadPath = '';

					if(JSON.parse(data).returnCode == 100000) { // 后台上传成功则将图片地址返回

						originPath = imgurl;
						imgUploadPathObj[uploadName] = JSON.parse(JSON.parse(data).bodyData).path[0];

						zoomImage(imgurl)

					} else { //后台上传失败   直接返回
						$.toast("上传失败");
					}

				} else { //H5 上传失败
					$.toast("上传失败");

				}

			});

			task.addFile(imgurl, {
				key: "verifiedImgUploading"
			});
			task.addData("string_key", "string_value");
			task.start();

			setTimeout(function() { //20s后接口没有反应 则关闭当前页，返回前一个页面

				//				$.hideLoading();
				if(!upStatus) {
					task.pause();
					$.toast('无法连接网络');
					return;

				}

			}, 20000);
		}

		/**
		 * get img dom
		 * @param {String} name
		 */

		function isImgNull(name) {
			var faDom = gel(name);
			return faDom.querySelector('.captureImg');
		}

		/*
		 * next page
		 */
		function fn_goToNextPage() {
			gel("nextStep").addEventListener('tap', function() {

				var cwv = plus.webview.currentWebview();
				//判断企业执照  法人身份证是否已填
				if(!isImgNull('certificates')) {
					$.toast('请添加企业营业执照');
					return;
				}
				//准备数据 imgUploadPathObj  0否 1是 企业法人
				imgUploadPathObj.legalFlag = (dQS('.verified-switch').classList.contains('mui-active') ? '1' : '0');
				var url = 'verifiedstep2.html';

				var fwvid = (typeof(cwv.webviewId) != 'undefined' && cwv.webviewId != null) ? cwv.webviewId : '';

				var params = {
					webviewId: fwvid,
					imgUpPath: imgUploadPathObj
				};

				fn_jumpToNext(url, params);

			});
		}

		/*
		 * not reg
		 */
		function fn_notGoToReg() {
			var cwv = plus.webview.currentWebview();
			gel("notReg").addEventListener('tap', function() {

				if(typeof(cwv.webviewId) != 'undefined' && cwv.webviewId != null) {

					//从我的/更多过来   关闭当前页
					cwv.close();

				} else { //从注册过来
					$.fire($.WVFooter(), 'gohome');
					$.toMain();
					$.closeWin();
				}
			});
		}

		/**
		 * 跳到 verifiedstep2
		 * @param {String} url
		 * @param {Object} data
		 * @param {Boolean} status
		 */
		function fn_jumpToNext(url, data) {

			var ws = plus.webview.currentWebview();

			$.openWindow({
				url: url,
				id: url,
				extras: data
			});

		}

		/**
		 * 在verifiedimg 展示图片
		 * @param {Object} img
		 */
		function displayFile(img) {
			var cwv = plus.webview.currentWebview();
			var name = img.entry.name;

			if(window.plus) {

				var url = 'verifiedimg.html';
				var data = {
					imgid: img.alias,
					wid: cwv.id,
					containerSizeObj: JSON.stringify(containerSizeObj)
				};
				fn_jumpToNext(url, data)

			} else {
				alert('暂时不支持H5');
			}

			cw = plus.webview.getWebviewById(url);
			cw.addEventListener("loaded", function() {
				cw.evalJS("loadMedia('" + img.originPath + "')");

			}, false);
			cw.addEventListener("close", function() {
				cw = null;
			}, false);
		}

	});

})(mui, document, window)