const nock = require( 'nock' );
const config = require( '../../../app/config' );
const getBackendStub = require( './get-backend-stub' );

function get( path ){

	return nock( config.backend.href ).get( path );
}

module.exports = {

	get,

	getStub: function( path, statusCode, stubPath ){

		let data;

		if( stubPath ){

			data = getBackendStub( stubPath );
		}

		return get( path ).reply( statusCode, data );
	}
};
