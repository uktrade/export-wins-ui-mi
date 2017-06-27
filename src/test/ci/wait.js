const config = require( './test-config' );
const EndpointCheck = require( './helpers/EndpointCheck' );

const appUrl = `${ config.baseUrl }/ping/`;
const backendUrl = `${ config.backendUrl }/`;

new EndpointCheck( backendUrl, ( err ) => {

	if( err ){

		console.log( 'Could not connect to backend:' );
		console.log( err );
		process.exit( 1 );

	} else {

		new EndpointCheck( appUrl, ( err ) => {

			if( err ){

				console.log( 'Could not connect to app:' );
				console.log( err );
				process.exit( 1 );

			} else {

				process.exit();
			}
		} );
	}
} );
