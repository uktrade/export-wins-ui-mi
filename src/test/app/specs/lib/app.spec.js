const config = require( '../../../../app/config' );
const supertest = require( 'supertest' );
const proxyquire = require( 'proxyquire' );
const winston = require( 'winston' );

const logger = require( '../../../../app/lib/logger' );

const interceptBackend = require( '../../helpers/intercept-backend' );

const app = proxyquire( '../../../../app/lib/app', {
	'morgan': function(){ return function ( req, res, next ){ next(); }; }
} );

const createApp = app.create;

function getTitle( res ){

	const text = res.text;
	const openTag = '<title>';
	const openTagIndex = text.indexOf( openTag );
	const closeTagIndex = text.indexOf( '</title>', openTagIndex );
	const title = text.substring( ( openTagIndex + openTag.length ), closeTagIndex );

	return title;
}

function checkResponse( res, statusCode ){

	const headers = res.headers;

	expect( res.statusCode ).toEqual( statusCode );
	expect( headers[ 'x-download-options' ] ).toBeDefined();
	expect( headers[ 'x-xss-protection' ] ).toBeDefined();
	expect( headers[ 'x-content-type-options' ] ).toBeDefined();
	expect( headers[ 'x-frame-options' ] ).toBeDefined();
}

function returnUser(){
	interceptBackend.getStub( '/user/me/', 200, '/user/me' );
}

describe( 'App', function(){

	let app;
	let oldTimeout;

	beforeEach( function(){

		app = createApp();
		logger.remove( winston.transports.Console );
		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
	} );

	afterEach( function(){
		logger.add( winston.transports.Console );
		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	describe( 'Index page', function(){

		describe( 'When all APIs return a status of 200', function(){

			it( 'Should return a 200 with the correct heading', function( done ){

				returnUser();
				interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );
				interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 200, '/os_region_groups/index.2017' );
				interceptBackend.getStub( '/mi/global_hvcs/?year=2017', 200, '/global_hvcs/' );
				interceptBackend.getStub( '/mi/global_wins/?year=2017', 200, '/global_wins/' );

				supertest( app ).get( '/' ).end( ( err, res ) => {

					checkResponse( res, 200 );
					expect( getTitle( res ) ).toEqual( 'MI - Homepage' );
					done();
				} );
			} );
		} );

		describe( 'When one of the APIs returns a status of 500', function(){

			it( 'Should return a 500', function( done ){

				returnUser();
				interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );
				interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 500 );
				interceptBackend.getStub( '/mi/global_hvcs/?year=2017', 200, '/global_hvcs/' );
				interceptBackend.getStub( '/mi/global_wins/?year=2017', 200, '/global_wins/' );

				supertest( app ).get( '/' ).end( ( err, res ) => {

					checkResponse( res, 500 );
					done();
				} );
			} );
		} );

		describe( 'When all the APIs return a status of 500', function(){

			it( 'Should return a 500', function( done ){

				returnUser();
				interceptBackend.getStub( '/mi/sector_teams/?year=2017', 500 );
				interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 500 );
				interceptBackend.getStub( '/mi/global_hvcs/?year=2017', 500 );
				interceptBackend.getStub( '/mi/global_wins/?year=2017', 500 );

				supertest( app ).get( '/' ).end( ( err, res ) => {

					checkResponse( res, 500 );
					done();
				} );
			} );
		} );
	} );

	describe( 'Sector Teams', function(){

		describe( 'Overview', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/sector_teams/overview/?year=2017', 200, '/sector_teams/overview' );

					supertest( app ).get( '/sector-teams/overview/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Sector Teams Overview' );
						done();
					} );
				} );
			} );
		} );

		describe( 'List', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );

					supertest( app ).get( '/sector-teams/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Sector Teams' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Sector Team detail', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/sector_teams/1/?year=2017', 200, '/sector_teams/sector_team' );
					interceptBackend.getStub( '/mi/sector_teams/1/months/?year=2017', 200, '/sector_teams/months' );
					interceptBackend.getStub( '/mi/sector_teams/1/campaigns/?year=2017', 200, '/sector_teams/campaigns' );
					interceptBackend.getStub( '/mi/sector_teams/1/top_non_hvcs/?year=2017', 200, '/sector_teams/top_non_hvcs' );

					supertest( app ).get( '/sector-teams/1/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - distinctio quas &amp; numquam Sector Team' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Win list', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/sector_teams/1/win_table/?year=2017', 200, '/sector_teams/win_table' );

					supertest( app ).get( '/sector-teams/1/wins/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Sector Team - animi architecto nam' );
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'HVC Groups', function(){

		describe( 'List', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/hvc_groups/?year=2017', 200, '/hvc_groups/' );

					supertest( app ).get( '/hvc-groups/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - HVC Groups' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Detail', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/hvc_groups/1/?year=2017', 200, '/hvc_groups/group' );
					interceptBackend.getStub( '/mi/hvc_groups/1/months/?year=2017', 200, '/hvc_groups/months' );
					interceptBackend.getStub( '/mi/hvc_groups/1/campaigns/?year=2017', 200, '/hvc_groups/campaigns' );

					supertest( app ).get( '/hvc-groups/1/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - HVC Group - sunt laborum &amp; quos' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Win list', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/hvc_groups/1/win_table/?year=2017', 200, '/hvc_groups/win_table' );

					supertest( app ).get( '/hvc-groups/1/wins/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - HVC Group - dolorem quos vero' );
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'HVC', function(){

		describe( 'Detail', function(){

			it( 'Should return 200', function( done ){

				const hvcId = 'E100';

				returnUser();
				interceptBackend.getStub( `/mi/hvc/${ hvcId }/?year=2017`, 200, '/hvc/hvc' );
				interceptBackend.getStub( `/mi/hvc/${ hvcId }/top_wins/?year=2017`, 200, '/hvc/markets' );

				supertest( app ).get( `/hvc/${ hvcId }/` ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 200 );
					expect( getTitle( res ) ).toEqual( 'MI - rerum blanditiis rerum' );
					done();
				} );
			} );
		} );

		describe( 'Win list', function(){

			it( 'Should return 200', function( done ){

				const hvcId = 'E100';

				returnUser();
				interceptBackend.getStub( `/mi/hvc/${ hvcId }/win_table/?year=2017`, 200, '/hvc/win_table' );

				supertest( app ).get( `/hvc/${ hvcId }/wins/` ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 200 );
					expect( getTitle( res ) ).toEqual( 'MI - non mollitia qui' );
					done();
				} );
			} );
		} );
	} );

if( config.backend.mock ){

	describe( 'Wins', function(){

		describe( 'List', function(){

			it( 'Should return 200', function( done ){

				supertest( app ).get( '/wins/' ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 200 );
					expect( getTitle( res ) ).toEqual( 'MI - List of wins' );
					done();
				} );
			} );
		} );
	} );

	describe( 'Win', function(){

		describe( 'Detail', function(){

			it( 'Should return 200', function( done ){

				supertest( app ).get( '/win/' ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 200 );
					expect( getTitle( res ) ).toEqual( 'MI - Win detail' );
					done();
				} );
			} );
		} );
	} );
}


	describe( 'Overseas Regions', function(){

		describe( 'Overview', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/os_regions/overview/?year=2017', 200, '/os_regions/overview.2017' );
					interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 200, '/os_region_groups/index.2017' );

					supertest( app ).get( '/overseas-regions/overview/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Regions Overview' );
						done();
					} );
				} );
			} );
		} );

		describe( 'List', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/os_regions/?year=2017', 200, '/os_regions/' );

					supertest( app ).get( '/overseas-regions/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Regions' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Overseas Region detail', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/os_regions/1/?year=2017', 200, '/os_regions/region' );
					interceptBackend.getStub( '/mi/os_regions/1/months/?year=2017', 200, '/os_regions/months' );
					interceptBackend.getStub( '/mi/os_regions/1/campaigns/?year=2017', 200, '/os_regions/campaigns' );
					interceptBackend.getStub( '/mi/os_regions/1/top_non_hvcs/?year=2017', 200, '/os_regions/top_non_hvcs' );

					supertest( app ).get( '/overseas-regions/1/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Region - minima explicabo &amp; architecto' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Overseas Region wins', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					returnUser();
					interceptBackend.getStub( '/mi/os_regions/1/win_table/?year=2017', 200, '/os_regions/win_table' );

					supertest( app ).get( '/overseas-regions/1/wins/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Region - sed blanditiis dolorum' );
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'Saml metadata', function(){

		it( 'Should return the metadata', function( done ){

			const xml = '<test>';

			interceptBackend.get( '/saml2/metadata/' ).reply( 200, xml );

			supertest( app ).get( '/saml2/metadata/' ).end( ( err, res ) => {

				checkResponse( res, 200 );
				expect( res.text ).toEqual( xml );
				done();
			} );
		} );
	} );

	describe( 'Saml acs', function(){

		const xml = '<xml/>';

		describe( 'When the response is success', function(){

			it( 'Should redirect', function( done ){

				const response = 'test';

				interceptBackend.post( '/saml2/acs/', xml ).reply( 200, response, {
					'Set-Cookie': 'sessionid=test'
				} );

				supertest( app ).post( '/saml2/acs/' ).end( ( err, res ) => {

					checkResponse( res, 302 );
					expect( res.text ).toEqual( 'Found. Redirecting to /' );
					done();
				} );
			} );
		} );

		describe( 'When the response is not a success', function(){

			describe( 'When it is a 403', function(){

				it( 'Should render the access denied page', function( done ){

					const response = '{ "code": 1, "message": "not in group" }';

					interceptBackend.post( '/saml2/acs/', xml ).reply( 403, response, {
						'Set-Cookie': 'sessionid=test',
						'Content-Type': 'application/json'
					} );

					supertest( app ).post( '/saml2/acs/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Access denied' );
						done();
					} );
				} );
			} );

			describe( 'When it is a 500', function(){

				it( 'Should render an unable to login error', function( done ){

					const response = '{ "code": 2, "message": "error" }';

					interceptBackend.post( '/saml2/acs/', xml ).reply( 500, response, {
						'Set-Cookie': 'sessionid=test',
						'Content-Type': 'application/json'
					} );

					supertest( app ).post( '/saml2/acs/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Unable to login' );
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'Login', function(){

		it( 'Should return a 200 with the correct heading', function( done ){

			interceptBackend.get( '/saml2/login/' ).reply( 200, 'test' );

			supertest( app ).get( '/login/' ).end( ( err, res ) => {

				checkResponse( res, 200 );
				expect( getTitle( res ) ).toEqual( 'MI - Login' );
				done();
			} );
		} );
	} );

	describe( '404 page', function(){

		it( 'Should render the 404 page', function( done ){

			supertest( app ).get( '/abc123' ).end( ( err, res ) => {

				checkResponse( res, 404 );
				expect( getTitle( res ) ).toEqual( 'MI - Not found' );
				done();
			} );
		} );
	} );

	describe( 'Ping', function(){

		it( 'Should return a status of 200', function( done ){

			supertest( app ).get( '/ping/' ).end( ( err, res ) => {

				checkResponse( res, 200 );
				done();
			} );
		} );
	} );

	describe( 'Environments', function(){

		let morgan;
		let disable;
		let compression;

		beforeEach( function(){

			morgan = jasmine.createSpy( 'morgan' );
			disable = jasmine.createSpy( 'app.disable' );
			compression = jasmine.createSpy( 'compression' );
		} );

		describe( 'Dev mode', function(){

			it( 'Should setup the app in dev mode', function(){

				const app = proxyquire( '../../../../app/lib/app', {
					'morgan': morgan,
					'compression': compression,
					'express': function(){
						return {
							use: jasmine.createSpy( 'app.use' ),
							get: () => 'development',
							set: jasmine.createSpy( 'app.set' ),
							disable,
							post: jasmine.createSpy( 'app.post' ),
						};
					}
				} );

				app.create();

				expect( morgan ).toHaveBeenCalledWith( 'dev' );
				expect( compression ).not.toHaveBeenCalled();
				expect( disable ).toHaveBeenCalledWith( 'x-powered-by' );
			} );
		} );

		describe( 'Prod mode', function(){

			it( 'Should setup the app in dev mode', function(){

				const app = proxyquire( '../../../../app/lib/app', {
					'morgan': morgan,
					'compression': compression,
					'express': function(){
						return {
							use: jasmine.createSpy( 'app.use' ),
							get: () => 'production',
							set: jasmine.createSpy( 'app.set' ),
							disable,
							post: jasmine.createSpy( 'app.post' ),
						};
					}
				} );

				app.create();

				expect( morgan ).toHaveBeenCalledWith( 'combined' );
				expect( compression ).toHaveBeenCalled();
				expect( disable ).toHaveBeenCalledWith( 'x-powered-by' );
			} );
		} );
	} );
} );
