function todoList() {
	var item = document.getElementById("todoInput").value;
	if (item)
		addItemTodo(item);
	return $("#todoInput").val("");
}

function addItemTodo(item, i) {
	i = i || 0;

	var table = document.getElementById("todoList")
	var tr = document.createElement("tr")
	var td1 = document.createElement("td");
	var td2 = document.createElement("td");
	var td3 = document.createElement("td");

	if (localStorage.getItem(0) == null) {
		var p = 0;
		localStorage.setItem("counter", p);
	}
	var p = parseInt(localStorage.getItem("counter"))
	localStorage.setItem(p, item);
	localStorage.setItem("counter", p + 1);

	var complete = document.createElement("input")
	complete.type = "checkbox";
	complete.value = 1;
	complete.onchange = function(e) {
		var row = this.parentNode.parentNode;
		if ($(this).is(":checked")) {
			var id = "chk" + p.toString();
			localStorage.setItem(id, 1);
			row.style.backgroundColor = "#98FB98";
		} else {
			localStorage.removeItem(id, 1);
			row.style.backgroundColor = "#FFF";
		}
	}

	var remove = document.createElement("span");
	remove.className = "glyphicon glyphicon-trash blue";
	remove.onclick = function(e) {
		var dom = this;
		var p_dom = this.parentNode.parentNode;
		console.log(p_dom);
		for (var j = 0; j < parseInt(localStorage.getItem("counter")); j++) {
			if(localStorage.getItem(j) == p_dom.textContent) localStorage.removeItem(j);
		}
		var parent_node = p_dom.parentNode;
		parent_node.removeChild(p_dom);
	}

	var text = document.createTextNode(item);
	td1.appendChild(text);
	td2.appendChild(complete);
	td3.appendChild(remove);

	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	table.appendChild(tr);

	if (i == 1) {
		complete.checked = "checked";
		complete.onchange();
	}
}

function addExistingItem(item, i) {
	var table = document.getElementById("todoList");
	var tr = document.createElement("tr");
	var td1 = document.createElement("td");
	var td2 = document.createElement("td");
	var td3 = document.createElement("td");
	var text = document.createTextNode(item);

	var complete = document.createElement("input");
	complete.type = "checkbox";
	complete.value = 1;
	var id = "chk" + (i).toString();
	complete.onchange = function(e) {
		var row = this.parentNode.parentNode;
		if ($(this).is(":checked")) {
			localStorage.setItem(id, 1);
			row.style.backgroundColor = "#98FB98";
		} else {
			localStorage.removeItem(id, 1);
			row.style.backgroundColor = "#FFF";
		}
	}

	var remove = document.createElement("span");
	remove.className = "glyphicon glyphicon-trash blue";
	remove.onclick = function(e) {
		var dom = this;
		var p_dom = this.parentNode.parentNode;
		console.log(p_dom);
		for (var j = 0; j < parseInt(localStorage.getItem("counter")); j++) {
			if(localStorage.getItem(j) == p_dom.textContent) localStorage.removeItem(j);
		}
		var parent_node = p_dom.parentNode;
		parent_node.removeChild(p_dom);
		localStorage.removeItem(dom);
	}

	td1.appendChild(text);
	td2.appendChild(complete);
	td3.appendChild(remove);

	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	table.appendChild(tr);

	if (localStorage.getItem(id)) {
		complete.checked = "checked";
		complete.onchange();
	}

}

function downloadTXT(txt, filename) {
	var txtFile;
	var downloadLink;

	txtFile = new Blob([ txt ], {
		type : "text/plain"
	});

	downloadLink = document.createElement("a");
	downloadLink.download = filename;
	downloadLink.href = window.URL.createObjectURL(txtFile);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
}

function exportList(filename) {
	var txt = [];
	var rows = document.querySelectorAll("table tr");
	var form = document.getElementById("todoList");
	var myArray = [];

	for (var i = 1; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");

		for (var j = 0; j < 1; j++)
			row.push(cols[j].innerText);

		txt.push(row.join(","));
	}

	txt.join(",");

	form.querySelectorAll("input").forEach(function(input) {
		if (input.type === "checkbox") {
			if (input.checked) {
				myArray.push("1");
			} else {
				myArray.push("0");
			}
		}
	})

	var list = txt + "\r\n" + myArray.join(",");

	downloadTXT(list, filename);
}

function clearStorage() {
	localStorage.clear();
	$("#todoList td").remove();
}

window.onload = function() {
	var p = localStorage.getItem("counter");
	for (var i = 0; i < parseInt(p); i++) {
		var item = localStorage.getItem(i);
		if (item != null) addExistingItem(item, i);
	}

	var fileInput = document.getElementById("fileInput");

	fileInput.addEventListener("change", function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;

		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				clearStorage();
				arrayOfLines = reader.result.match(/[^\r\n]+/g);
				var entries = arrayOfLines[0].split(",");
				var checkboxes = arrayOfLines[1].split(",");
				for (var i = 0; i < entries.length; i++) {
					addItemTodo(entries[i], checkboxes[i])
				}
			}

			reader.readAsText(file);

		} else {
			alert("File not supported!");
		}
	});
}
