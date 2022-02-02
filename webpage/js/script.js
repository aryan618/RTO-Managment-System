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

var onclickEvent = function (selector, callback) {
    $(selector).on('click', callback);
}

var hide = function (selector) {
    $(selector).addClass('d-none');
}

var show = function (selector) {
    $(selector).removeClass('d-none');
}

var post = async function (url, data) {
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

var showLoading = function (selector, color, size) {
    var html = `<div class='d-flex justify-content-center center'>
    <div class='spinner-border' role='status'
    style='color:${color};width:${size}em;height:${size}em;'>
    <span class='sr-only'></span >
    </div></div>`;
    insertHtml(selector, html);
};

signUp = function () {
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
            })
            .then(res => {
                loadLoginPage();
            });
    }
};

verifyLogin = function () {
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
            if (res == 'Authentication successful') {
                setTimeout(() => {
                    loadHomePage();
                    loadOptionsPage();
                }, 1.5 * 1000);
            }
        });
};

registerDL = function () {
    const dlno = $('#dl-form-dlno')[0].value,
        fname = $('#dl-form-fname')[0].value,
        lname = $('#dl-form-lname')[0].value,
        dob = $('#dl-form-dob').data('datepicker').getFormattedDate('yyyy-mm-dd'),
        address = $('#dl-form-address')[0].value,
        validity = $('#dl-form-validity').data('datepicker').getFormattedDate('yyyy-mm-dd'),
        bloodgrp = $('#dl-form-bloodgrp').val(),
        bloodrh = $('#dl-form-bloodrh').val();

    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            if (res.auth) {
                post('/dl/entry', {
                        cust_id: res.user,
                        dlno: dlno,
                        name: fname + ' ' + lname,
                        dob: dob,
                        address: address,
                        validity: validity,
                        blood: bloodgrp + bloodrh
                    })
                    .then(res => {
                        loadOptionsPage();
                    });
            };
        });
};

registerVehicle = function () {
    const vehiclenum = $('#vehicle-form-number')[0].value,
        vname = $('#vehicle-form-name')[0].value,
        vcolor = $('#vehicle-form-color')[0].value,
        vclass = $('#vehicle-form-class')[0].value,
        fueltype = $("#vehicle-form-fueltype").val();

    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            if (res.auth) {
                post('/dl/addvehicle', {
                        cust_id: res.user,
                        vehiclenum: vehiclenum,
                        vname: vname,
                        vcolor: vcolor,
                        vclass: vclass,
                        fueltype: fueltype
                    })
                    .then(res => {
                        loadOptionsPage();
                    });
            };
        });
};

apChange = function () {
    const address = $('#apchange-form-address')[0].value,
        phone = $('#apchange-form-phone')[0].value;

    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            if (res.auth) {
                post('/dl/apchange', {
                    cust_id: res.user,
                    phone: phone,
                    address: address
                });
            };
        })
        .then(res => {
            loadOptionsPage();
        });
};

fetchViolationBW = function () {
    const sdate = $('#violation-form-sdate').data('datepicker').getFormattedDate('yyyy-mm-dd'),
        edate = $('#violation-form-edate').data('datepicker').getFormattedDate('yyyy-mm-dd');

    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            if (res.auth) {
                post('/dl/voilationbw', {
                        cust_id: res.user,
                        sdate: sdate,
                        edate: edate
                    })
                    .then(res => JSON.parse(res))
                    .then(res => {
                        insertHtml('#violation-fetch', createViolationTable(res));
                    });
            };
        });
};

createViolationTable = function (res) {
    let html = `<table class="table">
                <thead>
                <tr>
                    <th scope="col">Complaint ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Fine</th>
                    <th scope="col">Vehicle number</th>
                    <th scope="col">Offence</th>
                    <th scope="col">Place</th>
                </tr>
                </thead>
                <tbody>`
    for (i = 0; i < res.length; i++) {
        html += `<tr>
                    <td>${res[i].complaint_id}</td>
                    <td>${res[i].date}</td>
                    <td>${res[i].fine}</td>
                    <td>${res[i].vehicle_no}</td>
                    <td>${res[i].offence}</td>
                    <td>${res[i].place}</td>
                </tr>`
    }
    html += ` </tbody></table>`;
    return html;
}

createDLTable = function (res) {
    console.log(res);
    let html = `<table class="table">
                <tbody>
                    <tr>
                        <th scope="row">DL Number</th>
                        <td>${res[0].dl_number}</td>
                    </tr>
                    <tr>
                        <th scope="row">Name</th>
                        <td>${res[0].name}</td>
                    </tr>
                    <tr>
                        <th scope="row">Address</th>
                        <td>${res[0].address}</td>
                    </tr>
                    <tr>
                        <th scope="row">DOB</th>
                        <td>${res[0].dob}</td>
                    </tr>
                    <tr>
                        <th scope="row">Validity</th>
                        <td>${res[0].validity}</td>
                    </tr>
                    <tr>
                        <th scope="row">Blood Group</th>
                        <td>${res[0].blood_group}</td>
                    </tr>
                </tbody>
                </table>`;
    return html;
}

var loadHomePage = function () {
    show('.navbar');
    show('#carousel');
    insertHtml('#main-content', `<h1 class="text-center mt-4">RTO Management System Homepage</h1>`);
    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            if (res.auth) {
                addProfileNav();
            } else {
                addSigninNav();
            }
            $('.dropdown').hover(function () {
                $('.dropdown-menu', this).toggleClass('show');
            });
        });
}

var loadSignupPage = function () {
    $('#carousel').addClass('d-none');
    $('.navbar').removeClass('d-none');
    showLoading('#main-content', 'var(--primary-accent)', 5);
    $ajaxUtils.sendGetRequest(
        '/snippets/signup',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#signup-button', signUp);
            onclickEvent('#login-link', loadLoginPage);
        },
        false);
};

var loadLoginPage = function () {
    hide('#carousel');
    // hide('.navbar');
    showLoading('#main-content', 'var(--primary-accent)', 5);
    $ajaxUtils.sendGetRequest(
        '/snippets/login',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#login-button', verifyLogin);
            onclickEvent('#signup-link', loadSignupPage);
        },
        false
    );
}

var loadOptionsPage = function () {
    $('#carousel').addClass('d-none');
    $ajaxUtils.sendGetRequest(
        '/snippets/options',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#dl-form-register-link', loadDLRegisterPage);
            onclickEvent('#dlform-violation', loadViolationBWPage);
            onclickEvent('#apchange-link', loadAPChangePage);
            onclickEvent('#vehicle-form-register-link', loadAddVehiclePage);
            onclickEvent('#dl-detail-fetch', loadDLDetailPage);
        },
        false
    );
};

loadDLRegisterPage = function () {
    $ajaxUtils.sendGetRequest(
        '/snippets/dl_form',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            $('.datepicker').datepicker({
                format: 'dd/mm/yyyy'
            });
            onclickEvent('#dl-form-submit', registerDL);
            onclickEvent('#dl-form-back', loadOptionsPage);
        },
        false
    );
}

loadViolationBWPage = function () {
    $ajaxUtils.sendGetRequest(
        '/snippets/violation_form',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            $('.datepicker').datepicker({
                format: 'dd/mm/yyyy'
            });
            onclickEvent('#violationbw-submit', fetchViolationBW);
            onclickEvent('#violationbw-back', loadOptionsPage);
        },
        false
    );
}

loadAddVehiclePage = function () {
    $ajaxUtils.sendGetRequest(
        '/snippets/vehicle_form',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#vehicle-form-submit', registerVehicle);
            onclickEvent('#vehicle-form-back', loadOptionsPage);
        },
        false
    );
}

loadDLDetailPage = function () {
    $ajaxUtils.sendGetRequest(
        '/snippets/dl_detail',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            post('/customer/authenticated', {})
                .then(res => JSON.parse(res))
                .then(res => {
                    console.log(res.user);
                    if (res.auth) {
                        post('/dl/retrieve', {
                                cust_id: res.user
                            })
                            .then(res => JSON.parse(res))
                            .then(res => {
                                insertHtml('#dl-detail-fetch', createDLTable(res));
                            });
                    };
                });
            onclickEvent('#dldetail-back', loadOptionsPage);
            // onclickEvent('#vehicle-form-submit', registerVehicle);
        },
        false
    );
}

loadAPChangePage = function () {
    $ajaxUtils.sendGetRequest(
        '/snippets/apchange_form',
        function (htmlData) {
            insertHtml('#main-content', htmlData);
            onclickEvent('#apchange-submit', apChange);
            onclickEvent('#apchange-back', loadOptionsPage);
        },
        false
    );
};

var addSigninNav = function () {
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

var addProfileNav = function () {
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

var logout = function () {
    $.post('/customer/logout');
    loadHomePage();
};

onclickEvent('#home-link', loadHomePage);
onclickEvent('#navbar-services', function () {
    post('/customer/authenticated', {})
        .then(res => JSON.parse(res))
        .then(res => {
            console.log(res.user);
            if (res.auth) {
                $('#carousel').addClass('d-none');
                loadOptionsPage();
            }
        });
});

// $(document).beforeunload(function() {
//     $ajaxUtils.sendGetRequest(
//         '/customer/logout',
//         function(res) {
//         },
//         false
//     );
//     $.post('/customer/logout');
// });

$(function () {
    loadHomePage();
    // $("#navbar-toggler").blur(function(event) {
    //     var screenWidth = window.innerWidth;
    //     if (screenWidth < 768) {
    //         $("#navbar-content").collapse('hide');
    //     }
    // });
});