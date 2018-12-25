///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cAssets as cCoreAssets } from '../core/assets.js';

export 
class cAssets extends cCoreAssets
{
	constructor()
	{
		super();

							/*json*/ this.mLevels = null;
							/*json*/ this.mTweens = null;
							/*json*/ this.mSounds = null;
									 
		         /*createjs.Bitmap*/ this.mGBackground = null;
		/*createjs.DisplayObject[]*/ this.mGSprites = [];
		                  /*json[]*/ this.mTSprites = [];
		                /*string[]*/ this.mSSprites = [];
	}
	
// public
	/*createjs.Bitmap*/
	GetGBackground()
	{
		return this.mGBackground;
	}
	/*createjs.DisplayObject[]*/
	GetGSprites()
	{
		return this.mGSprites;
	}
	/*json[]*/
	GetTSprites()
	{
		return this.mTSprites;
	}
	/*string[]*/
	GetSSprites()
	{
		return this.mSSprites;
	}

// public
	Init( /*json*/ iConfig )
	{
		super.Init( iConfig.assets );

		this.mLevels = iConfig.levels;
		this.mTweens = iConfig.tweens;
		this.mSounds = iConfig.sounds;
	}

	Load()
	{
		super.Load();
	}
	
// private
	_Finish()
	{
		this.mGBackground = this.GetAsset( 'background' ).graphic;

		let levels = this.mLevels;
		levels.forEach( level =>
		{
			this.mGSprites.push( this.GetAsset( level ).graphic );

			this.mTSprites.push( this.mTweens.find( tween => tween.id === level ).tweens );

			// In json file:
			// "sounds":
			// [
			// 	{
			// 		"id": "plane", 
			// 		"sound": "plane-sound"
			// 	}
			// ],
			// "assets":
			// [
			// 	{
			// 		"id": "plane-sound", 
			// 		"name": "plane.mp3" 
			// 	},
			// 	...
			// ]
			
			let sound = undefined;
			if( this.mSounds )
				sound = this.mSounds.find( sound => sound.id === level );
			this.mSSprites.push( sound ? sound.sound : undefined );
		});
		
		super._Finish();
	}
}
