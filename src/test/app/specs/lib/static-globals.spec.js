const proxyquire = require( 'proxyquire' );

describe( 'Static globals', function(){

	const analyticsId = 'abc123';
	const financialYearStart = 2016;
	const financialYearEnd = 2018;
	const datahubDomain = 'https://some-domain.com';

	let calls;
	let staticGlobals;

	beforeEach( function(){

		const stubs = {
			'../config': {
				analyticsId,
				financialYear: {
					start: financialYearStart,
					end: financialYearEnd
				},
				datahubDomain
			}
		};

		staticGlobals = proxyquire( '../../../../app/lib/static-globals', stubs );

		const env = {
			addGlobal: jasmine.createSpy( 'env.addGlobal' )
		};

		staticGlobals( env );
		calls = env.addGlobal.calls;
	} );

	it( 'Should add the asset_path to the nunjucks env', function(){

		const args = calls.argsFor( 0 );

		expect( args[ 0 ] ).toEqual( 'asset_path' );
		expect( args[ 1 ] ).toEqual( '/public/' );
	} );

	it( 'Should add the analyticsId to the nunjucks env', function(){

		const args = calls.argsFor( 1 );

		expect( args[ 0 ] ).toEqual( 'analyticsId' );
		expect( args[ 1 ] ).toEqual( analyticsId );
	} );

	describe( 'financialYearStart', function(){

		let yearList = [];

		beforeAll( function(){

			let year = financialYearStart;

			while( year <= financialYearEnd ){
				yearList.push( { year, label: `${ year }/${ ( year + 1 ).toString().substr( 2, 4) }` } );
				year++;
			}
		} );

		describe( 'When the financialYearStart is a Number', function(){

			it( 'Should add the list of years to the nunjucks env', function(){

				const args = calls.argsFor( 2 );

				expect( args[ 0 ] ).toEqual( 'yearList' );
				expect( args[ 1 ] ).toEqual( yearList );
			} );
		} );

		describe( 'When the financialYearStart is a String from an env var', function(){

			it( 'Should add the list of years to the nunjucks env and they should all be Numbers', function(){

				const financialYearStart = '2016';

				const stubs = {
					'../config': {
						analyticsId,
						financialYear: {
							start: financialYearStart,
							end: financialYearEnd
						}
					}
				};

				staticGlobals = proxyquire( '../../../../app/lib/static-globals', stubs );

				const env = {
					addGlobal: jasmine.createSpy( 'env.addGlobal' )
				};

				staticGlobals( env );

				const args = env.addGlobal.calls.argsFor( 2 );

				expect( args[ 0 ] ).toEqual( 'yearList' );
				expect( args[ 1 ] ).toEqual( yearList );

				for( let { year } of args[ 1 ] ){
					expect( typeof year ).toEqual( 'number' );
				}
			} );
		} );
	} );

	it( 'Should add the default title to the nunjucks env', function(){

		const args = calls.argsFor( 3 );

		expect( args[ 0 ] ).toEqual( 'titleDefault' );
		expect( args[ 1 ] ).toEqual( 'Department for International Trade' );
	} );

	it( 'Should add the default service to the nunjucks env', function(){

		const args = calls.argsFor( 4 );

		expect( args[ 0 ] ).toEqual( 'serviceTitle' );
		expect( args[ 1 ] ).toEqual( 'Data Hub' );
	} );

	it( 'Should add the default service to the nunjucks env', function(){

		const args = calls.argsFor( 5 );

		expect( args[ 0 ] ).toEqual( 'projectPhase' );
		expect( args[ 1 ] ).toEqual( 'beta' );
	} );

	it( 'Should add the default service to the nunjucks env', function(){

		const args = calls.argsFor( 6 );

		expect( args[ 0 ] ).toEqual( 'feedbackLink' );
		expect( args[ 1 ] ).toEqual( `${ datahubDomain }/support` );
	} );

	it( 'Should add the headerLink to the nunjucks env', function(){

		const args = calls.argsFor( 7 );

		expect( args[ 0 ] ).toEqual( 'headerLink' );
		expect( args[ 1 ] ).toEqual( `${ datahubDomain }/` );
	} );

	it( 'Should add the profileLink to the nunjucks env', function(){

		const args = calls.argsFor( 8 );

		expect( args[ 0 ] ).toEqual( 'profileLink' );
		expect( args[ 1 ] ).toEqual( `${ datahubDomain }/profile` );
	} );

	it( 'Should add the win table columns to the nunjucks env', function(){

		const args = calls.argsFor( 9 );

		expect( args[ 0 ] ).toEqual( 'winTableColumns' );
		expect( Array.isArray( args[ 1 ].hvc ) ).toEqual( true );
		expect( Array.isArray( args[ 1 ].nonHvc ) ).toEqual( true );
		expect( Array.isArray( args[ 1 ].ukRegions.hvc ) ).toEqual( true );
		expect( Array.isArray( args[ 1 ].ukRegions.nonHvc ) ).toEqual( true );
	} );

	it( 'Should add the fdi table columns to the nunjucks env', function(){

		const args = calls.argsFor( 10 );

		expect( args[ 0 ] ).toEqual( 'fdiTableColumns' );
		expect( Array.isArray( args[ 1 ].hvc ) ).toEqual( true );
		expect( Array.isArray( args[ 1 ].nonHvc ) ).toEqual( true );
	} );
} );
