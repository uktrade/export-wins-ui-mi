const generateSchema = require( '../../generate-schema' );

module.exports = {

	createList: ( year ) => generateSchema( '/countries/index.schema', year ),
	createWinTable: ( year ) => generateSchema( '/countries/win_table.schema', year )
};
