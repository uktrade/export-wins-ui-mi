if( jessie && jessie.getElement && jessie.deferUntilReady ){

	mi.components.targetProgress = function( progress ){

		var confirmed = jessie.getElement( 'confirmed-bar' );
		var unconfirmed = jessie.getElement( 'unconfirmed-bar' );

		if( !progress.over ){

			confirmed.style.width = 0;
			unconfirmed.style.width = 0;

			jessie.deferUntilReady( function(){

				confirmed.style.width = ( progress.confirmed.capped + '%' );
				unconfirmed.style.width = ( progress.unconfirmed.capped + '%' );
			} );
		}
	};
}
