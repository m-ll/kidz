///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

this.kidz = this.kidz||{};

(function() {
	"use strict";

// constructor
	function cApp()
	{
		this.mStage = null;
		this.mAssets = null;

		this.mConfig = null;
	}
	
	var p = cApp.prototype;
	
// public
	p.Init = function( iConfig )
	{
		this.mConfig = iConfig;

		this.mStage = new createjs.Stage( 'canvas' );
		this.mStage.enableMouseOver();
		
		createjs.Touch.enable( this.mStage );
	};
	
	p.Start = function()
	{
		var presentation = new kidz.cPresentation( this.mStage, this.mAssets, this._Assets, this );
		presentation.Init();
		presentation.Build();
		presentation.Start();
	};
	
// private
	p._Assets = function()
	{
		this.mAssets = new kidz.cAssets( this.mStage, this._Menu, this );
		this.mAssets.Load( this.mConfig['assets'] );
	};
	
	p._Menu = function()
	{
		this._Game();
		// var menu = new kidz.cPresentation( this.mStage, this.mAssets, this.Game, this );
		// menu.Init();
		// menu.Build();
		// menu.Start();
	};
	
	p._Game = function()
	{
		var game = new kidz.cGame( this.mStage, this.mAssets, this._Win, this );
		game.Init();
		game.Build( this.mConfig['number-of-cards'] );
		game.Start();
	};

	p._Win = function()
	{
		var win = new kidz.cWin( this.mStage, this.mAssets, this._Game, this );
		win.Init();
		win.Build();
		win.Start();
	};

// 
	kidz.cApp = cApp;
}());
