const generateSchema = require( './lib/generate-schema' );
const calculateOverviewValues = require( './lib/calculate-overview-values' );

module.exports = {

	createOverview: function(){

		let regionId = 1;
		
		let overview = generateSchema( '/os_regions/overview.schema' );

		for( let region of overview ){

			region.id = regionId++;//Regions need to be from 1 to 17 to make the grouping work
			calculateOverviewValues( region.values );
		}

		return overview;
	}
};
