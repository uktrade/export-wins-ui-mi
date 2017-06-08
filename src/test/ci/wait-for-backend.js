const config = require( './test-config' );
const EndpointCheck = require( './helpers/EndpointCheck' );

const backendUrl = `${ config.backendUrl }/`;

new EndpointCheck( backendUrl, ( err ) => {

	if( err ){

		console.log( 'Could not connect to backend:' );
		console.log( err );
		process.exit( 1 );

	} else {

		console.log( 'Successfully connected to the backend' );
		process.exit();
	}
} );
