const config = require( '../../../config' );
const { sessionGet, sessionPost, get, post } = require( './_helpers' );
const transformCsvFiles = require( '../../transformers/csv-files' );

const internalUsers = config.internalUsers.split( ',' );
const fdiUsers = config.fdiUsers.split( ',' );

module.exports = {

	export: require( './export' ),
	investment: require( './investment' ),

	getCsvFileList: function( req ){

		return sessionGet( '/csv/all_files/', req ).then( transformCsvFiles );
	},

	getCsvFileUrl: function( req, fileId ){

		return sessionGet( `/csv/generate_otu/${ fileId }/`, req );
	},

	getOauthUrl: function( next ){

		let path = '/oauth2/auth_url/';

		if( next ){

			path += `?next=${ encodeURIComponent( next ) }`;
		}

		return get( path );
	},

	postOauthCallback: function( params ){

		return post( '/oauth2/callback/', params );
	},

	getSamlMetadata: function( req ){

		//TODO: This probably doesn't need the session here
		return sessionGet( '/saml2/metadata/', req ).then( ( info ) => info.data );
	},

	sendSamlXml: function( req ){

		return sessionPost( '/saml2/acs/', req, req.data );
	},

	getSamlLogin: function( req ){

		return sessionGet( '/saml2/login/', req );
	},

	getUserInfo: function( req ){

		return sessionGet( '/user/me/', req ).then( ( info ) => {

			const user = info.data;

			user.internal = ( config.isDev || !!~internalUsers.indexOf( user.email ) );
			user.fdi = ( user.internal || !!~fdiUsers.indexOf( user.email ) );

			return user;
		} );
	}
};
