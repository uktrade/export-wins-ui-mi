
const renderError = require( '../lib/render-error' );
const backendService = require( '../lib/service/service.backend' );

module.exports = {

	list: function( req, res ){

		backendService.getParentSectors( req.alice ).then( function( parentSectors ){

			//console.log( JSON.stringify( parentSectors, null, 2 ) );

			res.render( 'parent-sectors/list.html', { parentSectors } );

		} ).catch( renderError( res ) );
	},

	parent: function( req, res ){

		const parentId = req.params.id;

		backendService.getParentSectorInfo( req.alice, parentId ).then( function( data ){

			const parentInfo = data[ 0 ];
			const	campaigns = data[ 1 ];
			const months = data[ 2 ];
			const topNonHvcs = data[ 3 ];

			res.render( 'parent-sectors/parent-sector.html', {
				parentInfo,
				campaigns,
				months,
				topNonHvcs
			} );

		} ).catch( renderError( res ) );
	}
};
