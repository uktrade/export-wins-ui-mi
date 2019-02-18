const { intersection, map } = require('lodash')

function transformPermittedAppsToCollection (apps, keys) {
	let collection = []

	map(keys, (key) => {
		map(apps, (item) => {
			if (item.key === key) {
				collection.push(item)
			}
		})
	})

	return collection
}

function transformAppsToPermittedApps (appsNamesAndPaths, permittedApplications) {
	const appKeys = map(appsNamesAndPaths, (item) => item.key)
	const permittedAppsKeys = map(permittedApplications, (item) => item.key)
	const keys = intersection(appKeys, permittedAppsKeys)
	return transformPermittedAppsToCollection(appsNamesAndPaths, keys)
}

module.exports = {
	transformAppsToPermittedApps,
}
