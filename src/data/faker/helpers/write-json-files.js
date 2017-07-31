const writeFiles = require( './write-files' );

module.exports = function( path, filePromises ){

	const fileNames = [];
	const promises = [];

	for( let file in filePromises ){

		const promise = filePromises[ file ];
		const fileName = ( path + '/' + file + '.json' );

		promises.push( promise );
		fileNames.push( fileName );
	}

	Promise.all( promises ).then( ( jsonFiles ) => {

		const files = [];

		jsonFiles.forEach( ( file, i ) => {

			const json = JSON.stringify( file, null, 3 );

			files.push( [ fileNames[ i ], json ] );
		} );

		writeFiles( files );

	} ).catch( ( e ) => { console.log( e ); } );
};
