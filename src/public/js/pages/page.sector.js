mi.pages.sector = function( data ){

	if( mi.components.targetProgress ){

		mi.components.targetProgress( data.progress );
	}

	if( data.topMarkets && mi.components.TopNonHvcs ){

		new mi.components.TopNonHvcs( data.topMarkets );
	}
};
