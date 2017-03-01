const generateSchema = require( './lib/generate-schema' );
const calculateOverviewValues = require( './lib/calculate-overview-values' );

module.exports = {

	createIndex: function(){

		return generateSchema( '/sector_teams/index.schema' );
	},

	createOverview: function(){

		let sectorId = 1;
		let overview = generateSchema( '/sector_teams/overview.schema' );

		for( let sector of overview ){

			sector.id = sectorId++; // id's need to match icon ids
			calculateOverviewValues( sector.values );

			for( let hvcGroup of sector.hvc_groups ){

				calculateOverviewValues( hvcGroup.values );
			}
		}

		return overview;
	}
};
