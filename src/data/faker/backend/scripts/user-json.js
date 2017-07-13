const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createMe: function(){

		return generateSchema( '/user/me.schema' );
	}
};
