var ClickOpen = (function() {
	var clickNode, //点击的按钮
		openNode, //点击之后弹出的框
		allowRoll, //是否允许弹出框出现时滚动body
		closeNodeArr;

	function init(data) {
		clickNode = data.clickNode;
		openNode = data.openNode;
		allowRoll = data.allowRoll;
		closeNodeArr = data.closeNode;
		initClickNode(clickNode);
		initcloseNodes(closeNodeArr);
	}

	function initClickNode(openNode) {
		addEvent(openNode, "click", showDialog)
	}

	function initcloseNodes(closeNodeArr) {
		for (var i = 0; i < closeNodeArr.length; i++) {
			closeNodeArr[i].setAttribute("data-id", "hide");
			addEvent(closeNodeArr[i], "click", hideDialog);
		}
	}

	function showDialog() {
		openNode.style.display = "block";
		if (!allowRoll) {
			 document.body.style.overflow = 'hidden';
		}
	}

	function hideDialog() {
		if (event.target && event.target.getAttribute("data-id") == "hide") {
			openNode.style.display = "none";
			 document.body.style.overflow = '';
		}
	}
	return {
		init: init
	}
});