///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cGame } from './game.js';
import { cUI } from '../core/ui.js';

const KEYCODE_UP = 38;
const KEYCODE_RIGHT = 39;
const KEYCODE_DOWN = 40;
const KEYCODE_LEFT = 37;

export 
class cGameUI extends cUI
{
	constructor( /*cGame*/ iGame, /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, iNextCB, iNextCBData );

		  /*cGame*/ this.mGame = iGame;

		 /*object*/ this.mListener = null;
		/*boolean*/ this.mTopHeld = false;
		/*boolean*/ this.mRightHeld = false;
		/*boolean*/ this.mBottomHeld = false;
		/*boolean*/ this.mLeftHeld = false;
	}
	
// public
	Init()
	{
		super.Init();

		document.onkeydown = this._KeyDown.bind( this );
		document.onkeyup = this._KeyUp.bind( this );
	}
	
	Build()
	{
		super.Build();

		this.Stage().addChild( this.mGame.GetGBackground() );
		this.Stage().addChild( this.mGame.GetGGoal() );
		this.Stage().addChild( this.mGame.GetGRunner() );
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
	
	_KeyDown( /*object*/ iEvent )
	{
		let event = iEvent;
		if( !event )
			event = window.event;

		switch( event.keyCode )
		{
			case KEYCODE_UP: this.mTopHeld = true; break;
			case KEYCODE_RIGHT: this.mRightHeld = true; break;
			case KEYCODE_DOWN: this.mBottomHeld = true; break;
			case KEYCODE_LEFT: this.mLeftHeld = true; break;
		}
	}
	
	_KeyUp( /*object*/ iEvent )
	{
		let event = iEvent;
		if( !event )
			event = window.event;
			
		switch( event.keyCode )
		{
			case KEYCODE_UP: this.mTopHeld = false; break;
			case KEYCODE_RIGHT: this.mRightHeld = false; break;
			case KEYCODE_DOWN: this.mBottomHeld = false; break;
			case KEYCODE_LEFT: this.mLeftHeld = false; break;
		}
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;

		if( that.mGame.Win() )
			that.mGame.SetState( cGame.eState.kWin );
		if( that.mGame.Lose() )
			that.mGame.SetState( cGame.eState.kLose );

		switch( that.mGame.GetState() )
		{
			case cGame.eState.kStartIdle:
				that.mGame.GetGRunner().gotoAndPlay( 'idle' );
				that.mGame.SetState( cGame.eState.kIdle );
				break;
			case cGame.eState.kIdle:
				if( that.mTopHeld || that.mRightHeld || that.mBottomHeld || that.mLeftHeld )
				{
					that.mGame.SetState( cGame.eState.kStopIdle );
				}
				break;
			case cGame.eState.kStopIdle:
				that.mGame.GetGRunner().stop();
				that.mGame.SetState( cGame.eState.kStartMove );
				break;
			case cGame.eState.kStartMove:
				that.Stage().removeChild( that.mGame.GetGRunner() );

				if( that.mTopHeld )
					that.mGame.StartMoveTop();
				if( that.mRightHeld )
					that.mGame.StartMoveRight();
				if( that.mBottomHeld )
					that.mGame.StartMoveBottom();
				if( that.mLeftHeld )
					that.mGame.StartMoveLeft();
					
				that.Stage().addChild( that.mGame.GetGRunner() );
				
				that.mGame.GetGRunner().gotoAndPlay( 'move' );
				that.mGame.SetState( cGame.eState.kMove );
				break;
				//TODO: try to find a way to change the sprite because: down right (mouse-to-right) > down bottom (mouse-to-right) > up right (still mouse-to-right)
			case cGame.eState.kMove:
				let step = iEvent.delta / 1000 * 200; // 200px / second
				
				if( that.mTopHeld )
					that.mGame.GotoTop( step );
				if( that.mRightHeld )
					that.mGame.GotoRight( step );
				if( that.mBottomHeld )
					that.mGame.GotoBottom( step );
				if( that.mLeftHeld )
					that.mGame.GotoLeft( step );
				
				if( !that.mTopHeld && !that.mRightHeld && !that.mBottomHeld && !that.mLeftHeld )
				{
					that.mGame.SetState( cGame.eState.kStopMove );
				}
				break;
			case cGame.eState.kStopMove:
				that.mGame.GetGRunner().stop();
				that.mGame.SetState( cGame.eState.kStartIdle );
				break;

			case cGame.eState.kWin:
				that.mGame.GetGRunner().stop();
				that._Stop();
				break;
			case cGame.eState.kLose:
				that.mGame.GetGRunner().stop();
				that._Stop();
				break;
		}

		that.Stage().update( iEvent );
	}
}
