function transformPermittedAppsToCollection (appsNamesAndPaths, keys) {

	const collection = keys.map((key) => appsNamesAndPaths.map((app) => {
			if (app.key === key) {
				return app;
			}
		})
	);

  console.log('2222222222222')
  console.log([].concat(...collection).filter((item) => item))
  console.log('2222222222222')

	return [].concat(...collection).filter((item) => item);
}

function transformAppsToPermittedApps (appsNamesAndPaths, permittedApplications) {

  console.log('111111111111111')
  console.log('appsNamesAndPaths', appsNamesAndPaths)
  console.log('permittedApplications', permittedApplications)
  console.log('111111111111111')

	const appsIsArray = Array.isArray( permittedApplications );
	const permittedAppsKeys = appsIsArray && permittedApplications.map((item) => item.key) || [];
	const keys = appsNamesAndPaths.map((namePath)=>{
		if(permittedAppsKeys.includes(namePath.key)){
			return namePath.key;
		}
	}).filter((key)=>key);

	return transformPermittedAppsToCollection(appsNamesAndPaths, keys);
}

module.exports = {
	transformAppsToPermittedApps,
};
