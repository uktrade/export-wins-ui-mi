mi.plot = function( elem, data, layout ){

	layout = ( layout || {} );
	layout.margin = layout.margin || {};

	layout.margin = {
		t: ( layout.margin.t || 20 ),
		b: ( layout.margin.b || 20 ),
		l: ( layout.margin.l || 20 ),
		r: ( layout.margin.r || 20 )
	};

	Plotly.plot( elem, data, layout, { showLink: false, displaylogo: false } );
}
