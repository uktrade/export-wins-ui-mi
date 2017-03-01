module.exports = function( values ){
		
	const hvcConfirmedTotal = ( ( values.hvc.current.confirmed / values.hvc.target_percent.confirmed ) * 100 );

	values.hvc.target = Math.round( hvcConfirmedTotal );
	
	if( values.non_hvc ){

		values.non_hvc.total_win_percent.confirmed = ( 100 - values.hvc.total_win_percent.confirmed );
		values.non_hvc.total_win_percent.unconfirmed = ( 100 - values.hvc.total_win_percent.unconfirmed );
	}
};
