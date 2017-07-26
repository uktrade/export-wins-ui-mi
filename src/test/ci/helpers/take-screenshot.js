const driver = require( './driver' );
const writeImage = require( './write-image' );

module.exports = function( name ){

	return driver.takeScreenshot()
		.then( ( base64Data ) => writeImage( name, base64Data ) )
		.catch( ( err ) => console.error( err ) );
};
