module.exports = function( input ){

	const wins = input.wins;

	input.exportValue = wins.export.hvc.value.confirmed;

	return input;
};
