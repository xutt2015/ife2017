var clickNode = document.getElementById('start'), //点击的按钮
	openNode = document.getElementById('model'), //点击后打开的按钮
    dragNode=document.getElementById('dialog'),     //拖曳的目标
	closeNode1 = document.getElementById('submit'),
	closeNode2 = document.getElementById('cancel'),
	closeNode3 = document.getElementById('close');

//初始化一个弹出框
var clickOpen = new ClickOpen();
clickOpen.init({
	clickNode: clickNode, //点击的按钮
	openNode: openNode, //点击之后弹出的框
	allowRoll: true, //是否允许弹出框出现时滚动body
	closeNode: [openNode, closeNode1, closeNode2, closeNode3] //点击之后关闭弹出框的节点
});

//初始化拖动事件
var darg=new Drag();
darg.init(dragNode);

//初始化一个缩放框
var changeSize=new ChangeSize();
changeSize.init({
    target:dragNode,   //需要改变大小的DOM
    maxWidth:700,     //可以变化的最大宽度
    minWidth:470,     //可以变化的最小宽度
    maxHeight:700,   //可以变化的最大高度
    minHeight:350     //可以变化的最小高度
});