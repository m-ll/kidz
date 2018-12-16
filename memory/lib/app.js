
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
