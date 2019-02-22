const { appsNamesAndPaths, globalNavItems } = require('../config');
const { transformAppsToPermittedApps } = require('../lib/transformers/permitted-apps');

function buildGlobalNav (req, res, next) {
	const permittedApps = transformAppsToPermittedApps(appsNamesAndPaths, req.user.permitted_applications);
	res.locals.globalNavItems = buildGlobalNavItems(permittedApps, globalNavItems);
	console.log('==========================')
	console.log(permittedApps)
	console.log(res.locals.globalNavItems)
  console.log('==========================')

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
