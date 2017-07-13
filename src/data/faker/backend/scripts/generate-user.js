const path = require( 'path' );

const userJson = require( './lib/user-json' );
const writeJsonFiles = require( '../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../output/user/' );

let jsonFiles = {
	me: userJson.createMe()
};

writeJsonFiles( outputPath, jsonFiles );
