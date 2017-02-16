module.exports = function( input ){

	const wins = input.wins;

	input.exportValue = wins.export.totals.value.confirmed;

	return input;
};
