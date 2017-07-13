
function createCredit( win, name, modifyer ){

	win.credit = { name, modifyer };
}

function createStatus( win, name, modifyer ){

	win.status = { name, modifyer };
}

module.exports = function( input ){

	input.wins.forEach( ( win ) => {

		if( win.credit ){

			createCredit( win, 'Yes', 'yes' );

		} else {

			createCredit( win, 'No', 'no' );
		}

		switch( win.status ){

			case 'email_not_sent':
				createStatus( win, 'Not yet sent', 'not-sent' );
			break;
			case 'response_not_received':
				createStatus( win, 'Sent but not confirmed', 'sent' );
			break;
			case 'customer_confirmed':
				createStatus( win, 'Confirmed', 'confirmed' );
			break;
			case 'customer_rejected':
				createStatus( win, 'Rejected', 'rejected' );
			break;
		}
	} );

	return input;
};
