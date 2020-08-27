// const API_ENDPOINT = "https://gimb.tk/test.php"; // deprecated
//
// if your app does not use authentication, just use some random usernames and
// always return true, essentialy silently skip login. it's easiest that way.
document.addEventListener("DOMContentLoaded", () => {
	setupEventListeners();
	try {
		load_server_message_at_login();
	} catch (e) {
		console.log("login.js: load_server-message-at-login: silently failed.");
	}
});

function load_server_message_at_login() {
	$.ajax({
		url: "/server-message-at-login.html",
		success: (data) => {
			$("#server-message-at-login").html(data);
		},
		error: () => {
			$("#server-message-at-login").html("");
		}
	});
}

function setupEventListeners() {
    // Setup login button listener
    $("#login-button").click(() => {
        login();
    });

    window.addEventListener("keyup", (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            login();
        }
    });
}

// Handle login button click
function login() {
    let username = $("#username").val();
    let password = $("#password").val();
		var clientInstance;
		try {
    	clientInstance = new client(); // replace client() with your client func
		} catch (error) {
			$.ajax({
				url: 'js/client.js?ajaxload', // replace this with your client object
				async: false,
				dataType: "script",
			});
			try {
	    	    clientInstance = new client();
			} catch (error) {
				alert(D("browserNotSupported"));
			}
		}
    clientInstance.login(username, password).then( (value) => {
        if (typeof value == "string") {
            let promises_to_run = [
                localforage.setItem("logged_in", true),
                localforage.setItem("username", username),
                localforage.setItem("password", password)
            ];
            // read_val(0); // a non existing function can be used for data
					// gathering while still being legal => it's just error reporting.
					// this; however; blocks login and doesn't work. use somewhere else.
            Promise.all(promises_to_run).then(function () {
                window.location.replace("/pages/main.html"); // main page
            });
        } else {
            UIAlert("loginFailed");
            $("#password").val("");
        }
    }).catch((err) => {
        gsecErrorHandlerUI(err);
        $("#password").val("");
    });
}
