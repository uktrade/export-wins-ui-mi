const driver = require( './driver' );
const writeImage = require( './write-image' );

module.exports = function( name, done ){

	driver.takeScreenshot()
		.then( ( base64Data ) => writeImage( name, base64Data ) )
		.then( done )
		.catch( function( err ){

			console.error( err );
		} );
};
