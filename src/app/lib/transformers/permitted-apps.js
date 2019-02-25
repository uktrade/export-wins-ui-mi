module.exports = {

	transformAppsToPermittedApps: function (appsNamesAndPaths, permittedApplications) {

		const appsIsArray = Array.isArray( permittedApplications );
		const permittedAppsKeys = appsIsArray && permittedApplications.map((item) => item.key) || [];

		return appsNamesAndPaths.filter( ( app ) => permittedAppsKeys.includes( app.key ) );
	}
};
