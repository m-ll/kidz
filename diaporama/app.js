///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cApp as cAppA } from '../core/app.js';
import { cFaf } from '../core/faf.js';
import { cWin } from '../core/win.js';

import { cAssets } from './assets.js';
import { cGame } from './game.js';

export 
class cApp extends cAppA
{
	constructor()
	{
		super();

		this.mAssets = null;
	}
	
// public
	Init( iConfig, iCanvasId )
	{
		super.Init( iConfig, iCanvasId );
	}
	
	Build()
	{
		super.Build();
	}
	
	Start()
	{
		super.Start();

		let faf = new cFaf( this.Stage(), this._Assets, this );
		faf.Init();
		faf.Build();
		faf.Start();
	}
	
// private
	_Assets()
	{
		this.mAssets = new cAssets( this.Stage(), this._Game, this );
		this.mAssets.Init( this.Config().assets );
		this.mAssets.Load();
	}
	
	_Game()
	{
		let game = new cGame( this.Stage(), this.mAssets, this._Win, this );
		game.Init();
		game.Build();
		game.Start();
	}

	_Win()
	{
		let win = new cWin( this.Stage(), this.mAssets, this._Game, this );
		win.Init();
		win.Build();
		win.Start();
	}
}
