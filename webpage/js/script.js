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

var onclickEvent = function(selector, callback) {
    $(selector).on('click', callback);
}

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

signUp = function() {
    const name = $('#signup-name')[0].value,
        email = $('#signup-email')[0].value,
        password = $('#signup-password')[0].value,
        phone = $('#signup-phone')[0].value;

    if (name.length != 0 && email.length != 0 && password.length != 0 && phone.length != 0) {
        post('/customer/signup', {
            name: name,
            email: email,
            password: password,
            phone: phone
        });
    }
};

verifyLogin = function() {
    const email = $("#floatingInput")[0].value;
    const password = $("#floatingPassword")[0].value;
    const rememberme = $('input:checkbox').is(':checked');
    if (email.length == 0) {
        insertHtml('#login-message', 'Please enter Customer ID');
        return;
    }
    if (password.length == 0) {
        insertHtml('#login-message', "Please enter password");
        return;
    }
    const res = post('/customer/verify', {
            email: email,
            password: password,
            rememberme: rememberme
        })
        .then(res => {
            insertHtml('#login-message', res);
        });
};

var loadSignupPage = function() {
    $('#carousel').addClass('d-none');
    $ajaxUtils.sendGetRequest(
        '/snippets/signup',
        function(htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#signup-button', signUp);
            onclickEvent('#login-link', loadLoginPage);
        },
        false);
};

var loadLoginPage = function() {
    $('#carousel').addClass('d-none');
    $ajaxUtils.sendGetRequest(
        '/snippets/login',
        function(htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#login-button', verifyLogin);
            onclickEvent('#signup-link', loadSignupPage);
        },
        false
    );
}

$('#login-page').on('click', function() {
    loadLoginPage();
});

$('#signup-page').on('click', function() {
    loadSignupPage();
});

$(window).unload(function() {
    // $ajaxUtils.sendGetRequest(
    //     '/customer/logout',
    //     function(res) {
    //         console.log(res);
    //     },
    //     false
    // );
    // $.get('/customer/logout');
});

// $(function() {
//     $("#navbar-toggler").blur(function(event) {
//         var screenWidth = window.innerWidth;
//         if (screenWidth < 768) {
//             $("#navbar-content").collapse('hide');
//         }
//     });
// });
$('.dropdown').hover(function() {
    $('.dropdown-menu', this).toggleClass('show');
});