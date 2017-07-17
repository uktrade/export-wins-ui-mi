const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createHvcs: function(){

		return generateSchema( '/global_hvcs/index.schema' );
	}
};
