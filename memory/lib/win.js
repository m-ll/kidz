///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

this.kidz = this.kidz || {};

(function()
{
"use strict";

class cWin
{
	constructor( iStage, iAssets, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mAssets = iAssets;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;

		this.mGYouWin = null;
		this.mGPlayAgain = null;
		this.mListener = null;
	}
	
// public
	Init()
	{
	}
	
	Build()
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
		this.mGPlayAgain.cursor = 'pointer';

		this.mStage.addChild( this.mGPlayAgain );
	}
	
	Start()
	{
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, this );
	}
	
// private
	_Stop()
	{
		this.mStage.removeChild( this.mGYouWin );
		this.mStage.removeChild( this.mGPlayAgain );

		createjs.Ticker.off( 'tick', this.mListener );
		this.mNextCB.call( this.mNextCBData );
	}
	
	_PlayAgain( iEvent, iData )
	{
		var that = iData;
		
		iEvent.remove();
		that._Stop();
	}
	
	_Tick( iEvent, iData )
	{
		var that = iData;

		that.mStage.update( iEvent );
	}
}

// module
kidz.cWin = cWin;
}());
