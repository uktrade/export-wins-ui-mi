const { appsNamesAndPaths } = require('../config');
const { transformAppsToPermittedApps } = require('../lib/transformers/permitted-apps');
const globalNavItems = require('../global-nav-items');

function buildGlobalNav (req, res, next) {
	const permittedApps = transformAppsToPermittedApps(appsNamesAndPaths, req.user.permitted_applications);
	res.locals.globalNavItems = buildGlobalNavItems(permittedApps, globalNavItems);
	next();
}

function buildGlobalNavItems (permittedApps, globalNavItems) {

	const permittedNavItems = permittedApps.map((item) => {
		let { path, key, name } = item;
		return {
			isActive: false,
			url: path,
			key: key,
			label: name
		};
	});
	return globalNavItems.concat(permittedNavItems);
}

module.exports = {
	buildGlobalNav,
};
