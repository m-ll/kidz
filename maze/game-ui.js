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

export 
class cGameUI extends cUI
{
	constructor( /*cGame*/ iGame, /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextWinCB, /*function*/ iNextLoseCB, /*function*/ iNextLevelCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, { 'win': iNextWinCB, 'lose': iNextLoseCB, 'next': iNextLevelCB }, iNextCBData );

		   /*cGame*/ this.mGame = iGame;

		  /*object*/ this.mListener = null;
		/*number[]*/ this.mHelds = [];
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
		
		this.mGame.GetGGoal().gotoAndPlay( 'idle' );

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, this );
	}
	
// private
	_Stop()
	{
		createjs.Ticker.off( 'tick', this.mListener );
		
		this.mGame.GetGRunner().stop();
		this.mGame.GetGGoal().stop();

		if( this.mGame.GetState() === cGame.eState.kNextLevel )
		{
			this.Stage().removeAllChildren();
			super._Stop( 'next' );
		}
		else if( this.mGame.GetState() === cGame.eState.kWin )
		{
			super._Stop( 'win' );
		}
		else //if( this.mGame.GetState() === cGame.eState.kLose )
		{
			super._Stop( 'lose' );
		}

		// super._Stop();
	}
	
	// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
	_KeyDown( /*object*/ iEvent )
	{
		if( !iEvent )
			console.log( '!iEvent ...');
			
		if( iEvent.defaultPrevented )
			return; // Do nothing if the event was already processed
		
		if( iEvent.repeat )
			return;

		//---

		let event_key = iEvent.key;

 		// IE/Edge specific value
		switch( event_key )
		{
			case 'Up': event_key = 'ArrowUp'; break;
			case 'Right': event_key = 'ArrowRight'; break;
			case 'Down': event_key = 'ArrowDown'; break;
			case 'Left':  event_key = 'ArrowLeft'; break;
		}

		switch( event_key )
		{
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft': 
				this.mHelds = this.mHelds.filter( key => key != event_key ); 
				this.mHelds.push( event_key );

				if( this.mGame.GetState() === cGame.eState.kIdle )
					this.mGame.SetState( cGame.eState.kStopIdle );
				break;
		}
		
		// Cancel the default action to avoid it being handled twice
		// iEvent.preventDefault(); // Commented to be able to use F5
	}
	
	_KeyUp( /*object*/ iEvent )
	{
		if( !iEvent )
			console.log( '!iEvent ...');
			
		if( iEvent.defaultPrevented )
			return; // Do nothing if the event was already processed
		
		//---

		let event_key = iEvent.key;

 		// IE/Edge specific value
		switch( event_key )
		{
			case 'Up': event_key = 'ArrowUp'; break;
			case 'Right': event_key = 'ArrowRight'; break;
			case 'Down': event_key = 'ArrowDown'; break;
			case 'Left':  event_key = 'ArrowLeft'; break;
		}

		switch( event_key )
		{
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft': 
				this.mHelds = this.mHelds.filter( key => key != event_key );

				if( !this.mHelds.length )
					this.mGame.SetState( cGame.eState.kStopMove );
				else if( this.mHelds.length === 1 )
					this.mGame.SetState( cGame.eState.kStartMove );
				break;
		}
		
		// Cancel the default action to avoid it being handled twice
		// iEvent.preventDefault(); // Commented to be able to use F5
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		if( this.mGame.Win() )
			this.mGame.SetState( cGame.eState.kWin );
		if( this.mGame.Lose() )
			this.mGame.SetState( cGame.eState.kLose );
		if( this.mGame.NextLevel() )
			this.mGame.SetState( cGame.eState.kNextLevel );

		switch( this.mGame.GetState() )
		{
			case cGame.eState.kStartIdle:
				this.mGame.GetGRunner().gotoAndPlay( 'idle' );
				this.mGame.SetState( cGame.eState.kIdle );
				break;
			case cGame.eState.kIdle:
				break;
			case cGame.eState.kStopIdle:
				this.mGame.GetGRunner().stop();
				this.mGame.SetState( cGame.eState.kStartMove );
				break;
			case cGame.eState.kStartMove:
				this.Stage().removeChild( this.mGame.GetGRunner() );

				{
					let last_key = this.mHelds.slice(-1)[0];
					if( last_key === 'ArrowUp' )
						this.mGame.StartMoveTop();
					if( last_key === 'ArrowRight' )
						this.mGame.StartMoveRight();
					if( last_key === 'ArrowDown' )
						this.mGame.StartMoveBottom();
					if( last_key === 'ArrowLeft' )
						this.mGame.StartMoveLeft();
				}
				
				this.Stage().addChild( this.mGame.GetGRunner() );
				
				this.mGame.GetGRunner().gotoAndPlay( 'move' );
				this.mGame.SetState( cGame.eState.kMove );
				break;
			case cGame.eState.kMove:
				let step = iEvent.delta / 1000 * 200; // 200px / second
				
				this.mHelds.forEach( key =>
				{
					if( key === 'ArrowUp' )
						this.mGame.GotoTop( step );
					if( key === 'ArrowRight' )
						this.mGame.GotoRight( step );
					if( key === 'ArrowDown' )
						this.mGame.GotoBottom( step );
					if( key === 'ArrowLeft' )
						this.mGame.GotoLeft( step );
				});
				break;
			case cGame.eState.kStopMove:
				this.mGame.GetGRunner().stop();
				this.mGame.SetState( cGame.eState.kStartIdle );
				break;

			case cGame.eState.kNextLevel:
				this._Stop();
				break;
			case cGame.eState.kWin:
				this._Stop();
				break;
			case cGame.eState.kLose:
				this._Stop();
				break;
		}

		this.Stage().update( iEvent );
	}
}
