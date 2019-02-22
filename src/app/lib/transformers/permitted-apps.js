function transformPermittedAppsToCollection (appsNamesAndPaths, keys) {

	const collection = keys.map((key) => {
		return appsNamesAndPaths.map((app) => {
			if (app.key === key) {
				return app
			}
		})
	})

	return [].concat(...collection).filter((item) => item)
}

function transformAppsToPermittedApps (appsNamesAndPaths, permittedApplications) {
	const permittedAppsKeys = permittedApplications.map((item) => item.key)
	const keys = appsNamesAndPaths.map((namePath)=>{
		if(permittedAppsKeys.includes(namePath.key)){
			return namePath.key
		}
	}).filter((key)=>key)

	return transformPermittedAppsToCollection(appsNamesAndPaths, keys)
}

module.exports = {
	transformAppsToPermittedApps,
}
