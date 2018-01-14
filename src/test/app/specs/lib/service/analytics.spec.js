const proxyquire = require( 'proxyquire' );

const modulePath = '../../../../../app/lib/service/analytics';

const COOKIE_NAME = '_ga';

let analyticsService;
let config;
let req;
let ua;
let mockTracker;
let reporter;

function createService(){

	mockTracker = {
		event: jasmine.createSpy( 'tracker.event' )
	};
	ua = jasmine.createSpy( 'universal-analytics' ).and.callFake( () => mockTracker );
	reporter = {
		message: jasmine.createSpy( 'reporter.message' )
	};

	analyticsService = proxyquire( modulePath, {
		'universal-analytics': ua,
		'../../config': config,
		'../reporter': reporter
	} );
}

describe( 'Creating a tracker', function(){

	beforeEach( function(){

		req = {
			cookies: {}
		};
	} );

	describe( 'When an analytics id is in the config', function(){

		beforeEach( function(){

			config = { analyticsId: 'abc123' };
			createService();
		} );

		describe( 'When there is an id cookie', function(){

			describe( 'When the id cookie matches the pattern', function(){

				it( 'Should use the matching part', function(){

					const uid = '23456.789';
					req.cookies[ COOKIE_NAME ] = 'ab1.1.' + uid;
					const tracker = analyticsService.createTracker( req );

					expect( ua ).toHaveBeenCalledWith( config.analyticsId, uid, { strictCidFormat: false, https: true }  );
					expect( tracker.tracker ).toEqual( mockTracker );
				} );
			} );

			describe( 'When the id cookie does not match the pattern', function(){

				it( 'Should use the whole cookie value', function(){

					const uid = 'abc123';
					req.cookies[ COOKIE_NAME ] = uid;
					const tracker = analyticsService.createTracker( req );

					expect( ua ).toHaveBeenCalledWith( config.analyticsId, uid, { strictCidFormat: false, https: true }  );
					expect( tracker.tracker ).toEqual( mockTracker );
				} );
			} );

			describe( 'The tracker', function(){

				let tracker;

				beforeEach( function(){

					req.cookies[ COOKIE_NAME ] = 'abc123';
					tracker = analyticsService.createTracker( req );
				} );

				describe( 'downloadCsvFile', function(){

					let path;
					let action;
					let fileName;
					let args;

					beforeEach( function(){

						path = '/my/path/';
						action = 'CSV - test';
						fileName = 'Some file';

						tracker.downloadCsvFile( path, action, fileName );

						args = mockTracker.event.calls.argsFor( 0 );
					} );

					it( 'Should track the correct event', function(){

						expect( args[ 0 ] ).toEqual( {

							eventCategory: 'Downloads',
							eventAction: action,
							eventLabel: fileName,
							documentPath: path,
							dataSource: 'web',
							documentTitle: 'CSV download'

						} );

						expect( typeof args[ 1 ] ).toEqual( 'function' );
					} );

					describe( 'When the event tracking calls the callback with an error', function(){

						it( 'Should report the error the reporter', function(){

							args[ 1 ]( new Error( 'Unable to track event' ) );

							expect( reporter.message ).toHaveBeenCalledWith( 'info', 'Unable to send Downloads event to Google Analytics', {
								eventAction: action,
								eventLabel: fileName,
							} );
						} );
					} );

					describe( 'When the event tracking calls the callback without an error', function(){

						it( 'Should not report an error', function(){

							args[ 1 ]( null );

							expect( reporter.message ).not.toHaveBeenCalled();
						} );
					} );
				} );

				describe( 'loadAllTopMarkets', function(){

					let path;
					let action;
					let fileName;
					let args;

					beforeEach( function(){

						path = '/my/path/';
						action = 'CSV - test';
						fileName = 'Some file';

						tracker.loadAllTopMarkets( path, action, fileName );

						args = mockTracker.event.calls.argsFor( 0 );
					} );

					it( 'Should track the correct event', function(){

						expect( args[ 0 ] ).toEqual( {

							eventCategory: 'Load All',
							eventAction: action,
							eventLabel: fileName,
							documentPath: path,
							dataSource: 'web',
							documentTitle: 'Load all top markets'

						} );

						expect( typeof args[ 1 ] ).toEqual( 'function' );
					} );

					describe( 'When the event tracking calls the callback with an error', function(){

						it( 'Should report the error the reporter', function(){

							args[ 1 ]( new Error( 'Unable to track event' ) );

							expect( reporter.message ).toHaveBeenCalledWith( 'info', 'Unable to send Load All event to Google Analytics', {
								eventAction: action,
								eventLabel: fileName,
							} );
						} );
					} );

					describe( 'When the event tracking calls the callback without an error', function(){

						it( 'Should not report an error', function(){

							args[ 1 ]( null );

							expect( reporter.message ).not.toHaveBeenCalled();
						} );
					} );
				} );
			} );
		} );

		describe( 'When there is not an id in the cookie', function(){

			describe( 'When there is not a user', function(){

				it( 'Should log an event to sentry', function(){

					req.url = '/my/fake/url/';

					const tracker = analyticsService.createTracker( req );

					expect( tracker ).not.toBeDefined();
					expect( reporter.message ).toHaveBeenCalledWith( 'info', `No user in req for ${ req.url }` );
				} );
			} );

			describe( 'When there is a user in the req', function(){

				beforeEach( function(){

					req.user = {};
				} );

				describe( 'When the user internal', function(){

					it( 'Should not create the tracker and a message should not be sent to Sentry', function(){

						req.user.internal = true;

						const tracker = analyticsService.createTracker( req );

						expect( tracker ).not.toBeDefined();
						expect( reporter.message ).not.toHaveBeenCalled();
					} );
				} );

				describe( 'When the user is not an internal user', function(){

					it( 'Should not create a tracker and send sentry a message', function(){

						const tracker = analyticsService.createTracker( req );

						expect( tracker ).not.toBeDefined();
						expect( reporter.message ).toHaveBeenCalledWith( 'info', 'No Google Analytics id cookie found - cannot create tracker' );
					} );
				} );
			} );
		} );
	} );

	describe( 'When there is not an analytics id in the config', function(){

		beforeEach( function(){

			config = {};
			createService();
		} );

		it( 'Should not create a tracker', function(){

			const tracker = analyticsService.createTracker( req );
			expect( ua ).not.toHaveBeenCalled();
			expect( tracker ).not.toBeDefined();
		} );
	} );
} );
