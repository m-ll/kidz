
this.kidz = this.kidz||{};

(function() {
	"use strict";

// constructor
	function cPresentation( iStage, iAssets, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mAssets = iAssets;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;

		this.mGText = null;
		this.mListener = null;
	}
	
	var p = cPresentation.prototype;
	
// public
	p.Init = function()
	{
	};
	
	p.Build = function()
	{
		this.mGText = new createjs.Text( 'Welcome ...', 'bold 20px Arial', '#000000' );
		// this.mGText.maxWidth = 1000;
		this.mGText.textAlign = 'center';
		this.mGText.textBaseline = 'middle';
		this.mGText.x = this.mStage.canvas.width / 2;
		this.mGText.y = 0; //this.mStage.canvas.height / 2;

		this.mStage.addChild( this.mGText );
	};
	
	p.Start = function()
	{
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, this );
	};
	
// private
	p._Stop = function()
	{
		createjs.Ticker.off( 'tick', this.mListener );
		this.mNextCB.call( this.mNextCBData );
	};
	
	p._Tick = function( iEvent, iData )
	{
		var that = iData;
		
		that.mGText.y += 10;

		if( that.mGText.y > that.mStage.canvas.height / 2 )
		{
			that.mStage.removeChild( that.mGText );

			iEvent.remove();
			that._Stop();
		}

		that.mStage.update( iEvent );
	};
	
// 
	kidz.cPresentation = cPresentation;
}());
