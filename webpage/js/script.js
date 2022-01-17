var insertHtml = function(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
};

var insertProperty = function(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
        .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
};

var post = async function(url, data) {
    var response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    response = await response.text();
    return response;
};

function insertRecord() {
    var name = document.getElementById('name').value;
    var address = document.getElementById('address').value;

    if (name.length != 0 && address.length != 0) {
        post('/customer/insert', {
            name: name,
            address: address
        });
    }
}

verifyLogin = function() {
    const customer = $("#floatingInput")[0].value;
    const password = $("#floatingPassword")[0].value;
    const rememberme = $('input:checkbox').is(':checked');
    if (customer.length == 0) {
        insertHtml('#login-message', 'Please enter Customer ID');
        return;
    }
    if (password.length == 0) {
        insertHtml('#login-message', "Please enter password");
        return;
    }
    const res = post('/customer/verify', {
            customer: customer,
            password: password,
            rememberme: rememberme
        })
        .then(res => {
            insertHtml('#login-message', res);
        });
};

$('#loginButton').on('click', function() {
    verifyLogin();
});

$('#login-page').on('click', function() {
    $('#carousel').addClass('d-none');
    $ajaxUtils.sendGetRequest(
        '/snippets/login',
        function(htmlData) {
            insertHtml('#main-content', htmlData);
        },
        false
    );
});

var loadSignupPage = function() {
    $('#carousel').addClass('d-none');
    $ajaxUtils.sendGetRequest(
        '/snippets/signup',
        function(htmlData) {
            insertHtml('#main-content', htmlData);
        },
        false);
};

$('#signup-page').on('click', function() {
    loadSignupPage();
})

$('#signup-link').on('click', function() {
    console.log('clicking');
    loadSignupPage();
});

$('#signup-button').on('click', function() {

})

$(window).unload(function() {
    // $ajaxUtils.sendGetRequest(
    //     '/customer/logout',
    //     function(res) {
    //         console.log(res);
    //     },
    //     false
    // );

    $.get('/customer/logout');
});