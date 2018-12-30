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
class cFafUI extends cUI
{
	constructor( /*cFaf*/ iFaf, /*createjs.Stage*/ iStage, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, null, iNextCB, iNextCBData );

		         /*cFaf*/ this.mFaf = iFaf;
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

		this.mGWelcome = new createjs.Text( this.mFaf.GetText(), 'bold 20px Arial', '#000000' );
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
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, this );
	}
	
// private
	_Stop()
	{
		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		this.mGWelcome.y += 10;

		if( this.mGWelcome.y > this.Stage().canvas.height / 2 )
		{
			this.Stage().removeChild( this.mGWelcome );

			iEvent.remove();
			this._Stop();
		}

		this.Stage().update( iEvent );
	}
}
