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

var hide = function(selector) {
    $(selector).addClass('d-none');
}

var show = function(selector) {
    $(selector).removeClass('d-none');
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

var showLoading = function(selector, color, size) {
    var html = `<div class='d-flex justify-content-center center'>
    <div class='spinner-border' role='status'
    style='color:${color};width:${size}em;height:${size}em;'>
    <span class='sr-only'></span >
    </div></div>`;
    insertHtml(selector, html);
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
            setTimeout(() => {
                loadHomePage();
                loadOptionsPage();
            }, 2.5 * 1000);
        });
};

var loadHomePage = function() {
    show('.navbar');
    show('#carousel');
    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            if (res.auth) {
                addProfileNav();
            } else {
                addSigninNav();
            }
            $('.dropdown').hover(function() {
                $('.dropdown-menu', this).toggleClass('show');
            });
        });
}

var loadSignupPage = function() {
    $('#carousel').addClass('d-none');
    $('.navbar').removeClass('d-none');
    showLoading('#main-content', 'var(--primary-accent)', 5);
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
    hide('#carousel');
    // hide('.navbar');
    showLoading('#main-content', 'var(--primary-accent)', 5);
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

var loadOptionsPage = function() {
    $('#carousel').addClass('d-none');
    $ajaxUtils.sendGetRequest(
        '/snippets/options',
        function(htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#dl-form-register-link', loadDLRegisterPage);
        },
        false
    );
};

loadDLRegisterPage = function() {
    $ajaxUtils.sendGetRequest(
        '/snippets/dl_form',
        function(htmlData) {
            insertHtml('#main-content', htmlData);
        },
        false
    );
}

var addSigninNav = function() {
    var html = `<li id="login-dropdown" class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" data-bs-toggle="dropdown">
                        <span class="bi bi-box-arrow-right me-2"></span>Signin
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark" style="margin-left: -60px;">
                        <li><a class="dropdown-item" id="login-page">Login</a></li>
                        <li><a class="dropdown-item" id="signup-page">Sign Up</a></li>
                    </ul>
                </li>`;
    insertHtml('#navbar-right', html);
    onclickEvent('#login-page', loadLoginPage);
    onclickEvent('#signup-page', loadSignupPage);
};

var addProfileNav = function() {
    var html = `<li id="profile-link" class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" data-bs-toggle="dropdown">
                        <span class="bi bi-person-circle me-2"></span>Profile</a>
                    <ul class="dropdown-menu dropdown-menu-dark" style="margin-left: -70px;">
                        <li><a class="dropdown-item" id="show-profile-link">Show Profile</a></li>
                        <li><a class="dropdown-item" id="logout-link">Log Out</a></li>
                    </ul>
                </li>`;
    insertHtml('#navbar-right', html);
    onclickEvent('#logout-link', logout);
};

var logout = function() {
    $.post('/customer/logout');
    loadHomePage();
};

onclickEvent('#home-link', loadOptionsPage);

// $(document).beforeunload(function() {
//     $ajaxUtils.sendGetRequest(
//         '/customer/logout',
//         function(res) {
//         },
//         false
//     );
//     $.post('/customer/logout');
// });

$(function() {
    loadHomePage();
    $("#navbar-toggler").blur(function(event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#navbar-content").collapse('hide');
        }
    });
});