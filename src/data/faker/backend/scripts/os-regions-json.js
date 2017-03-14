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
	},

	createList: function(){

		let list = generateSchema( '/os_regions/index.schema' );
		let id = 1;

		for( let region of list ){

			region.id = id++;//Regions need to be from 1 to 17 to make the grouping work
		}

		return list;
	}
};
