const fs = require( 'fs' );
const config = require( '../test-config' );

module.exports = function writeImage( name, base64Data ){

	return new Promise( ( resolve, reject ) => {

		const file = ( config.screenshotDir + '/' + name + '.png' );
		const data = new Buffer( base64Data, 'base64' );

		fs.writeFile( file, data, function( err ){

			if( err ){

				reject( err );

			} else {

				//console.log( 'Screenshot written to: ' + file );
				resolve();
			}
		} );
	} );
};
