module.exports = function( num, text, plural ){

	num = Math.round( num );

	if( num !== 1 ){

		if( plural ){

			text = plural;
			
		} else {

			text += 's';
		}
	}

  return ( num + ' ' + text );
};
