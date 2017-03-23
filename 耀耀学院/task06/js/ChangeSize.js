var ChangeSize = (function() {
	var targetNode, //需要改变大小的DOM
		maxWidth, //可以变化的最大宽度
		minWidth, //可以变化的最小宽度
		maxHeight, //可以变化的最大高度
		minHeight, //可以变化的最小高度
		resizeNode,
		startX,
		startY,
		startWidth,
		startHeight;

	function init(data) {
		targetNode = data.target;
		maxWidth = data.maxWidth;
		maxHeight = data.maxHeight;
		minWidth = data.minWidth;
		minHeight = data.minHeight;

		resizeNode = createResizeBtn();
		document.ondragover = preventDefault;
		addEvent(resizeNode, "dragstart", setDataTransfer);
		addEvent(document, "drop", resizeTargetNode);
	}

	//在底部创建resizeBtn
	function createResizeBtn() {
		var div = document.createElement("div");
		div.style = '\
	        position: absolute;\
		    width: 12px;\
		    height: 12px;\
		    right: -6px;\
		    bottom: -6px;\
		    cursor: nw-resize;\
        ';
		div.draggable = 'true';
		div.id = 'resizeBtn';
		targetNode.appendChild(div);
		return div;
	}
	//事件取消
	function preventDefault(e) {
		e.preventDefault();
	}

	//初始化所需要的数据
	function setDataTransfer(e) {
		e.dataTransfer.setData('Text', e.target.id);
		startX = e.clientX;
		startY = e.clientY;
		startWidth = targetNode.offsetWidth;//dialog改变前宽度
		startHeight = targetNode.offsetHeight;//dialog改变后高度
	}

	//resizeTargetNode
	function resizeTargetNode(e) {
		if (e.dataTransfer.getData('Text') == resizeNode.id) {
			var width = e.clientX - startX + startWidth;
			var height = e.clientY - startY + startHeight;
			if (width >= minWidth && width <= maxWidth) {
				targetNode.style.width = width + 'px';
			}
			if (height >= minHeight && height <= maxHeight) {
				targetNode.style.height = height + 'px';
			}
		}
	}

	//重置
	return {
		init: init
	}
})