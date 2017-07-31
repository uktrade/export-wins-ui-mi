const request = require( 'request' );

function EndpointCheck( url, cb ){

	console.log( `Checking connection to: ${ url }` );

	this.url = url;
	this.cb = cb;

	this.attempts = 0;
	this.attemptLimit = 60;
	this.attemptDelay = 1000;
	this.attemptInProgress = false;

	this.makeRequest();
}

EndpointCheck.prototype.makeRequest = function(){

	if( this.attemptInProgress ){ return; }

	this.attempts++;
	this.attemptInProgress = true;

	request( this.url, this.handleResponse.bind( this ) );
};

EndpointCheck.prototype.handleResponse = function( err, response, body ){

	this.attemptInProgress = false;

	if( err ){

		this.fail( err );

	} else {

		if( response.statusCode === 200 ){

			console.log( `Success connecting to: ${ this.url }` );
			this.cb( null, response, body );

		} else {

			this.fail();
		}
	}
};

EndpointCheck.prototype.fail = function( rootErr ){

	if( this.attempts <= this.attemptLimit ){

		setTimeout( this.makeRequest.bind( this ), this.attemptDelay );

	} else {

		const error = new Error( 'Too many failed attempts' );

		if( rootErr ){

			error.rootError = rootErr;
		}

		this.cb( error );
	}
};

module.exports = EndpointCheck;
