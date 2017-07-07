if( jessie && jessie.getElement && jessie.deferUntilReady ){

	mi.components.targetProgress = function( data ){

		var isOver = ( data.isOver === 'true' );
		var confirmed = jessie.getElement( 'confirmed-bar' );
		var unconfirmed = jessie.getElement( 'unconfirmed-bar' );

		if( !isOver ){

			confirmed.style.width = 0;
			unconfirmed.style.width = 0;

			jessie.deferUntilReady( function(){

				confirmed.style.width = ( data.confirmedPercent + '%' );
				unconfirmed.style.width = ( data.unconfirmedPercent + '%' );
			} );
		}
	};
}
