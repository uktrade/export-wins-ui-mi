const generateSchema = require( '../generate-schema' );

module.exports = {

	createMe: function(){

		return generateSchema( '/user/me.schema' );
	}
};
