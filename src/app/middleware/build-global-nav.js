const { appsNamesAndPaths } = require('../macros')
const { transformAppsToPermittedApps } = require('../lib/transformers/permitted-apps')
const globalNavItems = require('../global-nav-items')
const backend = require( '../lib/service/service.backend' )

async function buildGlobalNav (req, res, next) {
	const introspect = await backend.getUserInfo(req)
	const permittedApps = transformAppsToPermittedApps(appsNamesAndPaths, introspect.permitted_applications)
	res.locals.globalNavItems = buildGlobalNavItems(permittedApps, globalNavItems)
	next()
}

function buildGlobalNavItems (permittedApps, globalNavItems) {

	const permittedNavItems = permittedApps.map((item) => {
		let { path, key, name } = item
		const isMi = key === 'datahub-mi'
		return {
			isActive: isMi,
			url: isMi ? '/' : path,
			key: key,
			label: name
		}
	})
	return globalNavItems.concat(permittedNavItems)
}

module.exports = {
	buildGlobalNav,
}
