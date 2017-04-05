const path = require( 'path' );
const writeJsonFiles = require( './faker/helpers/write-json-files' );

const hvcTable = require( './faker/mocks/scripts/hvc-table-json' );

const outputPath = path.resolve( __dirname, 'fake-stubs/mocks' );

const jsonFiles = {

	'hvc-table': hvcTable.createTable()
};

writeJsonFiles( outputPath, jsonFiles );
