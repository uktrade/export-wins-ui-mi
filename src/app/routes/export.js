const config = require( '../config' );

const indexController = require( '../controllers/controller.index' );
const sectorTeamController = require( '../controllers/controller.sector-teams' );
const regionController = require( '../controllers/controller.overseas-regions' );
const hvcGroupController = require( '../controllers/controller.hvc-groups' );
const winController =  require( '../controllers/controller.win' );
const hvcController = require( '../controllers/controller.hvc' );
const countryController = require( '../controllers/controller.countries' );
const postController = require( '../controllers/controller.posts' );
const ukRegionController = require( '../controllers/controller.uk-regions' );

module.exports = function( router, user/*, isDev */ ){

	router.get( '/', user, indexController );

	router.get( '/sector-teams/', user, sectorTeamController.list );
	router.get( '/sector-teams/overview/', user, sectorTeamController.overview );
	router.get( '/sector-teams/:id', user, sectorTeamController.team );
	router.get( '/sector-teams/:id/wins/', user, sectorTeamController.wins );
	router.get( '/sector-teams/:id/non-hvc-wins/', user, sectorTeamController.nonHvcWins );

	router.get( '/overseas-regions/', user, regionController.list );
	router.get( '/overseas-regions/overview/', user, regionController.overview );
	router.get( '/overseas-regions/:id', user, regionController.region );
	router.get( '/overseas-regions/:id/wins/', user, regionController.wins );
	router.get( '/overseas-regions/:id/non-hvc-wins/', user, regionController.nonHvcWins );

	router.get( '/hvc/:id', user, hvcController.hvc );
	router.get( '/hvc/:id/wins', user, hvcController.winList );

	router.get( '/hvc-groups/', user, hvcGroupController.list );
	router.get( '/hvc-groups/:id', user, hvcGroupController.group );
	router.get( '/hvc-groups/:id/wins', user, hvcGroupController.wins );

	router.get( '/countries/', user, countryController.list );
	router.get( '/countries/:code/', user,countryController.country );
	router.get( '/countries/:code/wins/', user,countryController.wins );
	router.get( '/countries/:code/non-hvc-wins/', user, countryController.nonHvcWins );

	router.get( '/posts/', user, postController.list );
	router.get( '/posts/:id/', user, postController.post );
	router.get( '/posts/:id/wins/', user, postController.wins );
	router.get( '/posts/:id/non-hvc-wins/', user, postController.nonHvcWins );

	router.get( '/uk-regions/', user, ukRegionController.overview );
	router.get( '/uk-regions/:id/', user, ukRegionController.region );
	router.get( '/uk-regions/:id/wins/', user, ukRegionController.wins );
	router.get( '/uk-regions/:id/non-hvc-wins/', user, ukRegionController.nonHvcWins );

	if( config.backend.mock ){

		router.get( '/win/', user, winController.win );
	}

	return router;
};
