const generateSchema = require( './lib/generate-schema' );
const calculateTarget = require( './lib/calculate-target' );
const calculateConfirmedPercentages = require( './lib/calculate-confirmed-percentages' );

module.exports = {

	createIndex: function(){

		return generateSchema( '/sector_teams/index.schema' );
	},

	createOverview: function(){

		let sectorId = 1;
		let overview = generateSchema( '/sector_teams/overview.schema' );

		for( let sector of overview ){

			sector.id = sectorId++; // id's need to match icon ids
			calculateTarget( sector.hvc_target_values );
			calculateConfirmedPercentages( sector.confirmed_percent );

			for( let hvcGroup of sector.hvc_groups ){

				calculateTarget( hvcGroup.hvc_target_values );
				calculateConfirmedPercentages( hvcGroup.confirmed_percent );
			}
		}

		return overview;
	}
};
