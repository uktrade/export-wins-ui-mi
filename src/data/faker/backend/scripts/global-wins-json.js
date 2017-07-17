const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createWins: function(){

		return generateSchema( '/global_wins/index.schema' );
	}
};
