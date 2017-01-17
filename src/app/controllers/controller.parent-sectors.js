
const renderError = require( '../lib/render-error' );
const backendService = require( '../lib/service/service.backend' );

module.exports = {

	list: function( req, res ){

		backendService.getParentSectors( req.alice ).then( function( parentSectors ){

			res.render( 'parent-sectors/list.html', { parentSectors } );

		} ).catch( renderError( res ) );
	},

	parent: function( req, res ){

		const parentId = req.params.id;

		backendService.getParentSectorInfo( req.alice, parentId ).then( function( parentSector ){

			res.render( 'parent-sectors/parent-sector.html', { parentSector } );

		} ).catch( renderError( res ) );
	}
};
