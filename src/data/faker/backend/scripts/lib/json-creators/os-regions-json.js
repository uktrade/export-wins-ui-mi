const generateSchema = require( '../generate-schema' );
const calculateOverviewValues = require( '../calculate-overview-values' );

module.exports = {

	createOverview: function( year ){

		return generateSchema( '/os_regions/overview.schema', year ).then( ( overview ) => {

			let regionId = 1;

			for( let region of overview.results ){

				region.id = regionId++;//Regions need to be from 1 to 17 to make the grouping work
				calculateOverviewValues( region.values );
			}

			return overview;
		} );
	},

	createList: function( year ){

		return generateSchema( '/os_regions/index.schema', year ).then( ( list ) => {

			let id = 1;

			for( let region of list.results ){

				region.id = id++;//Regions need to be from 1 to 17 to make the grouping work
			}

			return list;
		} );
	},

	createWinTable: function( year ){

		return generateSchema( '/os_regions/win_table.schema', year );
	}
};
