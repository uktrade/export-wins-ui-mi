const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );
const reporter = require( '../lib/reporter' );
const getSessionId = require( '../lib/get-session-id' );
const config = require( '../config' );

const MAX_LEN = Number( config.oauthParamLength );
const isAlpha = /^[a-zA-Z0-9]+$/;
const isDev = ( ( process.env.NODE_ENV || 'development' ) === 'development' );

module.exports = {

	oauth: function( req, res ){

		backendService.getOauthUrl().then( ( info ) => {

			const json = info.data;

			res.clearCookie( config.userCookieName, { httpOnly: true, secure: !isDev } );

			if( json && json.target_url ){

				res.redirect( json.target_url );

			} else {

				throw new Error( 'No target_url' );
			}

		} ).catch( renderError.createHandler( res ) );
	},

	oauthCallback: function( req, res ){

		const code = ( req.query.code || '' );
		const state = ( req.query.state || '' );

		if( code.length < MAX_LEN && state.length < MAX_LEN && isAlpha.test( code ) && isAlpha.test( state ) ){

			backendService.postOauthCallback( `code=${ code }&state=${ state }` ).then( ( info ) => {

				const response = info.response;
				const cookies = response.headers[ 'set-cookie' ];
				const sessionCookie = getSessionId( cookies );

				res.set( 'Set-Cookie', [ sessionCookie ] );
				res.redirect( '/' );

			} ).catch( ( e ) => {

				res.render( 'error/unable-to-login.html' );
				reporter.captureException( e );
			} );

		} else {

			throw new Error( 'Invalid oauth params' );
		}
	},

	saml: function( req, res ){

		backendService.getSamlLogin( req ).then( ( info ) => {

			const response = info.response;
			const token = info.data;

			res.clearCookie( config.userCookieName, { httpOnly: true, secure: !isDev } );
			res.set( 'Set-Cookie', response.headers[ 'set-cookie' ] );
			res.render( 'login.html', { token } );

		} ).catch( renderError.createHandler( res ) );
	}
};
