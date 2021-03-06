///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cUI } from '../core/ui.js';

export 
class cLoseUI extends cUI
{
	constructor( /*cLose*/ iLose, /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, iNextCB, iNextCBData );

		             /*cLose*/ this.mLose = iLose;
		/*createjs.Container*/ this.mGYouLose = null;
		/*createjs.Container*/ this.mGPlayAgain = null;
		            /*object*/ this.mListener = null;
	}
	
// public
	Init()
	{
		super.Init();
	}
	
	Build()
	{
		super.Build();

		this._BuildYouLose();
		this._BuildPlayAgain();
	}
	
	Start()
	{
		super.Start();

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, this );
	}
	
// private
	_BuildYouLose()
	{
		// let bg = new createjs.Shape();
		// bg.graphics.beginFill( 'rgba( 255, 0, 0, 0.5 )' ).drawRoundRect( 0, 0, 250, 40, 10 );

		let gtext = new createjs.Text( this.mLose.GetTextLabel(), 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = 250 / 2;
		gtext.y = 40 / 2;

		this.mGYouLose = new createjs.Container();
		this.mGYouLose.x = this.Stage().canvas.width / 2 - 250 / 2;
		this.mGYouLose.y = this.Stage().canvas.height / 2 - 40 / 2 - 20;
		// this.mGYouLose.addChild( bg, gtext );
		this.mGYouLose.addChild( gtext );

		this.Stage().addChild( this.mGYouLose );
	}
	_BuildPlayAgain()
	{
		let bg = new createjs.Shape();
		bg.graphics.beginFill( 'rgba( 255, 0, 0, 0.5 )' ).drawRoundRect( 0, 0, 250, 40, 10 );

		let gtext = new createjs.Text( this.mLose.GetTextButton(), 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = 250 / 2;
		gtext.y = 40 / 2;

		this.mGPlayAgain = new createjs.Container();
		this.mGPlayAgain.x = this.Stage().canvas.width / 2 - 250 / 2;
		this.mGPlayAgain.y = this.Stage().canvas.height / 2 - 40 / 2 + 20;
		this.mGPlayAgain.addChild( bg, gtext );
		this.mGPlayAgain.on( 'click', this._PlayAgain, this );
		this.mGPlayAgain.cursor = 'pointer';

		this.Stage().addChild( this.mGPlayAgain );
	}
	
	_Stop()
	{
		this.Stage().removeChild( this.mGYouLose );
		this.Stage().removeChild( this.mGPlayAgain );

		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_PlayAgain( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		iEvent.remove();
		this._Stop();
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		this.Stage().update( iEvent );
	}
}
