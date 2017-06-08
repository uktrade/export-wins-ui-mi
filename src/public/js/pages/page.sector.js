mi.pages.sector =  function( data ){

	if( jessie && jessie.getElement ){

		var isOver = ( data.isOver === 'true' );
		var confirmed = jessie.getElement( 'confirmed-bar' );
		var unconfirmed = jessie.getElement( 'unconfirmed-bar' );

		if( !isOver ){

			confirmed.style.width = 0;
			unconfirmed.style.width = 0;

			setTimeout( function(){

				confirmed.style.width = ( data.confirmedPercent + '%' );
				unconfirmed.style.width = ( data.unconfirmedPercent + '%' );

			}, 100 );
		}
	}
};
