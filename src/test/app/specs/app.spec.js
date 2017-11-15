const config = require( '../../../app/config' );
const supertest = require( 'supertest' );
const proxyquire = require( 'proxyquire' );
const winston = require( 'winston' );

const logger = require( '../../../app/lib/logger' );

const interceptBackend = require( '../helpers/intercept-backend' );

const app = proxyquire( '../../../app/app', {
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
	expect( headers[ 'cache-control' ] ).toEqual( 'no-cache, no-store' );
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

if( config.backend.mock ){

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

	describe( 'User pages', function(){

		let userIntercept;

		beforeEach( function(){

			userIntercept = interceptBackend.getStub( '/user/me/', 200, '/user/me' );
		} );

		afterEach( function(){

			expect( userIntercept.isDone() ).toEqual( true );
		} );

		describe( 'Downloads', function(){

			describe( 'The list of downloads', function(){

				it( 'Should return a status of 200', function( done ){

					interceptBackend.getStub( '/csv/all_files/', 200, '/csv/all_files' );

					supertest( app ).get( '/downloads/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Download raw data' );
						done();
					} );
				} );
			} );
		} );

		describe( 'Export', function(){

			describe( 'Index page', function(){

				describe( 'When all APIs return a status of 200', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );
						interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 200, '/os_region_groups/index.2017' );
						interceptBackend.getStub( '/mi/global_hvcs/?year=2017', 200, '/global_hvcs/' );
						interceptBackend.getStub( '/mi/global_wins/?year=2017', 200, '/global_wins/' );
						interceptBackend.getStub( '/mi/uk_regions/?year=2017', 200, '/uk_regions/' );

						supertest( app ).get( '/' ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Homepage' );
							done();
						} );
					} );

					describe( 'With a start date', function(){

						it( 'Should return the correct data', function( done ){

							interceptBackend.getStub( '/mi/sector_teams/?year=2017&date_start=1234', 200, '/sector_teams/' );
							interceptBackend.getStub( '/mi/os_region_groups/?year=2017&date_start=1234', 200, '/os_region_groups/index.2017' );
							interceptBackend.getStub( '/mi/global_hvcs/?year=2017&date_start=1234', 200, '/global_hvcs/' );
							interceptBackend.getStub( '/mi/global_wins/?year=2017&date_start=1234', 200, '/global_wins/' );
							interceptBackend.getStub( '/mi/uk_regions/?year=2017&date_start=1234', 200, '/uk_regions/' );

							supertest( app ).get( '/?date[start]=1234' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Homepage' );
								done();
							} );
						} );
					} );

					describe( 'With an end date', function(){

						it( 'Should return the correct data', function( done ){

							interceptBackend.getStub( '/mi/sector_teams/?year=2017&date_end=6789', 200, '/sector_teams/' );
							interceptBackend.getStub( '/mi/os_region_groups/?year=2017&date_end=6789', 200, '/os_region_groups/index.2017' );
							interceptBackend.getStub( '/mi/global_hvcs/?year=2017&date_end=6789', 200, '/global_hvcs/' );
							interceptBackend.getStub( '/mi/global_wins/?year=2017&date_end=6789', 200, '/global_wins/' );
							interceptBackend.getStub( '/mi/uk_regions/?year=2017&date_end=6789', 200, '/uk_regions/' );

							supertest( app ).get( '/?date[end]=6789' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Homepage' );
								done();
							} );
						} );
					} );
				} );

				describe( 'When one of the APIs returns a status of 500', function(){

					it( 'Should return a 500', function( done ){

						interceptBackend.getStub( '/mi/sector_teams/?year=2017', 200, '/sector_teams/' );
						interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 500 );
						interceptBackend.getStub( '/mi/global_hvcs/?year=2017', 200, '/global_hvcs/' );
						interceptBackend.getStub( '/mi/global_wins/?year=2017', 200, '/global_wins/' );
						interceptBackend.getStub( '/mi/uk_regions/?year=2017', 200, '/uk_regions/' );

						supertest( app ).get( '/' ).end( ( err, res ) => {

							checkResponse( res, 500 );
							done();
						} );
					} );
				} );

				describe( 'When all the APIs return a status of 500', function(){

					it( 'Should return a 500', function( done ){

						interceptBackend.getStub( '/mi/sector_teams/?year=2017', 500 );
						interceptBackend.getStub( '/mi/os_region_groups/?year=2017', 500 );
						interceptBackend.getStub( '/mi/global_hvcs/?year=2017', 500 );
						interceptBackend.getStub( '/mi/global_wins/?year=2017', 500 );
						interceptBackend.getStub( '/mi/uk_regions/?year=2017', 500 );

						supertest( app ).get( '/' ).end( ( err, res ) => {

							checkResponse( res, 500 );
							done();
						} );
					} );
				} );
			} );

			describe( 'Selecting a date range', function(){

				describe( 'Selecting the year', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						supertest( app ).get( '/select-date/' ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Choose date range' );
							done();
						} );
					} );
				} );

				describe( 'Selecting the month and day', function(){

					describe( '2016', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							supertest( app ).get( '/select-date/2016/' ).end( ( err, res ) => {

								expect( getTitle( res ) ).toEqual( 'MI - Choose 2016 financial year start and end dates');
								done();
							} );
						} );
					} );

					describe( '2017', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							supertest( app ).get( '/select-date/2017/' ).end( ( err, res ) => {

								expect( getTitle( res ) ).toEqual( 'MI - Choose 2017 financial year start and end dates');
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

							interceptBackend.getStub( '/mi/sector_teams/1/?year=2017', 200, '/sector_teams/sector_team' );
							interceptBackend.getStub( '/mi/sector_teams/1/months/?year=2017', 200, '/sector_teams/months' );
							interceptBackend.getStub( '/mi/sector_teams/1/campaigns/?year=2017', 200, '/sector_teams/campaigns' );
							interceptBackend.getStub( '/mi/sector_teams/1/top_non_hvcs/?year=2017', 200, '/sector_teams/top_non_hvcs' );

							supertest( app ).get( '/sector-teams/1/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Sector team performance - distinctio quas &amp; numquam' );
								done();
							} );
						} );
					} );
				} );

				describe( 'HVC win list', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/sector_teams/1/win_table/?year=2017', 200, '/sector_teams/win_table' );

							supertest( app ).get( '/sector-teams/1/wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Sector team HVC wins - animi architecto nam' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Non HVC win list', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/sector_teams/1/win_table/?year=2017', 200, '/sector_teams/win_table' );

							supertest( app ).get( '/sector-teams/1/non-hvc-wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Sector team non HVC wins - animi architecto nam' );
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

							interceptBackend.getStub( '/mi/hvc_groups/1/?year=2017', 200, '/hvc_groups/group' );
							interceptBackend.getStub( '/mi/hvc_groups/1/months/?year=2017', 200, '/hvc_groups/months' );
							interceptBackend.getStub( '/mi/hvc_groups/1/campaigns/?year=2017', 200, '/hvc_groups/campaigns' );

							supertest( app ).get( '/hvc-groups/1/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - HVC group performance - sunt laborum &amp; quos' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Win list', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/hvc_groups/1/win_table/?year=2017', 200, '/hvc_groups/win_table' );

							supertest( app ).get( '/hvc-groups/1/wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - HVC group wins - dolorem quos vero' );
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

						interceptBackend.getStub( `/mi/hvc/${ hvcId }/?year=2017`, 200, '/hvc/hvc' );
						interceptBackend.getStub( `/mi/hvc/${ hvcId }/top_wins/?year=2017`, 200, '/hvc/markets' );

						supertest( app ).get( `/hvc/${ hvcId }/` ).end( ( err, res ) => {

							expect( res.statusCode ).toEqual( 200 );
							expect( getTitle( res ) ).toEqual( 'MI - HVC performance - rerum blanditiis rerum' );
							done();
						} );
					} );
				} );

				describe( 'Win list', function(){

					it( 'Should return 200', function( done ){

						const hvcId = 'E100';

						interceptBackend.getStub( `/mi/hvc/${ hvcId }/win_table/?year=2017`, 200, '/hvc/win_table' );

						supertest( app ).get( `/hvc/${ hvcId }/wins/` ).end( ( err, res ) => {

							expect( res.statusCode ).toEqual( 200 );
							expect( getTitle( res ) ).toEqual( 'MI - HVC wins - non mollitia qui' );
							done();
						} );
					} );
				} );
			} );

			describe( 'Overseas Regions', function(){

				describe( 'Overview', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

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

							interceptBackend.getStub( '/mi/os_regions/1/?year=2017', 200, '/os_regions/region' );
							interceptBackend.getStub( '/mi/os_regions/1/months/?year=2017', 200, '/os_regions/months' );
							interceptBackend.getStub( '/mi/os_regions/1/campaigns/?year=2017', 200, '/os_regions/campaigns' );
							interceptBackend.getStub( '/mi/os_regions/1/top_non_hvcs/?year=2017', 200, '/os_regions/top_non_hvcs' );

							supertest( app ).get( '/overseas-regions/1/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Overseas region performance - minima explicabo &amp; architecto' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Overseas Region HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/os_regions/1/win_table/?year=2017', 200, '/os_regions/win_table' );

							supertest( app ).get( '/overseas-regions/1/wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Overseas region HVC wins - sed blanditiis dolorum' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Overseas Region non HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/os_regions/1/win_table/?year=2017', 200, '/os_regions/win_table' );

							supertest( app ).get( '/overseas-regions/1/non-hvc-wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Overseas region non HVC wins - sed blanditiis dolorum' );
								done();
							} );
						} );
					} );
				} );
			} );

			describe( 'Countries', function(){

				describe( 'List', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/countries/?year=2017', 200, '/countries/' );

							supertest( app ).get( '/countries/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Countries' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Country', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							const countryCode = 'SI';

							interceptBackend.getStub( `/mi/countries/${ countryCode }/?year=2017`, 200, '/countries/country' );
							interceptBackend.getStub( `/mi/countries/${ countryCode }/campaigns/?year=2017`, 200, '/countries/campaigns' );
							interceptBackend.getStub( `/mi/countries/${ countryCode }/months/?year=2017`, 200, '/countries/months' );
							interceptBackend.getStub( `/mi/countries/${ countryCode }/top_non_hvcs/?year=2017`, 200, '/countries/top_non_hvcs' );

							supertest( app ).get( `/countries/${ countryCode }/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Country performance - atque molestiae ducimus' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Country HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/countries/AU/win_table/?year=2017', 200, '/countries/win_table' );

							supertest( app ).get( '/countries/AU/wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Country HVC wins - atque at atque' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Country non HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/countries/AU/win_table/?year=2017', 200, '/countries/win_table' );

							supertest( app ).get( '/countries/AU/non-hvc-wins/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Country non HVC wins - atque at atque' );
								done();
							} );
						} );
					} );
				} );
			} );

			describe( 'Posts', function(){

				const postId = 'australia-perth';

				describe( 'List', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/posts/?year=2017', 200, '/posts/' );

							supertest( app ).get( '/posts/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Posts' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Post', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( `/mi/posts/${ postId }/?year=2017`, 200, '/posts/post' );
							interceptBackend.getStub( `/mi/posts/${ postId }/campaigns/?year=2017`, 200, '/posts/campaigns' );
							interceptBackend.getStub( `/mi/posts/${ postId }/months/?year=2017`, 200, '/posts/months' );
							interceptBackend.getStub( `/mi/posts/${ postId }/top_non_hvcs/?year=2017`, 200, '/posts/top_non_hvcs' );

							supertest( app ).get( `/posts/${ postId }/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Post performance - quisquam provident aut' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Post HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( `/mi/posts/${ postId }/win_table/?year=2017`, 200, '/posts/win_table' );

							supertest( app ).get( `/posts/${ postId }/wins/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Post HVC wins - fuga libero id' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Post non HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( `/mi/posts/${ postId }/win_table/?year=2017`, 200, '/posts/win_table' );

							supertest( app ).get( `/posts/${ postId }/non-hvc-wins/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - Post non HVC wins - fuga libero id' );
								done();
							} );
						} );
					} );
				} );
			} );

			describe( 'UK Regions', function(){

				const regionId = 'some-uk-region';

				describe( 'Overview', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( '/mi/uk_regions/overview/?year=2017', 200, '/uk_regions/overview' );

							supertest( app ).get( '/uk-regions/' ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - UK Regions' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Region', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( `/mi/uk_regions/${ regionId }/?year=2017`, 200, '/uk_regions/region' );
							interceptBackend.getStub( `/mi/uk_regions/${ regionId }/months/?year=2017`, 200, '/uk_regions/months' );
							interceptBackend.getStub( `/mi/uk_regions/${ regionId }/top_non_hvcs/?year=2017`, 200, '/uk_regions/top_non_hvcs' );

							supertest( app ).get( `/uk-regions/${ regionId }/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - UK Region performance - tenetur et et' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Region HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( `/mi/uk_regions/${ regionId }/win_table/?year=2017`, 200, '/uk_regions/win_table' );

							supertest( app ).get( `/uk-regions/${ regionId }/wins/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - UK Region HVC wins - ut ducimus dolorem' );
								done();
							} );
						} );
					} );
				} );

				describe( 'Region non HVC wins', function(){

					describe( 'When the API returns a status of 200', function(){

						it( 'Should return a 200 with the correct heading', function( done ){

							interceptBackend.getStub( `/mi/uk_regions/${ regionId }/win_table/?year=2017`, 200, '/uk_regions/win_table' );

							supertest( app ).get( `/uk-regions/${ regionId }/non-hvc-wins/` ).end( ( err, res ) => {

								checkResponse( res, 200 );
								expect( getTitle( res ) ).toEqual( 'MI - UK Region non HVC wins - ut ducimus dolorem' );
								done();
							} );
						} );
					} );
				} );
			} );
		} );

		describe( 'Investment', function(){

			describe( 'Index', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/fdi/sector_teams/?year=2017`, 200, '/investment/fdi/sector_teams/' );
					//interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );
					interceptBackend.getStub( `/mi/fdi/overview/?year=2017`, 200, '/investment/fdi/overview' );
					interceptBackend.getStub( `/mi/fdi/overview/yoy/?year=2017`, 200, '/investment/fdi/overview-yoy' );

					supertest( app ).get( '/investment/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment Homepage' );
						done();
					} );
				} );
			} );

			describe( 'Sector Teams', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/fdi/sector_teams/?year=2017`, 200, '/investment/fdi/sector_teams/' );

					supertest( app ).get( '/investment/sector-teams/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Sector Teams' );
						done();
					} );
				} );
			} );

			describe( 'Sector Team', function(){

				const teamId = 1;

				describe( 'Sector Team detail', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						interceptBackend.getStub( `/mi/fdi/sector_teams/${ teamId }/?year=2017`, 200, '/investment/fdi/sector_teams/sector_team' );

						supertest( app ).get( `/investment/sector-teams/${ teamId }/` ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Investment - Sector team performance - dolor sed explicabo' );
							done();
						} );
					} );
				} );

				describe( 'Sector Team HVC performance', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						interceptBackend.getStub( `/mi/fdi/sector_teams/${ teamId }/?year=2017`, 200, '/investment/fdi/sector_teams/sector_team' );

						supertest( app ).get( `/investment/sector-teams/${ teamId }/hvc-performance/` ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Investment - Sector team HVC performance - dolor sed explicabo' );
							done();
						} );
					} );
				} );

				describe( 'Sector Team non HVC performance', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						interceptBackend.getStub( `/mi/fdi/sector_teams/${ teamId }/?year=2017`, 200, '/investment/fdi/sector_teams/sector_team' );

						supertest( app ).get( `/investment/sector-teams/${ teamId }/non-hvc-performance/` ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Investment - Sector team non HVC performance - dolor sed explicabo' );
							done();
						} );
					} );
				} );

				describe( 'Sector Team wins', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						interceptBackend.getStub( `/mi/fdi/sector_teams/${ teamId }/?year=2017`, 200, '/investment/fdi/sector_teams/sector_team' );

						supertest( app ).get( `/investment/sector-teams/${ teamId }/wins/` ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Investment - Sector team HVC wins - dolor sed explicabo' );
							done();
						} );
					} );
				} );

				describe( 'Sector Team non HVC wins', function(){

					it( 'Should return a 200 with the correct heading', function( done ){

						interceptBackend.getStub( `/mi/fdi/sector_teams/${ teamId }/?year=2017`, 200, '/investment/fdi/sector_teams/sector_team' );

						supertest( app ).get( `/investment/sector-teams/${ teamId }/non-hvc-wins/` ).end( ( err, res ) => {

							checkResponse( res, 200 );
							expect( getTitle( res ) ).toEqual( 'MI - Investment - Sector team non HVC wins - dolor sed explicabo' );
							done();
						} );
					} );
				} );
			} );



			describe( 'Overseas Regions', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );

					supertest( app ).get( '/investment/overseas-regions/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Overseas Regions' );
						done();
					} );
				} );
			} );

			describe( 'Overseas Region', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );

					supertest( app ).get( '/investment/overseas-regions/40105/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Overseas Region performance - perspiciatis modi non' );
						done();
					} );
				} );
			} );

			describe( 'Overseas Region HVC performance', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );

					supertest( app ).get( '/investment/overseas-regions/40105/hvc-performance/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Overseas Region HVC performance - perspiciatis modi non' );
						done();
					} );
				} );
			} );

			describe( 'Overseas Region non HVC performance', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );

					supertest( app ).get( '/investment/overseas-regions/40105/non-hvc-performance/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Overseas Region non HVC performance - perspiciatis modi non' );
						done();
					} );
				} );
			} );

			describe( 'Overseas Region wins', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );

					supertest( app ).get( '/investment/overseas-regions/40105/wins/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Overseas Region HVC wins - perspiciatis modi non' );
						done();
					} );
				} );
			} );

			describe( 'Overseas Region non HVC wins', function(){

				it( 'Should return a 200 with the correct heading', function( done ){

					interceptBackend.getStub( `/mi/os_regions/?year=2017`, 200, '/investment/fdi/os_regions/' );

					supertest( app ).get( '/investment/overseas-regions/40105/non-hvc-wins/' ).end( ( err, res ) => {

						checkResponse( res, 200 );
						expect( getTitle( res ) ).toEqual( 'MI - Investment - Overseas Region non HVC wins - perspiciatis modi non' );
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
					'Set-Cookie': [ 'sessionid=test' ]
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

		describe( 'Default login', function(){

			it( 'Should return a 302 with the correct url', function( done ){

				const json = {
					target_url: 'https://localhost:2000/o/authorize/?response_type=code&client_id=some-id&redirect_uri=http%3A%2F%2Flocalhost%3A9001%2F&state=abcd1234'
				};

				interceptBackend.get( '/oauth2/auth_url/' ).reply( 200, json );

				supertest( app ).get( '/login/' ).end( ( err, res ) => {

					checkResponse( res, 302 );
					expect( res.headers.location ).toEqual( json.target_url );
					done();
				} );
			} );
		} );

		describe( 'SAML login', function(){

			it( 'Should return a 200 with the correct heading', function( done ){

				interceptBackend.get( '/saml2/login/' ).reply( 200, 'test' );

				supertest( app ).get( '/login-saml/' ).end( ( err, res ) => {

					checkResponse( res, 200 );
					expect( getTitle( res ) ).toEqual( 'MI - Login' );
					done();
				} );
			} );
		} );

		describe( 'Oauth callback', function(){

			describe( 'With a JSON response', function(){

				it( 'Should POST the GET params to the backend and redirect to the location in the JSON', function( done ){

					const next = '/my/url/';

					interceptBackend.post( '/oauth2/callback/', JSON.stringify( { code: '123abc', state: '234def' } ) ).reply( 200, { next } );

					supertest( app ).get( '/login/callback/?code=123abc&state=234def' ).end( ( err, res ) => {

						checkResponse( res, 302 );
						expect( res.headers.location ).toEqual( next );
						done();
					} );
				} );
			} );

			describe( 'Without a JSON response', function(){

				it( 'Should POST the GET params to the backend and redirect to the homepage', function( done ){

					interceptBackend.post( '/oauth2/callback/', JSON.stringify( { code: '123abc', state: '234def' } ) ).reply( 200 );

					supertest( app ).get( '/login/callback/?code=123abc&state=234def' ).end( ( err, res ) => {

						checkResponse( res, 302 );
						expect( res.headers.location ).toEqual( '/' );
						done();
					} );
				} );
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

	describe( 'Downloads', function(){

		describe( 'Downloading a file', function(){

			it( 'Should return the path to the CSV file', function( done ){

				const fileId = '1';
				const one_time_url = 'my/test/url';

				interceptBackend.get( `/csv/generate_otu/${ fileId }/` ).reply( 200, { one_time_url } );

				supertest( app ).get( `/downloads/${ fileId }/` ).end( ( err, res ) => {

					checkResponse( res, 302 );
					expect( res.headers.location ).toEqual( one_time_url );
					done();
				} );
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

				const app = proxyquire( '../../../app/app', {
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

				const app = proxyquire( '../../../app/app', {
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
