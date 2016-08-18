/**
 * 选择照片 拍摄照片
 * @param {Object} $
 * @param {Object} doc
 * @param {Object} win
 */

(function($, doc, win) {
	/**
	 * init
	 */
	$.init({
		beforeback: function() {

			mui('#picture').popover('hide'); //关闭actionsheet
			return true;
		}
	});
	/**
	 * global 
	 */
	var imgid = '',
		wid = '';

	/**
	 * 更换显示的照片
	 */
	$.ready(function() {
		mui.hideLoading();
		window.addEventListener('refreshPage', function(event) {

			imgid = event.detail.imgid;
			wid = event.detail.wid;

			var path = imgid == 'companyCardDetal' ? '../images/pj.png' : (imgid == 'legalFront' || imgid == 'selfFront') ? '../images/idf.png' : '../images/idb.png';
			gel('demoImg').setAttribute("src", path);
		});

		mui('body').on('shown', '.mui-popover', function(e) {

			gel('pictureGet').disabled = true;
		});
		mui('body').on('hidden', '.mui-popover', function(e) {

			gel('pictureGet').disabled = false;
		});

	});

	/**
	 * plus ready
	 */
	$.plusReady(function() {

		mui('body').on('tap', '.mui-popover-action li>a', function() {

			var self = this;
			var index = self.getAttribute('data-index');

			//actionsheet各按钮的作用
			handle_back(index);

		})
	});

	/**
	 * actionsheet callback
	 * @param {Object} e
	 */
	function handle_back(index) {

		//		var index = e.index;
		switch (parseInt(index)) {
			case 0:
				break;
			case 1:

				mui('#picture').popover('toggle'); //关闭actionsheet

				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(path) { //确定
					plus.io.resolveLocalFileSystemURL(path, function(entry) {
						fn_handlecapture(entry.toLocalURL());
					}, function(e) {
						$.toast("读取拍照文件错误：" + e.message);
					});
				}, function(err) { //取消
					gel('pictureGet').disabled = false;
					$.alert('打开相机错误');

				});
				break;
			case 2:

				mui('#picture').popover('toggle'); //关闭actionsheet

				plus.gallery.pick(function(path) {
					fn_handlecapture(path);
				}, function(err) {
					gel('pictureGet').disabled = false;
				}, null);
				break;
		}
	}
	/**
	 * 图片上传至后台服务器
	 * @param {String} imagepath
	 */
	function fn_handlecapture(imagepath) {
		mui.showLoading();
		createUpload(imagepath);
	}

	/**
	 * 触发 图片路劲
	 * @param {String} imagepath
	 * @param {String} upPath
	 */
	function fn_fireImgPath(imagepath, upPath) {
		var frontwv = function() {
			return plus.webview.getWebviewById(wid);
		}

		var obj = {
			path: imagepath,
			uploadPath: upPath,
			imgid: imgid
		}
		$.fire(frontwv(), 'imgPath', obj);
	}

	/**
	 * 上传图片 http://10.100.102.10:8080
	 * @param {String} imgurl
	 */
	function createUpload(imgurl) {
		var frontwv = function() {
			return plus.webview.getWebviewById(wid);
		};
		var upStatus = false;
		var cwv = plus.webview.currentWebview();

		var task = window.servicebus.imgUpload(function(t, status) {

			mui.hideLoading();

			upStatus = true;
			gel('pictureGet').disabled = false;
			if (status == 200) { // H5上传 callback 
				var data = t.responseText;
				var uploadPath = '';
				if (JSON.parse(data).returnCode == 100000) { // 后台上传成功则将图片地址返回
					$.toast('上传成功');

					uploadPath = JSON.parse(JSON.parse(data).bodyData).path[0];

					fn_fireImgPath(imgurl, uploadPath);
				} else { //后台上传失败   直接返回
					$.toast("上传失败");
				}

			} else { //H5 上传失败
				$.toast("Upload failed: " + status);

			}

			closeWebview();
		});

		//		var task = plus.uploader.createUpload("http://10.192.168.190:8080/app/common/upload", {
		//				method: "POST"
		//			},
		//			
		//		);
		task.addFile(imgurl, {
			key: "verifiedImgUploading"
		});
		task.addData("string_key", "string_value");
		task.start();
		//10s后接口没有反应 则关闭当前页，返回前一个页面
		setTimeout(function() {
			$.hideLoading();
			if (!upStatus) {
				task.pause();
				$.toast('网络不通');
				closeWebview();
			}

		}, 30000);
	}

	/**
	 * 关闭当前页面 显示前一页面
	 */
	function closeWebview() {
		var frontwv = function() {
			return plus.webview.getWebviewById(wid);
		};
		var cwv = plus.webview.currentWebview();
		gel('demoImg').setAttribute("src", "");
		cwv.close();
		frontwv().show();
	}

})(mui, document, window)