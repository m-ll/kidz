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
					
		   /*createjs.Text*/ this.mGLetter = null;
		  /*createjs.Tween*/ this.mGTween = null;

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

		//---

		this.mGLetter = this.mFaf.GetGLetters()[0];
		this.mGTween = this.mFaf.GetGTweens()[0];

		this.Stage().addChild( this.mGLetter );
		this.mListener = this.mGTween.on( 'complete', this._EndAnimation, this );
		this.mGTween.gotoAndPlay();
	}
	
	Start()
	{
		super.Start();
		
		this.Stage().canvas.style.backgroundColor = 'rgb( 0, 0, 0 )';

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, this );
	}
	
// private
	_Stop()
	{
		createjs.Ticker.off( 'tick', this.mListener );
		this.Stage().removeAllChildren();
		
		this.Stage().canvas.style.backgroundColor = '';

		super._Stop();
	}
	
	_EndAnimation()
	{
		this.mGTween.gotoAndStop();
		// this.Stage().removeChild( this.mGLetter ); // Commented to keep the letter displayed
		
		this.mGTween.off( 'complete', this.mListener );

		this.mGLetter = this.mFaf.NextGLetter( this.mGLetter );
		this.mGTween = this.mFaf.NextGTween( this.mGTween );

		if( !this.mGLetter )
		{
			this._Stop();
			return;
		}

		this.Stage().addChild( this.mGLetter );
		this.mListener = this.mGTween.on( 'complete', this._EndAnimation, this );
		this.mGTween.gotoAndPlay();
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		this.Stage().update( iEvent );
	}
}
