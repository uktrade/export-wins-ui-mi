const writeFiles = require( './write-files' );

module.exports = function( path, files ){

	let jsonFiles = [];

	for( let file in files ){

		const json = JSON.stringify( files[ file ], null, 3 );
		const fileName = ( path + '/' + file + '.json' );

		jsonFiles.push( [ fileName, json ] );
	}

	writeFiles( jsonFiles );
};
