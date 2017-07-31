
function createCredit( win, name, modifyer ){

	win.credit = { name, modifyer };
}

function createStatus( win, name, modifyer ){

	win.status = { name, modifyer };
}

function checkHvcName( win ){

	const hvc = win.hvc;
	const hvcName = hvc.name;
	const codeMarker = ( ': ' + hvc.code );
	const markerPosition = ( hvcName.length - codeMarker.length );

	if( hvcName.substr( markerPosition ) === codeMarker ){

		hvc.name = hvcName.substring( 0, markerPosition );
	}
}

function transformWin( win ){

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

	if( win.hvc ){

		checkHvcName( win );
	}
}

module.exports = function( results ){

	const nonHvcWins = results.wins.non_hvc;

	results.wins.hvc.forEach( transformWin );

	if( nonHvcWins ){

		nonHvcWins.forEach( transformWin );
	}

	return results;
};
