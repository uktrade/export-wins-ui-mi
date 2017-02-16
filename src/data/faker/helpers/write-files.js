const fs = require( 'fs' );
const path = require( 'path' );


function mkdirp( filePath ){

  const dirname = path.dirname( filePath );

  if( fs.existsSync( dirname ) ){

    return true;
  }

  mkdirp( dirname );
  fs.mkdirSync( dirname );
}

module.exports = function( files ){

	let filesToWrite = 0;
	let filesWritten = 0;

	function fileWritten(){

		filesWritten++;

		if( filesWritten === filesToWrite ){

			console.log( '%s file%s written', filesWritten, ( filesWritten === 1 ? '' : 's' ) );
		}
	}

	for( let [ file, data ] of files ){

		filesToWrite++;

		mkdirp( file );

		fs.writeFile( file, data, ( err ) => {

			if( err ){

				console.log( err );
			}

			fileWritten();
		} );
	}
};
