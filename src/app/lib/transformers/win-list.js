
function createCredit( win, name, modifyer ){

	win.credit = { name, modifyer };
}

function createStatus( win, name, modifyer ){

	win.status = { name, modifyer };
}

module.exports = function( input ){

	input.forEach( ( win ) => {

		if( win.credit ){

			createCredit( win, 'Yes', 'yes' );

		} else {

			createCredit( win, 'No', 'no' );
		}

		switch( win.status ){

			case '0':
				createStatus( win, 'Not yet sent', 'not-sent' );
			break;
			case '1':
				createStatus( win, 'Sent but not confirmed', 'sent' );
			break;
			case '2':
				createStatus( win, 'Confirmed', 'confirmed' );
			break;
			case '3':
				createStatus( win, 'Rejected', 'rejected' );
			break;
		}
	} );

	return input;
};
