///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cApp as cCoreApp } from '../../core/app.js';
import { cAssetsSimulate } from './assets-simulate.js';
import { cAssetsUI } from '../../core/assets-ui.js';

class cApp extends cCoreApp
{
	constructor()
	{
		super();

		/*cAssetsSimulate*/ this.mAssets = null;
	}
	
// public
	Init( /*string*/ iCanvasId )
	{
		super.Init( {}, iCanvasId );

		this.mAssets = new cAssetsSimulate( 20, 200 );
		this.mAssets.Init();
	}
	
	Build()
	{
		super.Build();
	}
	
	Start()
	{
		super.Start();

		this.mAssets.Load();
		
		let ui = new cAssetsUI( this.Stage(), this.mAssets, this._End, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}

	_End()
	{
	}
}

$( document ).ready( function() 
{
	let config = $( '#loading-boot' ).data( 'loading-config' );
	
	let app = new cApp();
	app.Init( config.canvas );
	app.Build();
	app.Start();
});
