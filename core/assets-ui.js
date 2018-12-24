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
class cAssetsUI extends cUI
{
	constructor( /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, iNextCB, iNextCBData );

		/*createjs.Container*/ this.mGProgress = null;
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

		this._BuildProgress();
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
	
	_BuildProgress()
	{
		let gprogress = new createjs.Shape();
		gprogress.graphics.beginFill( 'rgba( 255, 0, 0, 0.75 )' ).drawRect( 0, 0, 1, 40 ).endFill();

		// To be able to use scaleX on its child without scaling x/y of the container
		this.mGProgress = new createjs.Container();
		this.mGProgress.addChild( gprogress );

		this.mGProgress.x = this.Stage().canvas.width / 2 - 600 / 2;
		this.mGProgress.y = this.Stage().canvas.height / 2 - 40 / 2;

		this.Stage().addChild( this.mGProgress );
	}

	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;

		if( that.Assets().IsCompleted() )
		{
			iEvent.remove();
			that._Stop();
		}
		else
		{
			that.mGProgress.getChildAt( 0 ).scaleX = that.Assets()._GetProgress() * 600;
		}

		that.Stage().update( iEvent );
	}
}
