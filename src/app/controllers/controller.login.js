const backendService = require( '../lib/service/service.backend' );
const reporter = require( '../lib/reporter' );
const getSessionId = require( '../lib/get-session-id' );
const getRedirectUri = require('../lib/get-redirect-uri');
const config = require( '../config' );

const MAX_LEN = Number( config.oauthParamLength );
const isAlpha = /^[a-zA-Z0-9]+$/;

function createClearCookieStr( name ){

	const parts = [
		`${ name }=`,
		'HttpOnly',
		'Path=/',
		`Expires=${ ( new Date( 1 ) ).toGMTString() }`
	];

	if( !config.isDev ){

		parts.push( 'Secure' );
	}

	return parts.join( '; ' );
}

function createClearUserCookie(){

	return createClearCookieStr( config.userCookie.name );
}

function convertDataCookieToLocalCookie(cookieFromData) {

	const localCookie = cookieFromData
		.split("; ")
		.filter((part) => {
			if (part.startsWith('Domain=')) return false;
			if (part.startsWith('Secure') && config.isDev) return false;

			return part;
		})
		.join('; ');

	return localCookie;
}

function createUnableToLoginHandler( res ){

	return function( e ){
		res.status( 500 );
		res.render( 'error/unable-to-login.html' );
		reporter.captureException( e );
	};
}

module.exports = {

	oauth: function( req, res ){

		return backendService.getOauthUrl( req.query.next, getRedirectUri(req) ).then( ( info ) => {

			const json = info.data;

			res.set( 'Set-Cookie', [ createClearUserCookie() ] );

			if( json && json.target_url ){

				res.redirect( json.target_url );

			} else {

				throw new Error( 'No target_url' );
			}

		} ).catch( createUnableToLoginHandler( res ) );
	},

	oauthCallback: function( req, res ){

		const error = req.query.error;
		const code = ( req.query.code || '' );
		const state = ( req.query.state || '' );

		if( error ){

			const err = new Error( 'oAuth callback error' );
			err.param = error;

			createUnableToLoginHandler( res )( err );
			return;
		}

		const paramLengthOk = code.length < MAX_LEN && state.length < MAX_LEN;
		const paramContentOk = paramLengthOk && isAlpha.test( code ) && isAlpha.test( state );
		if( paramContentOk ){
			const redirectUri = encodeURIComponent(getRedirectUri(req));
			return backendService.postOauthCallback( `code=${ code }&state=${ state }&redirect_uri=${redirectUri}` ).then( ( info ) => {
				const response = info.response;
				const data = info.data;

				const sessionCookie = getSessionId( response.headers[ 'set-cookie' ] );
				const localCookie = convertDataCookieToLocalCookie(sessionCookie);
				res.set( 'Set-Cookie', [ localCookie ] );

				res.redirect( data && data.next || '/' );

			} ).catch( createUnableToLoginHandler( res ) );

		} else {
			
			throw new Error( 'Invalid oauth params' );
		}
	},

	signout: function( req, res ){

		res.set( 'Set-Cookie', [ createClearCookieStr( 'sessionid' ) ] );
		res.redirect( `${ config.datahubDomain }/oauth/sign-out` );
	}
};
