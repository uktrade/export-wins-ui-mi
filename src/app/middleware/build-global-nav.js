const { appsNamesAndPaths } = require('../config');
const { transformAppsToPermittedApps } = require('../lib/transformers/permitted-apps');

function buildGlobalNavItems (permittedApps) {

	const permittedNavItems = permittedApps.map((item) => {

		let { path, key, name } = item;

		return {
			isActive: ( key === 'datahub-mi' ),
			url: path,
			key: key,
			label: name
		};
	});

	return permittedNavItems;
}

module.exports = {

	buildGlobalNav: function (req, res, next) {

		const permittedApps = transformAppsToPermittedApps(appsNamesAndPaths, req.user.permitted_applications);
		res.locals.globalNavItems = buildGlobalNavItems(permittedApps);
		next();
	}
};
