async function setupStorage(force = false) {
	let logged_in;
	promises_check_if_already_installed = [
		localforage.getItem("logged_in").then(function (val) {
			console.log("[setupStorage] logged in status: " + val);
			logged_in = val;
		})
	];
	await Promise.all(promises_check_if_already_installed);

	let promises_update = [
		localforage.setItem("profile", {}),
		localforage.setItem("chosenLang", "en"),	// default options. if this fails,
		localforage.setItem("theme", "light"),		// there are still defaults in the
		localforage.setItem("errorReporting", "on"), // settings.js
		localforage.setItem("lastUpdate", 0),
		localforage.setItem("triggerWarningAccepted", false)
	];

	if (logged_in && force == false) { // torej, če je že bila prijava narejena, ne posodobi backwards-compatible vrednosti (username, password,...)
		await Promise.all(promises_update);
		console.log("[setupStorage] user logged in: only updated");
	} else {

		let promises_first_install = [
			localforage.setItem("logged_in", false),
			localforage.setItem("username", ""),
			localforage.setItem("password", ""),
		];
		await localforage.clear();
		await Promise.all(promises_first_install);
		await Promise.all(promises_update);
		console.log("[setupStorage] user not logged in: set up whole database");
	}
}
