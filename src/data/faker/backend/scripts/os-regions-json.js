const generateSchema = require( './lib/generate-schema' );
const calculateTarget = require( './lib/calculate-target' );
const calculateConfirmedPercentages = require( './lib/calculate-confirmed-percentages' );

module.exports = {

	createOverview: function(){

		let regionId = 1;
		
		let overview = generateSchema( '/os_regions/overview.schema' );

		for( let region of overview ){

			region.id = regionId++;//Regions need to be from 1 to 17 to make the grouping work
			calculateConfirmedPercentages( region.confirmed_percent );
			calculateTarget( region.hvc_target_values );
		}

		return overview;
	}
};
