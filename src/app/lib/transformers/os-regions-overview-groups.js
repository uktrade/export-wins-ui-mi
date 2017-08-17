
module.exports = function( groups, regions ){

	if( !groups ){ throw new Error( 'Groups are required' ); }
	if( !regions ){ throw new Error( 'Regions are required' ); }

	//create list of regions keyed by id to make it easy to get one
	const regionList = {};

	regions.results.forEach( ( region ) => {

		regionList[ region.id ] = region;
	} );

	groups.results.forEach( ( group ) => {

		group.regions = group.regions.map( ( groupRegion ) => {

			const region = regionList[ groupRegion.id ];

			if( !region ){

				throw new Error( 'Region not found for id ' + groupRegion.id );
			}

			region.name = groupRegion.name;

			return region;
		} );
	} );

	regions.results = groups.results;

	return regions;
};
