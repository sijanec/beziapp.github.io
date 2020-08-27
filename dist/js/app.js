>
>
>
>
>
>
>
>
>
// @begin=js@
const app_version = "1.0.14.4-beta>";
const previous_commit = "6acd2aca85354c6ba683aebed59d1cf95967865c>";
const APP_UPDATE_INTERVAL = 300; // update vsakih 300 sekund
const APPNAME = "UnBežiApp>";
const ERROR_REPORT_SERVER = "/error-report.php";
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/sw.js")
		.then(() => { })
		.catch((err) => console.log("Service worker registration failed", err));
}

// Listen to messages from service workers.
if (navigator.serviceWorker) {
	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data.msg === "install") {
			window.location.replace("/index.html");
		}
	});
}

/**
 * Displays a user-friendly text to the user and
 * detailed text to developer (console)
 * @param {string} usermsg User-friendly message
 * @param {string} devmsg Developer-friendly message
 */
async function UIAlert(usermsg, devmsg) {
	if (true) { // če bo kakšen dev switch?
		M.toast({ html: usermsg });
		console.log(`[`+APPNAME+` UIAlert] ${usermsg} ${devmsg}`);
	} else {
		M.toast({ html: `${usermsg} ${devmsg}` });
	}
}

var update_app_function = async function () {
	try {
		$.get("/cache_name.txt?cache_kill=" + Date.now(), (data, status) => {
			var cache_name = data.split("///")[1].split("|||")[0];
			var data_to_send = {
				action: "checkversion",
				valid_cache_name: cache_name
			}
			try {
				navigator.serviceWorker.controller.postMessage(JSON.stringify(data_to_send));
			} catch (e) {
				console.log("update requested but sw is not available in app.js");
			}
		});
	} catch (e) {
		console.log("update requested but failed because of network error probably in update_app_function in app.js");
	}
}

var error_report_function = async function (msg, url, lineNo, columnNo, error) {
	// catching everything here so no looping error shit. that's the last thing we want
	try {
		localforage.getItem("errorReporting").then(async function (value) {
			let selectedE = value;
			if (value == null || value.length < 1) {
				selectedE = "on";
			}
			if (selectedE == "on") {
				var data = {};
				data.error = { "msg": msg, "url": url, "line": lineNo, "column": columnNo, "obj": error };
				data.client = { "ua": navigator.userAgent, "app_version": app_version, "previous_commit": previous_commit, "username": null };

				// Load required data
				data.client.username = await localforage.getItem("username");

				data.type = "error";
				$.post(ERROR_REPORT_SERVER, data);
			} else {
				console.log("error not reported as reporting is disabled!");
			}
		}).catch(() => { });
		return false;
	} catch (e) {
		console.log("error_erport_function: !!! ERROR! (caught) - probably some network error.");
	}
}

window.onerror = error_report_function;
window.onunhandledrejection = error_report_function;

async function try_app_update() {
	localforage.getItem("lastUpdate").then((data) => {
		if (Math.floor(Date.now() / 1000) > Number(data) + APP_UPDATE_INTERVAL) {
			// trigger an update
			localforage.setItem("lastUpdate", Math.floor(Date.now() / 1000)).then(() => {
				update_app_function();
			});
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	try_app_update();
	var update_interval = setInterval(() => {

		try_app_update();

	}, 1000 * APP_UPDATE_INTERVAL);
});
