mi.components.TopNonHvcs = (function( jessie ){
	
	function TopNonHvcsComponent( opts ){

		opts = ( opts || {} );

		if( !opts.url ){ throw new Error( 'URL is required' ); }
		if( !opts.tableId ){ throw new Error( 'Table Id is required' ); }

		this.url = opts.url;
		this.tableId = opts.tableId;
		this.rowClass = ( opts.rowClass || 'top-non-hvc_table_row' );
		this.linkId = 'top-non-hvc-load-more';
		this.index = 5;
		this.increment = 5;

		var link = jessie.getElement( this.linkId );
		jessie.attachListener( link, 'click', jessie.bind( this.handleLinkClick, this ) );
	}

	TopNonHvcsComponent.prototype.getUrl = function(){

		return this.url + '?index=' + this.index;
	};

	TopNonHvcsComponent.prototype.createRows = function( rowsHtml ){
		
		var body = document.createElement( 'tbody' );
		body.innerHTML = rowsHtml;

		return body.children;
	};

	TopNonHvcsComponent.prototype.addRowsToTable = function( rowsHtml ){
		
		var newRows = this.createRows( rowsHtml );
		var table = jessie.getElement( this.tableId );
		var tableRows = jessie.getDescendantsByClassName( table, this.rowClass );
		var scaleRow = tableRows[ tableRows.length - 1 ];
		var parent = scaleRow.parentNode;

		while( newRows.length ){

			parent.insertBefore( newRows[ 0 ], scaleRow );
		}
	};

	TopNonHvcsComponent.prototype.handleLinkClick = function( e ){

		jessie.cancelDefault( e );
		
		jessie.ajaxGet( this.getUrl(), { success: jessie.bind( function( rows ){

			this.index += this.increment;
			this.addRowsToTable( rows );
		}, this ) } );
	};

	return TopNonHvcsComponent;
}( jessie ));
