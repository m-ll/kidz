///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cPresentation } from './presentation.js';
import { cAssets } from './assets.js';
import { cGame } from './game.js';
import { cWin } from './win.js';

export 
class cApp
{
	constructor()
	{
		this.mStage = null;
		this.mAssets = null;

		this.mConfig = null;
	}
	
// public
	Init( iConfig, iCanvasId )
	{
		this.mConfig = iConfig;

		this.mStage = new createjs.Stage( iCanvasId );
		this.mStage.enableMouseOver();
		
		createjs.Touch.enable( this.mStage );
		createjs.Sound.initializeDefaultPlugins(); //TODO: error handling
	}
	
	Start()
	{
		let presentation = new cPresentation( this.mStage, this.mAssets, this._Assets, this );
		presentation.Init();
		presentation.Build();
		presentation.Start();
	}
	
// private
	_Assets()
	{
		this.mAssets = new cAssets( this.mStage, this._Menu, this );
		this.mAssets.Load( this.mConfig['assets'] );
	}
	
	_Menu()
	{
		this._Game();
		// let menu = new cMenu( this.mStage, this.mAssets, this._Game, this );
		// menu.Init();
		// menu.Build();
		// menu.Start();
	}
	
	_Game()
	{
		let game = new cGame( this.mStage, this.mAssets, this._Win, this );
		game.Init();
		game.Build( this.mConfig['number-of-cards'] );
		game.Start();
	}

	_Win()
	{
		let win = new cWin( this.mStage, this.mAssets, this._Game, this );
		win.Init();
		win.Build();
		win.Start();
	}
}
