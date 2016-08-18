/*
 * 高亮显示
 */
define(function(require, exports, module) {

	function highlight(id, tag) {

		var targetNode = document.getElementById(id) || document.body;
		var hiliteTag = tag || "EM";
		var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM)$");
		var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
		var wordColor = [];
		var colorIdx = 0;
		var matchRegex = "";

		var openLeft = true;
		var openRight = true;

		this.setMatchType = function(type) {
			switch (type) {
				case "left":
					openLeft = false;
					thopenRight = true;
					break;
				case "right":
					openLeft = true;
					openRight = false;
					break;
				case "open":
					openLeft = openRight = true;
					break;
				default:
					openLeft = openRight = true;
			}
		};

		this.setRegex = function(input) {
			input = input.replace(/^\||\|$/ig, "");
			if (input) {
				var re = "(" + input + ")";
				if (!openLeft) re = "\\b" + re;
				if (!openRight) re = re + "\\b";
				matchRegex = new RegExp(re, "i");
				return true;
			}
			return false;
		};

		this.getRegex = function() {
			var retval = matchRegex.toString();
			retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
			retval = retval.replace(/\|/g, " ");
			return retval;
		};

		// recursively apply word highlighting
		this.hiliteWords = function(node) {
			if (node === undefined || !node) return;
			if (!matchRegex) return;
			if (skipTags.test(node.nodeName)) return;

			if (node.hasChildNodes()) {
				for (var i = 0; i < node.childNodes.length; i++)
					this.hiliteWords(node.childNodes[i]);
			}
			if (node.nodeType == 3) { // NODE_TEXT
				if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
					if (!wordColor[regs[0].toLowerCase()]) {
						wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
					}

					var match = document.createElement(hiliteTag);
					match.appendChild(document.createTextNode(regs[0]));
					//match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
					match.style.fontStyle = "inherit";
					match.style.color = "blue";

					var after = node.splitText(regs.index);
					after.nodeValue = after.nodeValue.substring(regs[0].length);
					node.parentNode.insertBefore(match, after);
				}
			};
		};

		// remove highlighting
		this.remove = function() {
			var arr = document.getElementsByTagName(hiliteTag);
			while (arr.length && (el = arr[0])) {
				var parent = el.parentNode;
				parent.replaceChild(el.firstChild, el);
				parent.normalize();
			}
		};

		// start highlighting at target node
		this.apply = function(input) {
			this.remove();
			if (input === undefined || !input) return;
			if (this.setRegex(input)) {
				this.hiliteWords(targetNode);
			}
		};

	}

	exports.highlight = highlight;

});