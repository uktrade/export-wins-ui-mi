const generateSchema = require( '../../../generate-schema' );

module.exports = {

	createIndex: function( year ){

		return generateSchema( '/investment/fdi/sector_teams/index.schema', year );
	},

	createTeam: function( year ){

		return generateSchema( '/investment/fdi/sector_teams/sector-team.schema', year );
	}
};
