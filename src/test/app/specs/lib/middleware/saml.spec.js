
const proxyquire = require( 'proxyquire' );

describe( 'saml middleware', function(){

	let req;
	let res;
	let next;
	let middleware;
	let samlSpy;

	const responseXml = '<md:EntityDescriptor xmlns:ds="http://www.w3.org/2000/09/xmldsig#"/>';

	beforeEach( function(){

		req = {
			alice: '123abc',
			url: '/'
		};
		res = {
			set: jasmine.createSpy( 'res.set' ),
			send: jasmine.createSpy( 'res.send' )
		};
		next = jasmine.createSpy( 'next' );

		samlSpy = jasmine.createSpy( 'getSamlMetadata' ).and.callFake( function(){
			return new Promise( ( resolve ) => {
				resolve(  responseXml );
			} );
		} );

		const stubs = {
			'../service/service.backend': {
				getSamlMetadata: samlSpy
			}
		};

		middleware = proxyquire( '../../../../../app/lib/middleware/saml', stubs );
	} );

	describe( 'When the url matches the pattern', function(){

		it( 'Should return the metadata', function( done ){

			next.and.callFake( done.fail );
			res.send.and.callFake( () => {

				expect( res.set ).toHaveBeenCalledWith( 'Content-Type', 'text/xml' );
				expect( res.send ).toHaveBeenCalledWith( responseXml );
				done();
			} );

			req.url = '/saml2/metadata/';

			middleware( req, res, next );
		} );
	} );

	describe( 'When the url does not match the pattern', function(){

		it( 'Should call next', function(){

			middleware( req, res, next );

			expect( next ).toHaveBeenCalled();
		} );
	} );
} );
