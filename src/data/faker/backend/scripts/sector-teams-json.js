const generateSchema = require( './lib/generate-schema' );
const calculateOverviewValues = require( './lib/calculate-overview-values' );

module.exports = {

	createIndex: function( year ){

		return generateSchema( '/sector_teams/index.schema', year );
	},

	createOverview: function( year ){

		return generateSchema( '/sector_teams/overview.schema', year ).then( ( overview ) => {

			let sectorId = 1;

			for( let sector of overview.results ){

				sector.id = sectorId++; // id's need to match icon ids
				calculateOverviewValues( sector.values );

				for( let hvcGroup of sector.hvc_groups ){

					calculateOverviewValues( hvcGroup.values );
				}
			}

			return overview;
		} );
	},

	createWinTable: function( year ){

		return generateSchema( '/sector_teams/win_table.schema', year );
	}
};
