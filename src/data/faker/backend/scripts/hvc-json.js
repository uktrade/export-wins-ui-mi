const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createHvc: function(){

		return generateSchema( '/hvc/hvc.schema' );
	}
};
