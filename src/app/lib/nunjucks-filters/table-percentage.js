module.exports = function( percentage ){

	if( percentage >= 100 ){

		percentage = Math.round( percentage );
	}

	return percentage;
};
