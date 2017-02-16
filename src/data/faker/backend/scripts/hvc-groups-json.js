const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createMonths: function(){
		
		return generateSchema( '/hvc_groups/months.schema' );
	}
};
