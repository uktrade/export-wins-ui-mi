const generateSchema = require( '../../generate-schema' );

module.exports = {

	createIndex: function( year ){

		return generateSchema( '/investment/sector_teams/index.schema', year );
	}
};
