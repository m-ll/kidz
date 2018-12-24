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
	constructor( /*createjs.Stage*/ iStage, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, null, iNextCB, iNextCBData );

		/*createjs.Text*/ this.mGWelcome = null;
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

		this.mGWelcome = new createjs.Text( 'Welcome ...', 'bold 20px Arial', '#000000' );
		this.mGWelcome.textAlign = 'center';
		this.mGWelcome.textBaseline = 'middle';
		this.mGWelcome.x = this.Stage().canvas.width / 2;
		this.mGWelcome.y = 0;

		this.Stage().addChild( this.mGWelcome );
	}
	
	Start()
	{
		super.Start();

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, { that: this } );
	}
	
// private
	_Stop()
	{
		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that.mGWelcome.y += 10;

		if( that.mGWelcome.y > that.Stage().canvas.height / 2 )
		{
			that.Stage().removeChild( that.mGWelcome );

			iEvent.remove();
			that._Stop();
		}

		that.Stage().update( iEvent );
	}
}
