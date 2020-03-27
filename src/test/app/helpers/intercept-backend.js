const nock = require( 'nock' );
const config = require( '../../../app/config' );
const getBackendStub = require( './get-backend-stub' );

function getNock(){

	return nock( config.backend.href );
}

function get( path ){
	
	return getNock().get( path );
}

function post( path ){
	
	return getNock().post( path );
}

module.exports = {

	get,
	post,

	getStub: function( path, statusCode, stubPath ){

		let data;

		if( stubPath ){

			data = getBackendStub( stubPath );
		}

		return get( path ).reply( statusCode, data );
	}
};
