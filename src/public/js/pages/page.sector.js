mi.pages.sector =  function( data ){

	if( jessie && jessie.deferUntilReady && jessie.getElement ){

		jessie.deferUntilReady( function(){

			jessie.getElement( 'wins-target-progress' ).style.transform = 'rotate(' + data.targetProgress + 'turn)';
		} );
	}
};
