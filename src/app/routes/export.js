const config = require( '../config' );
const navMiddleware = require( '../middleware/nav' );

const indexController = require( '../controllers/controller.index' );
const sectorTeamController = require( '../controllers/controller.sector-teams' );
const regionController = require( '../controllers/controller.overseas-regions' );
const hvcGroupController = require( '../controllers/controller.hvc-groups' );
const winController =  require( '../controllers/controller.win' );
const hvcController = require( '../controllers/controller.hvc' );
const countryController = require( '../controllers/controller.countries' );
const postController = require( '../controllers/controller.posts' );
const ukRegionController = require( '../controllers/controller.uk-regions' );

const nav = navMiddleware( { isExport: true } );

module.exports = function( router, user/*, isDev */ ){

	function get( path, ...args ){

		//ensure the user and nav middleware gets run for each route
		router.get( path, user, nav, ...args );
	}

	router.get( '/sector-teams/overview/', ( req, res ) => res.redirect( 301, '/sector-teams/' ) );
	router.get( '/overseas-regions/overview/', ( req, res ) => res.redirect( 301, '/overseas-regions/' ) );

	get( '/', indexController );

	get( '/sector-teams/', sectorTeamController.overview );
	get( '/sector-teams/:id', sectorTeamController.team );
	get( '/sector-teams/:id/wins/', sectorTeamController.wins );
	get( '/sector-teams/:id/non-hvc-wins/', sectorTeamController.nonHvcWins );
	get( '/sector-teams/:id/top-non-hvc/', sectorTeamController.topNonHvcs );

	get( '/overseas-regions/', regionController.overview );
	get( '/overseas-regions/:id', regionController.region );
	get( '/overseas-regions/:id/wins/', regionController.wins );
	get( '/overseas-regions/:id/non-hvc-wins/', regionController.nonHvcWins );
	get( '/overseas-regions/:id/top-non-hvc/', regionController.topNonHvcs );

	get( '/hvc/:id', hvcController.hvc );
	get( '/hvc/:id/wins', hvcController.winList );

	get( '/hvc-groups/', hvcGroupController.list );
	get( '/hvc-groups/:id', hvcGroupController.group );
	get( '/hvc-groups/:id/wins', hvcGroupController.wins );

	get( '/countries/', countryController.list );
	get( '/countries/:code/', countryController.country );
	get( '/countries/:code/wins/', countryController.wins );
	get( '/countries/:code/non-hvc-wins/', countryController.nonHvcWins );
	get( '/countries/:code/top-non-hvc/', countryController.topNonHvcs );

	get( '/posts/', postController.list );
	get( '/posts/:id/', postController.post );
	get( '/posts/:id/wins/', postController.wins );
	get( '/posts/:id/non-hvc-wins/', postController.nonHvcWins );
	get( '/posts/:id/top-non-hvc/', postController.topNonHvcs );

	get( '/uk-regions/', ukRegionController.overview );
	get( '/uk-regions/:id/', ukRegionController.region );
	get( '/uk-regions/:id/wins/', ukRegionController.wins );
	get( '/uk-regions/:id/non-hvc-wins/', ukRegionController.nonHvcWins );
	get( '/uk-regions/:id/top-non-hvc/', ukRegionController.topNonHvcs );

	if( config.backend.mock ){

		get( '/win/', winController.win );
	}

	return router;
};
