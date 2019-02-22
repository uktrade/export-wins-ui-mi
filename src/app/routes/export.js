const config = require( '../config' );
const navMiddleware = require( '../middleware/nav' );
const { buildGlobalNav } = require('../middleware/build-global-nav');

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

	get( '/', buildGlobalNav, indexController );

	get( '/sector-teams/', buildGlobalNav, sectorTeamController.overview );
	get( '/sector-teams/:id', buildGlobalNav, sectorTeamController.team );
	get( '/sector-teams/:id/wins/', buildGlobalNav, sectorTeamController.wins );
	get( '/sector-teams/:id/non-hvc-wins/', buildGlobalNav, sectorTeamController.nonHvcWins );
	get( '/sector-teams/:id/top-non-hvc/', buildGlobalNav, sectorTeamController.topNonHvcs );

	get( '/overseas-regions/', buildGlobalNav,regionController.overview );
	get( '/overseas-regions/:id', buildGlobalNav,regionController.region );
	get( '/overseas-regions/:id/wins/', buildGlobalNav,regionController.wins );
	get( '/overseas-regions/:id/non-hvc-wins/', buildGlobalNav, regionController.nonHvcWins );
	get( '/overseas-regions/:id/top-non-hvc/', buildGlobalNav,regionController.topNonHvcs );

	get( '/hvc/:id', buildGlobalNav,hvcController.hvc );
	get( '/hvc/:id/wins', buildGlobalNav,hvcController.winList );

	get( '/hvc-groups/', buildGlobalNav,hvcGroupController.list );
	get( '/hvc-groups/:id', buildGlobalNav,hvcGroupController.group );
	get( '/hvc-groups/:id/wins', buildGlobalNav,hvcGroupController.wins );

	get( '/countries/', buildGlobalNav,countryController.list );
	get( '/countries/:code/', buildGlobalNav,countryController.country );
	get( '/countries/:code/wins/', buildGlobalNav,countryController.wins );
	get( '/countries/:code/non-hvc-wins/', buildGlobalNav, countryController.nonHvcWins );
	get( '/countries/:code/top-non-hvc/', buildGlobalNav,countryController.topNonHvcs );

	get( '/posts/', buildGlobalNav, postController.list );
	get( '/posts/:id/', buildGlobalNav, postController.post );
	get( '/posts/:id/wins/', buildGlobalNav,postController.wins );
	get( '/posts/:id/non-hvc-wins/', buildGlobalNav,postController.nonHvcWins );
	get( '/posts/:id/top-non-hvc/', buildGlobalNav,postController.topNonHvcs );

	get( '/uk-regions/', buildGlobalNav,ukRegionController.overview );
	get( '/uk-regions/:id/', buildGlobalNav,ukRegionController.region );
	get( '/uk-regions/:id/wins/', buildGlobalNav,ukRegionController.wins );
	get( '/uk-regions/:id/non-hvc-wins/', buildGlobalNav,ukRegionController.nonHvcWins );
	get( '/uk-regions/:id/top-non-hvc/', buildGlobalNav,ukRegionController.topNonHvcs );

	if( config.backend.mock ){

		get( '/win/', winController.win );
	}

	return router;
};
