const generateSchema = require( '../generate-schema' );

module.exports = {

	createHvcs: function( year ){

		return generateSchema( '/global_hvcs/index.schema', year ).then( ( hvcs ) => {

			hvcs.results.forEach( ( hvc ) => hvc.code = ( 'E' + hvc.code ) );

			return hvcs;
		} );
	}
};
