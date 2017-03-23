var Drag = (function() {
	var dragNode,
		startX, //拖拽源距左边的距离
		startY; //拖拽源距上边的距离

	function init(dragNodeEx) {
		dragNode = dragNodeEx;
		dragNode.setAttribute("draggable", 'true');
		dragNode.style.cursor="move";//改变鼠标悬浮显示
		//事件取消
		document.ondragover=preventDefault;
		//添加拖放事件
		addEvent(dragNode, "dragstart", setDataTransfer);//对象是dragNode
		addEvent(document, "drop", setPosition);//对象是document
	}
    
    function preventDefault(e){
        e.preventDefault();
    }

	function setDataTransfer(e) {
		e.dataTransfer.setData('text', e.target.id);
		startX = e.pageX - e.target.offsetLeft;
		startY = e.pageY - e.target.offsetTop;
	}

	function setPosition(e) {
		if (e.dataTransfer.getData('text') == dragNode.id) {
			dragNode.style.left=(e.pageX-startX)+'px';
			dragNode.style.top=(e.pageY-startY)+'px';
		}
	}
	return {
		init: init
	};
})