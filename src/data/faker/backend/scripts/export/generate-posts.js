const path = require( 'path' );

const postsJson = require( '../lib/json-creators/export/posts-json' );
const writeJsonFiles = require( '../../../helpers/write-json-files' );

let outputPath = path.resolve( __dirname, '../../output/export/posts/' );

let jsonFiles = {
	index: postsJson.createList(),
	win_table: postsJson.createWinTable()
};

writeJsonFiles( outputPath, jsonFiles );
