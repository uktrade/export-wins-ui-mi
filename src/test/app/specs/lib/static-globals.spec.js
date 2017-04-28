const proxyquire = require( 'proxyquire' );

describe( 'Static globals', function(){

	const feedbackEmail = 'test@test.com';
	const analyticsId = 'abc123';

	let calls;
	let staticGlobals;

	beforeEach( function(){

		const stubs = {
			'../config': {
				feedbackEmail,
				analyticsId
			}
		};

		staticGlobals = proxyquire( '../../../../app/lib/static-globals', stubs );

		const env = {
			addGlobal: jasmine.createSpy( 'env.addGlobal' )
		};

		staticGlobals( env );
		calls = env.addGlobal.calls;
	} );

	it( 'Should add the feedbackEmail to the nunjucks env', function(){

		const args = calls.argsFor( 0 );

		expect( args[ 0 ] ).toEqual( 'feedbackEmail' );
		expect( args[ 1 ] ).toEqual( feedbackEmail );
	} );

	it( 'Should add the asset_path to the nunjucks env', function(){

		const args = calls.argsFor( 1 );

		expect( args[ 0 ] ).toEqual( 'asset_path' );
		expect( args[ 1 ] ).toEqual( '/public/uktrade/' );
	} );

	it( 'Should add the analyticsId to the nunjucks env', function(){

		const args = calls.argsFor( 2 );

		expect( args[ 0 ] ).toEqual( 'analyticsId' );
		expect( args[ 1 ] ).toEqual( analyticsId );
	} );
} );
