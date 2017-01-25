module.exports = function( input ){

	const wins = input.wins;

	input.exportValue = wins.hvc.value.confirmed;

	return input;
};
