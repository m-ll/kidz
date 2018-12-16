
function App( iConfig )
{
	var app = new kidz.cApp();
	app.Init( iConfig );
	app.Start();
}

$( document ).ready( function() 
{
	// https://stackoverflow.com/questions/2618959/not-well-formed-warning-when-loading-client-side-json-in-firefox-via-jquery-aj/4234006
	$.ajaxSetup( { beforeSend: function( xhr )
	{
		if( xhr.overrideMimeType )
			xhr.overrideMimeType( 'application/json' );
	}
	});

	$.getJSON( 'memory-digit.json', App );
});
