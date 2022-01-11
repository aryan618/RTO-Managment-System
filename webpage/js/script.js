var insertHtml = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
};

var insertProperty = function (string, propName, propValue) {
	var propToReplace = "{{" + propName + "}}";
	string = string
		.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
};

var startApp = function () {
	$ajaxUtils.sendGetRequest(
		'/snippets/form1',
		function (htmlData) {
			insertHtml('#main-content', htmlData);
		},
		false);
};

function insertRecord() {
	var name = document.getElementById('name').value;
	var address = document.getElementById('address').value;

	if (name.length != 0 && address.length != 0) {
		fetch('/customer/insert',
			{
				method: 'POST',
				body: JSON.stringify({
					name: name,
					address: address
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
	}
}