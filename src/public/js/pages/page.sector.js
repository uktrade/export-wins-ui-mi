mi.pages.sector =  function( data ){

	var perfData = data.sectorPerformance;

	var perfLayout = {
		margin: {
			t: 25,
			b: 25,
			l: 50
		}
	};

	mi.plot( 'sector-performance', perfData.data, perfLayout );

	if( jessie && jessie.deferUntilReady && jessie.getElement ){

		jessie.deferUntilReady( function(){

			jessie.getElement( 'wins-target-progress' ).style.transform = 'rotate(' + data.targetProgress + 'turn)';
		} );
	}
};
