const generateSchema = require( '../../generate-schema' );

module.exports = {

	createList: ( year ) => generateSchema( '/posts/index.schema', year ),
	createWinTable: ( year ) => generateSchema( '/posts/win_table.schema', year )
};
