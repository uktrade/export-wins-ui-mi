const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createList: ( year ) => generateSchema( '/countries/index.schema', year ),
	createWinTable: ( year ) => generateSchema( '/countries/win_table.schema', year )
};
