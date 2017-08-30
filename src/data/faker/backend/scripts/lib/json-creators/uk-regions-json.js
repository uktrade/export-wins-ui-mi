const generateSchema = require( '../generate-schema' );

module.exports = {

	createList: function( year ){

		return generateSchema( '/uk_regions/index.schema', year );
	},

	createWinTable: function( year ){

		return generateSchema( '/uk_regions/win_table.schema', year );
	},

	createRegion: function( year ){

		return generateSchema( '/uk_regions/uk-region.schema', year );
	}
};
