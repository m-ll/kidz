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
import { cAssets } from './assets.js';
import { cAssetsUI } from '../core/assets-ui.js';
import { cFaf } from '../core/faf.js';
import { cFafUI } from '../core/faf-ui.js';
import { cGame } from './game.js';
import { cGameUI } from './game-ui.js';
import { cWin } from '../core/win.js';
import { cWinUI } from '../core/win-ui.js';

export 
class cApp extends cAppA
{
	constructor()
	{
		super();

		   /*cFaf*/ this.mFaf = null;
		/*cAssets*/ this.mAssets = null;
		  /*cGame*/ this.mGame = null;
		   /*cWin*/ this.mWin = null;
	}
	
// public
	Init( /*json*/ iConfig, /*string*/ iCanvasId )
	{
		super.Init( iConfig, iCanvasId );

		this.mFaf = new cFaf( 'Welcome ...' );
		
		this.mAssets = new cAssets();
		this.mAssets.Init( this.Config() );

		this.mGame = new cGame();
		
		this.mWin = new cWin( 'You win !', 'Play again ?' );
	}
	
	Build()
	{
		super.Build();
	}
	
	Start()
	{
		super.Start();

		let ui = new cFafUI( this.mFaf, this.Stage(), this._Assets, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}
	
// private
	_Assets()
	{
		this.mAssets.Load();
		
		let ui = new cAssetsUI( this.Stage(), this.mAssets, this._Game, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}
	
	_Game()
	{
		this.mGame.Init( this.mAssets, this.Config() );

		let ui = new cGameUI( this.mGame, this.Stage(), this.mAssets, this._Win, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}

	_Win()
	{
		let ui = new cWinUI( this.mWin, this.Stage(), this.mAssets, this._Game, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}
}
