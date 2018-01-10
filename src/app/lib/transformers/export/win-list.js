const MAX_CDMS_ID_LENGTH = 24;

function createStatus( win, name, modifyer ){

	win.status = { name, modifyer };
}

function truncate( str, maxLength ){

	if( str && str.length > maxLength ){

		return ( str.substr( 0, maxLength ) + '...' );
	}

	return str;
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

function checkForEmail( name ){

	if( typeof name === 'string' && name.includes( '@' ) ){

		return name.split( '@' ).join( ' @' );
	}

	return name;
}

function transformWin( win ){

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

	win.company.truncated_id = truncate( win.company.id, MAX_CDMS_ID_LENGTH );
	win.lead_officer.name = checkForEmail( win.lead_officer.name );

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
