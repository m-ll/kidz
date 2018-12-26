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

		/*createjs.Bitmap*/ this.mBackground = null;
		/*createjs.Bitmap*/ this.mRunner = null;
		/*createjs.Bitmap*/ this.mGoal = null;

		 /*number*/ this.mStartWait = 0;
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

		this.mBackground = this.Assets().GetGBackground();
		this.mRunner = this.Assets().GetGRunner();
		this.mGoal = this.Assets().GetGGoal();
		
		this.Stage().addChild( this.mBackground );
		this.Stage().addChild( this.mGoal );
		this.Stage().addChild( this.mRunner );

		this._Refresh();
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
	
	_Refresh()
	{
		this.mRunner.x = this.mGame.GetRunnerPosition().x;
		this.mRunner.y = this.mGame.GetRunnerPosition().y;
		this.mGoal.x = this.mGame.GetGoalPosition().x;
		this.mGoal.y = this.mGame.GetGoalPosition().y;
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;

		switch( that.mGame.GetState() )
		{
			case cGame.eState.kIdle:
				if( that.mTopHeld || that.mRightHeld || that.mBottomHeld || that.mLeftHeld )
				{
					that.mGame.SetState( cGame.eState.kMove );
					that.mStartWait = 0;
				}
				break;
			case cGame.eState.kMove:
				let delta = Date.now() - that.mStartWait;
				if( that.mStartWait && delta < 0.1 * 1000 )
					break;
				that.mStartWait = Date.now();

				if( that.mTopHeld )
					that.mGame.GotoTop();
				else if( that.mRightHeld )
					that.mGame.GotoRight();
				else if( that.mBottomHeld )
					that.mGame.GotoBottom();
				else if( that.mLeftHeld )
					that.mGame.GotoLeft();

				if( that.mGame.Win() )
					that.mGame.SetState( cGame.eState.kWin );
				if( that.mGame.Lose() )
					that.mGame.SetState( cGame.eState.kLose );

				if( !that.mTopHeld && !that.mRightHeld && !that.mBottomHeld && !that.mLeftHeld )
					that.mGame.SetState( cGame.eState.kIdle );
				break;
			case cGame.eState.kWin:
				that._Stop();
				break;
			case cGame.eState.kLose:
				that._Stop();
				break;
		}

		that._Refresh();
		
		that.Stage().update( iEvent );
	}
}