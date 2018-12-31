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

		                           /*string*/ this.mSFlip = '';
		                  /*createjs.Bitmap*/ this.mGBack = null;
		/*{string,createjs.DisplayObject}[]*/ this.mGCards = [];
	}
	
// public
	/*string*/
	GetSFlip()
	{
		return this.mSFlip;
	}
	/*createjs.Bitmap*/
	GetGBack()
	{
		return this.mGBack;
	}
	/*{string,createjs.DisplayObject}[]*/
	GetGCards()
	{
		return this.mGCards;
	}

// public
	Init( /*json*/ iConfig )
	{
		super.Init( iConfig.assets );
	}

	Load()
	{
		super.Load();
	}
	
// private
	_Finish()
	{
		this.mSFlip = this.GetAsset( 'flip' ).sound;
		this.mGBack = this.GetAsset( 'back' ).graphic;
		this.mGCards = this.GetAssetsStartWith( 'card-' ).map( asset => asset.graphic );

		super._Finish();
	}
}
