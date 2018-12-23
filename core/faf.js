///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cCycle } from '../core/cycle.js';

export 
class cFaf /* F(irst) A(nd) F(oremost): before assets loaded */ extends cCycle
{
	constructor( iStage, iNextCB, iNextCBData )
	{
		super( iStage, null, iNextCB, iNextCBData );

		this.mGText = null;
		this.mListener = null;
	}
	
// public
	Init()
	{
		super.Init();
	}
	
	Build()
	{
		super.Build();

		this.mGText = new createjs.Text( 'Welcome ...', 'bold 20px Arial', '#000000' );
		this.mGText.textAlign = 'center';
		this.mGText.textBaseline = 'middle';
		this.mGText.x = this.Stage().canvas.width / 2;
		this.mGText.y = 0; //this.Stage().canvas.height / 2;

		this.Stage().addChild( this.mGText );
	}
	
	Start()
	{
		super.Start();

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, this );
	}
	
// private
	_Stop()
	{
		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_Tick( iEvent, iData )
	{
		let that = iData;
		
		that.mGText.y += 10;

		if( that.mGText.y > that.Stage().canvas.height / 2 )
		{
			that.Stage().removeChild( that.mGText );

			iEvent.remove();
			that._Stop();
		}

		that.Stage().update( iEvent );
	}
}