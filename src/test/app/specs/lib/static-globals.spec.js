const proxyquire = require( 'proxyquire' );

describe( 'Static globals', function(){

	const feedbackEmail = 'test@test.com';
	const feedbackSurvey = 'http://123abc';
	const analyticsId = 'abc123';
	const faqLink = 'http://abc123.com';

	let calls;
	let staticGlobals;

	beforeEach( function(){

		const stubs = {
			'../config': {
				feedbackEmail,
				feedbackSurvey,
				analyticsId,
				faqLink
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

	it( 'Should add the feedbackSurvey to the nunjucks env', function(){

		const args = calls.argsFor( 1 );

		expect( args[ 0 ] ).toEqual( 'feedbackSurvey' );
		expect( args[ 1 ] ).toEqual( feedbackSurvey );
	} );

	it( 'Should add the asset_path to the nunjucks env', function(){

		const args = calls.argsFor( 2 );

		expect( args[ 0 ] ).toEqual( 'asset_path' );
		expect( args[ 1 ] ).toEqual( '/public/uktrade/' );
	} );

	it( 'Should add the analyticsId to the nunjucks env', function(){

		const args = calls.argsFor( 3 );

		expect( args[ 0 ] ).toEqual( 'analyticsId' );
		expect( args[ 1 ] ).toEqual( analyticsId );
	} );

	it( 'Should add the faqLink to the nunjucks env', function(){

		const args = calls.argsFor( 4 );

		expect( args[ 0 ] ).toEqual( 'faqLink' );
		expect( args[ 1 ] ).toEqual( faqLink );
	} );
} );
