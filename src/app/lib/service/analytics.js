const ua = require( 'universal-analytics' );
const config = require( '../../config' );
const reporter = require( '../reporter' );

const analyticsId = config.analyticsId;
const GID_PATTERN = /^[a-z]+[0-9]+\.[0-9+]\.([0-9]+\.[0-9]+)$/i;

function getId( gid ){

	const matches = GID_PATTERN.exec( gid );
	const id = ( matches && matches[ 1 ] );

	return ( id || gid );
}

function Tracker( analyticsId, uid ){

	this.tracker = ua( analyticsId, uid, { strictCidFormat: false, https: true } );
}

Tracker.prototype.trackEvent = function( opts ){

	this.tracker.event( opts, ( err ) => {

		if( err ){

			reporter.message( 'info', `Unable to send ${ opts.eventCategory } event to Google Analytics`, {
				eventAction: opts.eventAction,
				eventLabel: opts.eventLabel,
			} );
		}
	} );

};

Tracker.prototype.downloadCsvFile = function( path, action, fileName ){

	this.trackEvent( {

		eventCategory: 'Downloads',
		eventAction: action,
		eventLabel: fileName,
		documentPath: path,
		dataSource: 'web',
		documentTitle: 'CSV download'

	} );
};

Tracker.prototype.loadAllTopMarkets = function( path, action, label ){

	this.trackEvent( {
		eventCategory: 'Load All',
		eventAction: action,
		eventLabel: label,
		documentPath: path,
		dataSource: 'web',
		documentTitle: 'Load all top markets'
	} );
};

module.exports = {

	createTracker: function( req ){

		if( analyticsId ){

			const uid = getId( req.cookies[ '_ga' ] );

			if( uid ){

				return new Tracker( analyticsId, uid );

			} else {

				if( req.user ){

					if( !req.user.internal ){

						reporter.message( 'info', 'No Google Analytics id cookie found - cannot create tracker' );
					}

				} else {

					reporter.message( 'info', `No user in req for ${ req.url }` );
				}
			}
		}
	}
};
