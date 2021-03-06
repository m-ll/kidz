///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cApp as cCoreApp } from '../core/app.js';
import { cAssets } from './assets.js';
import { cAssetsUI } from '../core/assets-ui.js';
import { cFaf } from '../core/faf.js';
import { cFafUI } from '../core/faf-ui.js';
import { cGame } from './game.js';
import { cGameUI } from './game-ui.js';
import { cWin } from '../core/win.js';
import { cWinUI } from '../core/win-ui.js';
import { cLose } from '../core/lose.js';
import { cLoseUI } from '../core/lose-ui.js';

export 
class cApp extends cCoreApp
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

		this.mFaf = new cFaf();
		this.mFaf.Init();
		
		this.mAssets = new cAssets();
		this.mAssets.Init( this.Config() );

		this.mGame = new cGame();
		
		this.mWin = new cWin( 'You win !?!', 'Play again ?!?' );
		this.mLose = new cLose( 'You lose !?!', 'Retry ?!?' );
	}
	
	Build()
	{
		super.Build();
	}
	
	Start()
	{
		super.Start();

		this._Faf();
	}
	
// private
	_Faf()
	{
		this.mFaf.Build( this.Stage() );

		let ui = new cFafUI( this.mFaf, this.Stage(), this._Assets, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}

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
		this.mGame.Init( this.mAssets, this.Config(), this.mGame.GetLevel() );

		let ui = new cGameUI( this.mGame, this.Stage(), this.mAssets, this._Win, this._Lose, this._NextLevel, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}

	_NextLevel()
	{
		let level = this.mGame.GetLevel();
		level++;
		this.mGame.SetLevel( level );

		this._Game();
	}
	_Lose()
	{
		let ui = new cLoseUI( this.mLose, this.Stage(), this.mAssets, this._Retry, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}
	_Retry()
	{
		this._Game();
	}
	_Win()
	{
		let ui = new cWinUI( this.mWin, this.Stage(), this.mAssets, this._PlayAgain, this );
		ui.Init();
		ui.Build();
		ui.Start();
	}
	_PlayAgain()
	{
		this.mGame.SetLevel( 0 );

		this._Game();
	}
}
