///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cAssets as cAssetsA } from '../core/assets.js';

export 
class cAssets extends cAssetsA
{
	constructor()
	{
		super();

							/*json*/ this.mLevels = null;
							/*json*/ this.mTweens = null;
									 
		         /*createjs.Bitmap*/ this.mGBackground = null;
		/*createjs.DisplayObject[]*/ this.mGSprites = [];
		                  /*json[]*/ this.mTSprites = [];
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

// public
	Init( /*json*/ iConfig )
	{
		super.Init( iConfig.assets );

		this.mLevels = iConfig.levels;
		this.mTweens = iConfig.tweens;
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
		});
		
		super._Finish();
	}
}
