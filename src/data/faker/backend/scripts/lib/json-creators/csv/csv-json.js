const generateSchema = require( '../../generate-schema' );

module.exports = {

	createList: ( year ) => generateSchema( '/csv/list.schema', year )
};
