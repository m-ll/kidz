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

		    /*createjs.Shape*/ this.mGBar = null;
		     /*createjs.Text*/ this.mGText = null;
		/*createjs.Container*/ this.mGProgressBar = null;
		            /*number*/ this.mGProgressBarSize = { 'width': 600, 'height': 50 };
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

		this._BuildProgressBar();
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
	
	_BuildProgressBar()
	{
		this.mGBackground = new createjs.Shape();
		this.mGBackground.graphics.beginFill( 'rgba( 255, 0, 0, 0.5 )' ).drawRect( 0, 0, this.mGProgressBarSize.width, this.mGProgressBarSize.height ).endFill();
		
		this.mGBar = new createjs.Shape();
		this.mGBar.graphics.beginFill( 'rgba( 255, 0, 0, 0.9 )' ).drawRect( 0, 0, 1, this.mGProgressBarSize.height ).endFill();
		
		this.mGText = new createjs.Text( '0%', 'bold 20px Arial', '#000000' );
		this.mGText.textAlign = 'center';
		this.mGText.textBaseline = 'middle';
		this.mGText.x = this.mGProgressBarSize.width / 2;
		this.mGText.y = this.mGProgressBarSize.height / 2;

		// To be able to use scaleX on its child without scaling x/y of the container
		this.mGProgressBar = new createjs.Container();
		this.mGProgressBar.addChild( this.mGBackground, this.mGBar, this.mGText );

		this.mGProgressBar.x = this.Stage().canvas.width / 2 - this.mGProgressBarSize.width / 2;
		this.mGProgressBar.y = this.Stage().canvas.height / 2 - this.mGProgressBarSize.height / 2;

		this.Stage().addChild( this.mGProgressBar );
	}

	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let progress = this.Assets()._GetProgress();
		this.mGBar.scaleX = progress * this.mGProgressBarSize.width;
		let progress_100 = Math.floor( progress * 100 );
		this.mGText.text = `${progress_100}%`;

		if( this.Assets().IsCompleted() )
		{
			iEvent.remove();
			this._Stop();
		}

		this.Stage().update( iEvent );
	}
}
