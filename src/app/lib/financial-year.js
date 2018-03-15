
const monthList = [
	[ 4, 'April' ],
	[ 5, 'May' ],
	[ 6, 'June' ],
	[ 7, 'July' ],
	[ 8, 'August' ],
	[ 9, 'September' ],
	[ 10, 'October' ],
	[ 11, 'November' ],
	[ 12, 'December' ],
	[ 1, 'January' ],
	[ 2, 'February' ],
	[ 3, 'March' ]
];

function getCurrentFinancialYear(){

	const today = new Date();
	let year = today.getFullYear();

	//if month is Jan/Feb/March then set year to previous year
	//as financial year is 1st April to 31st March
	if( today.getMonth() < 3 ){

		year = ( year - 1 );
	}

	return year;
}

module.exports = {

	getCurrent: getCurrentFinancialYear,

	getMonths: function( fy ){

		fy = Number( fy );

		const currentFy = getCurrentFinancialYear();
		let months;

		if( fy == currentFy ){

			const currentMonthPositionInList = ( ( new Date() ).getMonth() - 3 );
			const isLast = ( currentMonthPositionInList === -1 );
			const endPoint = ( isLast ? monthList.length : ( currentMonthPositionInList + 1 ) );

			months = monthList.slice( 0, endPoint );

		} else {

			months = monthList;
		}

		return months.map( ( month, i ) => {

			const year = ( i >= 9 ? fy + 1 : fy );

			return {
				year,
				number: month[ 0 ],
				name: month[ 1 ]
			};
		} );
	}
};
