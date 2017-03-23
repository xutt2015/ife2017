var tableContainer = $("tableContainer");

var store = [{
	'name': '小明',
	'chienes': '80',
	'Mathematics': '90',
	'english': '70',
	'summaryScore': '240'
}, {
	'name': '小红',
	'chienes': '90',
	'Mathematics': '60',
	'english': '90',
	'summaryScore': '240'
}, {
	'name': '小亮',
	'chienes': '60',
	'Mathematics': '100',
	'english': '70',
	'summaryScore': '230'
}];
var columns = [{
	text:'姓名',width: 200,align: 'center',sortable: false,dataIndex: 'name'
}, {
	text:'语文',width: 200,align: 'center',sortable: true,dataIndex: 'chienes'
}, {
	text:'数学',width: 200,align: 'center',sortable: true,dataIndex: 'Mathematics'
}, {
	text:'英语',width: 200,align: 'center',sortable: true,dataIndex: 'english'
}, {
	text:'总分',width: 200,align: 'center',sortable: true,dataIndex: 'summaryScore'
}];

//创建表格
var createTable = new createTable();
createTable.init(tableContainer, columns, store);