
this.kidz = this.kidz||{};

(function() {
	"use strict";

// constructor
	function cWin( iStage, iAssets, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mAssets = iAssets;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;

		this.mGYouWin = null;
		this.mGPlayAgain = null;
		this.mListener = null;
	}
	
	var p = cWin.prototype;
	
// public
	p.Init = function()
	{
	};
	
	p.Build = function()
	{
		// var bg = new createjs.Shape();
		// bg.graphics.beginFill( 'rgba( 255, 0, 0, 0.5 )' ).drawRoundRect( 0, 0, 250, 40, 10 );

		var gtext = new createjs.Text( 'You win !', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = 250 / 2;
		gtext.y = 40 / 2;

		this.mGYouWin = new createjs.Container();
		this.mGYouWin.x = this.mStage.canvas.width / 2 - 250 / 2;
		this.mGYouWin.y = this.mStage.canvas.height / 2 - 40 / 2 - 20;
		// this.mGYouWin.addChild( bg, gtext );
		this.mGYouWin.addChild( gtext );

		this.mStage.addChild( this.mGYouWin );

		//---

		var bg = new createjs.Shape();
		bg.graphics.beginFill( 'rgba( 255, 0, 0, 0.5 )' ).drawRoundRect( 0, 0, 250, 40, 10 );

		var gtext = new createjs.Text( 'Play again ?', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = 250 / 2;
		gtext.y = 40 / 2;

		this.mGPlayAgain = new createjs.Container();
		this.mGPlayAgain.x = this.mStage.canvas.width / 2 - 250 / 2;
		this.mGPlayAgain.y = this.mStage.canvas.height / 2 - 40 / 2 + 20;
		this.mGPlayAgain.addChild( bg, gtext );
		this.mGPlayAgain.on( 'click', this._PlayAgain, null, false, this );

		this.mStage.addChild( this.mGPlayAgain );
	};
	
	p.Start = function()
	{
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, this );
	};
	
// private
	p._Stop = function()
	{
		this.mStage.removeChild( this.mGYouWin );
		this.mStage.removeChild( this.mGPlayAgain );

		createjs.Ticker.off( 'tick', this.mListener );
		this.mNextCB.call( this.mNextCBData );
	};
	
	p._PlayAgain = function( iEvent, iData )
	{
		var that = iData;
		
		iEvent.remove();
		that._Stop();
	};
	
	p._Tick = function( iEvent, iData )
	{
		var that = iData;

		that.mStage.update( iEvent );
	};
	
// 
	kidz.cWin = cWin;
}());
