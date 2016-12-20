mi.pages.sector = (function(){
	
	return function( data ){

		var perfData = data.sectorPerformance;
		var winsData = data.wins;

		var perfLayout = {
			margin: {
				t: 25,
				b: 25,
				l: 50
			}
		};

		mi.plot( 'sector-performance', perfData.data, perfLayout );
		mi.plot( 'hvc-wins', winsData.hvc, { margin: {	t: 0, l: 0, r: 0, b: 0	} } );

		if( jessie && jessie.deferUntilReady && jessie.getElement ){

			jessie.deferUntilReady( function(){

				jessie.getElement( 'wins-target-progress' ).style.transform = 'rotate(' + data.targetProgress + 'turn)';
			} );
		}
	};
}());
