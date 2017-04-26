const config = require( '../../../../app/config' );
const supertest = require( 'supertest' );
const proxyquire = require( 'proxyquire' );
const winston = require( 'winston' );

const logger = require( '../../../../app/lib/logger' );

const interceptBackend = require( '../../helpers/intercept-backend' );

const app = proxyquire( '../../../../app/lib/app', {

	'./middleware/alice': function( req, res, next ){ req.alice = {}; next(); },
	'./middleware/uuid': function ( req, res, next ){ next(); },
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

		describe( 'When the API returns a status of 200', function(){

			it( 'Should return a 200 with the correct heading', function( done ){

				interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );

				supertest( app ).get( '/' ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 200 );
					expect( getTitle( res ) ).toEqual( 'MI - Homepage' );
					done();
				} );
			} );
		} );

		describe( 'When the API returns a status of 500', function(){

			it( 'Should return a 500', function( done ){

				interceptBackend.getStub( '/mi/sector_teams/?year=2017', 500 );

				supertest( app ).get( '/' ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 500 );
					done();
				} );
			} );
		} );

		describe( 'When the osRegions query param is used', function(){

			describe( 'When one the APIs returns a status of 500', function(){

				it( 'Should return a 500', function( done ){

					interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );
					interceptBackend.getStub( '/mi/os_regions/?year=2017', 500 );

					supertest( app ).get( '/?osRegions=true' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 500 );
						done();
					} );
				} );
			} );

			describe( 'When both the API returns a status of 500', function(){

				it( 'Should return a 500', function( done ){

					interceptBackend.getStub( '/mi/sector_teams/?year=2017', 500 );
					interceptBackend.getStub( '/mi/os_regions/?year=2017', 500 );

					supertest( app ).get( '/?osRegions=true' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 500 );
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'Sector Teams', function(){

		describe( 'Overview', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( '/mi/sector_teams/overview/?year=2017', 200, '/sector_teams/overview' );

					supertest( app ).get( '/sector-teams/overview/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Sector Teams Overview' );
						done();
					} );
				} );
			} );
		} );

		describe( 'List', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );

					supertest( app ).get( '/sector-teams/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Sector Teams' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Sector Team detail', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( '/mi/sector_teams/1/?year=2017', 200, '/sector_teams/sector_team' );
					interceptBackend.getStub( '/mi/sector_teams/1/months/?year=2017', 200, '/sector_teams/months' );
					interceptBackend.getStub( '/mi/sector_teams/1/campaigns/?year=2017', 200, '/sector_teams/campaigns' );
					interceptBackend.getStub( '/mi/sector_teams/1/top_non_hvcs/?year=2017', 200, '/sector_teams/top_non_hvcs' );

					supertest( app ).get( '/sector-teams/1/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - distinctio quas &amp; numquam Sector Team' );
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

					interceptBackend.getStub( '/mi/hvc_groups/?year=2017', 200, '/hvc_groups/' );

					supertest( app ).get( '/hvc-groups/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - HVC Groups' );
						done();
					} );
				} );
			} );
		} );

		describe( 'HVC Group detail', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( '/mi/hvc_groups/1/?year=2017', 200, '/hvc_groups/group' );
					interceptBackend.getStub( '/mi/hvc_groups/1/months/?year=2017', 200, '/hvc_groups/months' );
					interceptBackend.getStub( '/mi/hvc_groups/1/campaigns/?year=2017', 200, '/hvc_groups/campaigns' );

					supertest( app ).get( '/hvc-groups/1/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - HVC Group - sunt laborum &amp; quos' );
						done();
					} );
				} );
			} );
		} );
	} );

if( config.backend.mock ){

	describe( 'HVC', function(){

		describe( 'Detail', function(){

			it( 'Should return 200', function( done ){

				supertest( app ).get( '/hvc/E022/' ).end( ( err, res ) => {

					expect( res.statusCode ).toEqual( 200 );
					expect( getTitle( res ) ).toEqual( 'MI - E1234 Abc Advanced Manufacturing - Marine' );
					done();
				} );
			} );
		} );
	} );

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

					interceptBackend.getStub( '/mi/os_regions/overview/?year=2017', 200, '/os_regions/overview' );

					supertest( app ).get( '/overseas-regions/overview/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Regions Overview' );
						done();
					} );
				} );
			} );
		} );

		describe( 'List', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( '/mi/os_regions/?year=2017', 200, '/os_regions/' );

					supertest( app ).get( '/overseas-regions/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Regions' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Sector Team detail', function(){

			describe( 'When the API returns a status of 200', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( '/mi/os_regions/1/?year=2017', 200, '/os_regions/region' );
					interceptBackend.getStub( '/mi/os_regions/1/months/?year=2017', 200, '/os_regions/months' );
					interceptBackend.getStub( '/mi/os_regions/1/campaigns/?year=2017', 200, '/os_regions/campaigns' );
					interceptBackend.getStub( '/mi/os_regions/1/top_non_hvcs/?year=2017', 200, '/os_regions/top_non_hvcs' );

					supertest( app ).get( '/overseas-regions/1/' ).end( ( err, res ) => {

						expect( res.statusCode ).toEqual( 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Overseas Region - minima explicabo &amp; architecto' );
						done();
					} );
				} );
			} );
		} );
	} );

	describe( 'Select Year', function(){

		it( 'Should render the view', function( done ){

			supertest( app ).get( '/select-year' ).end( ( err, res ) => {

				expect( res.statusCode ).toEqual( 200 );
				expect( getTitle( res ) ).toEqual( 'MI - Select year' );
				done();
			} );
		} );
	} );
} );
