const config = require( '../../../config' );
const { sessionGet, sessionPost, get, post } = require( './_helpers' );

const internalUsers = config.internalUsers.split( ',' );

module.exports = {

	export: require( './export' ),
	investment: require( './investment' ),

	getCsvFileList: function( req ){

		return sessionGet( '/mi/csv_files/latest/', req );
	},

	getCsvFileUrl: function( req, fileId ){

		return sessionGet( `/mi/csv_files/generate_otu/${ fileId }/`, req );
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

			user.internal = !!~internalUsers.indexOf( user.email );

			return user;
		} );
	}
};
