module.exports = {

	transformAppsToPermittedApps: function (appsNamesAndPaths, permittedApplications) {

		const appsIsArray = Array.isArray( permittedApplications );
		const permittedAppsKeys = appsIsArray && permittedApplications.map((item) => item.key) || [];
		const keys = appsNamesAndPaths.map((namePath) => {
			if(permittedAppsKeys.includes(namePath.key)){
				return namePath.key;
			}
		}).filter((key) => !!key);

		return appsNamesAndPaths.filter( ( app ) => keys.includes( app.key ) );
	}
};
