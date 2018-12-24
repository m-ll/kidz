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
class cGame extends cCycle
{
	constructor( /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, iNextCB, iNextCBData );

		          /*cGame.eState*/ this.mState = cGame.eState.kIdle;
		/*createjs.DisplayObject*/ this.mCurrentSprite = null;
				 /*createjs.Text*/ this.mGContinue = null;
				 
		                /*object*/ this.mListener = null;
	}
	
// public
	static 
	get eState()
	{
		return {
				kIdle: 'idle',
				kStartAnimation: 'start-animation',
				kAnimation: 'animation',
				kStopAnimation: 'stop-animation',
				};
	}

// public
	Init()
	{
		super.Init();

		document.onkeydown = this._KeyHit.bind( this );
	}
	
	Build()
	{
		super.Build();

		this.Stage().addChild( this.Assets().GetGBackground() );

		this.mCurrentSprite = this.Assets().GetGSprites()[0];
		let current_tweens = this.Assets().GetTSprites()[0];
		this.mCurrentSprite.x = current_tweens[0].position.x;
		this.mCurrentSprite.y = current_tweens[0].position.y;
		this.Stage().addChild( this.mCurrentSprite );
		
		this.mGContinue = new createjs.Text( 'Press a key to continue...', 'bold 20px Arial', '#000000' );
		this.mGContinue.textAlign = 'center';
		this.mGContinue.textBaseline = 'middle';
		this.mGContinue.x = this.Stage().canvas.width / 2;
		this.mGContinue.y = this.Stage().canvas.height / 2;
		this.Stage().addChild( this.mGContinue );
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
		// It's commented to keep all stuff displayed during the win screen
		// this.Stage().removeAllChildren();

		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_KeyHit( /*object*/ iEvent )
	{
		let event = iEvent;
		if( !event )
			event = window.event;
			
		// switch( event.keyCode ) {}

		if( this.mState === cGame.eState.kIdle )
			this.mState = cGame.eState.kStartAnimation;
	}
	
	//---
	
	_StartAnimation()
	{
		this.Stage().removeChild( this.mGContinue );

		//---

		let tween = createjs.Tween.get( this.mCurrentSprite, { 'override': true } );
		
		let index = this.Assets().GetGSprites().indexOf( this.mCurrentSprite );
		let tweens_param = this.Assets().GetTSprites()[index];
		for( let i = 0; i < tweens_param.length; i++ )
		{
			let tween_param = tweens_param[i];

			if( tween_param.position )
			{
				this.mCurrentSprite.x = tween_param.position.x;
				this.mCurrentSprite.y = tween_param.position.y;
				continue;
			}

			if( tween_param.to )
			{
				tween.to( tween_param.to, tween_param.duration );
			}

			if( tween_param.wait )
			{
				tween.wait( tween_param.wait );
			}

			if( tween_param.call )
			{
				switch( tween_param.call )
				{
					case 'pause': tween.call( () => this.mCurrentSprite.stop() ); break;
					case 'resume': tween.call( () => this.mCurrentSprite.play() ); break;
				}
			}
		}
		
		tween.call( () => this.mState = cGame.eState.kStopAnimation/*, [], this*/ );

		//---

		this.Stage().addChild( this.mCurrentSprite );
	}

	_StopAnimation()
	{
		this.Stage().removeChild( this.mCurrentSprite );
		
		//---

		let index = this.Assets().GetGSprites().indexOf( this.mCurrentSprite );
		let next_index = index + 1;
		if( next_index === this.Assets().GetGSprites().length )
		{
			this._Stop();
			return;
		}

		this.mCurrentSprite = this.Assets().GetGSprites()[next_index];
		
		//---

		this.Stage().addChild( this.mGContinue );
	}

	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;

		switch( that.mState )
		{
			case cGame.eState.kIdle:
				break;
			case cGame.eState.kStartAnimation:
				that._StartAnimation();
				that.mState = cGame.eState.kAnimation;
				break;
			case cGame.eState.kAnimation:
				break;
			case cGame.eState.kStopAnimation:
				that._StopAnimation();
				that.mState = cGame.eState.kIdle;
				break;
		}
		
		that.Stage().update( iEvent );
	}
}
