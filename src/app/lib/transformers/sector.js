module.exports = function( input ){

	const wins = input.wins;

	input.exportValue = ( wins.hvc.value.confirmed + wins.non_hvc.value.confirmed );

	return input;
};
