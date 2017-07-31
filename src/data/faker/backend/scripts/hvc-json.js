const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createHvc: function( year ){

		return generateSchema( '/hvc/hvc.schema', year );
	},

	createWinTable: function( year ){

		return generateSchema( '/hvc/win_table.schema', year );
	}
};
