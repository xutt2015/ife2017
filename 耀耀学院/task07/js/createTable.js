var createTable = (function() {
	var target, store, columns;

	//初始化所需数据
	function init(t, c, s) {
		target = t;
		store = s;
		columns = c;
		var html = tableCofig();
		inputTarget(html);
		addSortEvent();
	}

	//配置表格
	function tableCofig() {
		var html = '<table>';
		//生成表头
		html += '<thead>\
		          <tr class=\'row0\'>'
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].sortable) {
				html += '<th sortable class=\'col' + i + '\' style=\'text-align:' + columns[i].align + ';width:' + columns[i].width + 'px;\'>\
					<div>' + columns[i].text + '\
						<span class="caret-wrapper">\
							<i class="ascending"></i>\
							<i class="descending"></i>\
						</span>\
					</div>\
				</th>';
			} else {
				html += '<th class=\'col' + i + '\' style=\'text-align:' + columns[i].align + ';width:' + columns[i].width + 'px;\'>' + columns[i].text + '</th>';
			}
		}
		html += '   </tr>\
		       </thead>\
		       <tbody>'
			//生成tbody
		for (var m = 0; m < store.length; m++) {
			var rowIndex = m + 1;
			html += '<tr class=\'row' + rowIndex + '\'>'
			for (var p = 0; p < columns.length; p++) {
				html += '<td class=\'col' + p + '\' style=\'text-align:' + columns[p].align + ';width:' + columns[p].width + 'px;\'>' + store[m][columns[p].dataIndex] + '</td>';
			}
			html += '</tr>'
		}
		html += '</tbody>\
		       </table>'
		return html;
	}

	//加入container
	function inputTarget(html) {
		target.innerHTML = html;
	}

	//绑定排序事件
	function addSortEvent() {
		var ascs = target.getElementsByClassName('ascending');
		for (var i = 0; i < ascs.length; i++) {
			addEvent(ascs[i], 'click', ascOrderFn);
		}
		var descs = target.getElementsByClassName('descending');
		for (var j = 0; j < descs.length; j++) {
			addEvent(descs[j], 'click', descOrderFn);
		}
	}

	//递增排
	function ascOrderFn(e) {
		var th = e.target.parentElement.parentElement.parentElement;
		var td = target.getElementsByClassName(th.className);
		var arr = [];
		var obj = [];
		var oldArr = [];
		for (var i = 0; i < td.length; i++) {
			if (td[i].localName == 'td') {
				obj.push(td[i].parentElement.innerHTML);
				arr.push(td[i].innerText);
				oldArr.push(td[i].innerText);
			}
		}
		//对数组进行排序
		arr.sort(function(a, b) {
			return a - b;
		});
		//重新生成html
		for (var p = 0; p < arr.length; p++) {
			for (var m = 0; m < oldArr.length; m++) {
				if (oldArr[m] == arr[p]) {
					var rowIndex = p + 1;
					target.getElementsByClassName('row' + rowIndex)[0].innerHTML = obj[m];
					oldArr.splice(m, 1);
					obj.splice(m, 1);
					break;
				}
			}
		}
	}
	//递减排
	function descOrderFn(e) {
		var th = e.target.parentElement.parentElement.parentElement;
		var td = target.getElementsByClassName(th.className);
		var arr = [];
		var obj = [];
		var oldArr = [];
		for (var i = 0; i < td.length; i++) {
			if (td[i].localName == 'td') {
				obj.push(td[i].parentElement.innerHTML);
				arr.push(td[i].innerText);
				oldArr.push(td[i].innerText);
			}
		}
		//对数组进行排序
		arr.sort(function(a, b) {
			return b - a;
		});
		//重新生成html
		for (var p = 0; p < arr.length; p++) {
			for (var m = 0; m < oldArr.length; m++) {
				if (oldArr[m] == arr[p]) {
					var rowIndex = p + 1;
					target.getElementsByClassName('row' + rowIndex)[0].innerHTML = obj[m];
					oldArr.splice(m, 1);
					obj.splice(m, 1);
					break;
				}
			}
		}
	}
	return {
		init: init
	}
})