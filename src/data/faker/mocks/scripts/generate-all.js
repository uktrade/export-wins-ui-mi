const path = require( 'path' );
const hvcTable = require( './hvc-table-json' );

const writeJsonFiles = require( '../../helpers/write-json-files' );
const outputPath = path.resolve( __dirname, '../output/' );

const jsonFiles = {
	'hvc-table': hvcTable.createTable()
};

writeJsonFiles( outputPath, jsonFiles );
