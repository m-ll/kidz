///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

export 
class cGame
{
	constructor()
	{
				 /*createjs.Bitmap*/ this.mGBackground = null;
		/*createjs.DisplayObject[]*/ this.mGSprites = [];
						  /*json[]*/ this.mTSprites = [];
		  /*createjs.DisplayObject*/ this.mCurrentSprite = null;
							
					/*cGame.eState*/ this.mState = cGame.eState.kIdle;
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
	/*cGame.eState*/
	GetState()
	{
		return this.mState;
	}
	SetState( /*cGame.eState*/ iState )
	{
		this.mState = iState;
	}

	/*createjs.DisplayObject*/
	GetCurrentSprite()
	{
		return this.mCurrentSprite;
	}
	/*createjs.Bitmap*/
	GetBackground()
	{
		return this.mGBackground;
	}

// public
	Init( /*cAssets*/ iAssets, /*json*/ iConfig )
	{
		this.mGBackground = iAssets.GetGBackground();
		this.mGSprites = iAssets.GetGSprites();
		this.mTSprites = iAssets.GetTSprites();
		
		this.mCurrentSprite = this.mGSprites[0];
		let current_tweens = this.mTSprites[0];
		this.mCurrentSprite.x = current_tweens[0].position.x;
		this.mCurrentSprite.y = current_tweens[0].position.y;
	}
	
	StartAnimation()
	{
		let tween = createjs.Tween.get( this.mCurrentSprite, { 'override': true } );
		
		let index = this.mGSprites.indexOf( this.mCurrentSprite );
		let tweens_param = this.mTSprites[index];
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
	}

	/*boolean*/
	StopAnimation()
	{
		let index = this.mGSprites.indexOf( this.mCurrentSprite );
		let next_index = index + 1;
		if( next_index === this.mGSprites.length )
			return true;

		this.mCurrentSprite = this.mGSprites[next_index];

		return false;
	}
}
