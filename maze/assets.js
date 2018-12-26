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

		/*createjs.Bitmap*/ this.mGBackground = null;
		/*createjs.Bitmap*/ this.mGRunner = null;
		/*createjs.Bitmap*/ this.mGGoal = null;
		/*createjs.Bitmap*/ this.mGTrap = null;
	}
	
// public
	/*createjs.Bitmap*/
	GetGBackground()
	{
		return this.mGBackground;
	}
	/*createjs.Bitmap*/
	GetGRunner()
	{
		return this.mGRunner;
	}
	/*createjs.Bitmap*/
	GetGGoal()
	{
		return this.mGGoal;
	}
	/*createjs.Bitmap*/
	GetGTrap()
	{
		return this.mGTrap;
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
		this.mGBackground = this.GetAsset( 'background' ).graphic;
		this.mGRunner = this.GetAsset( 'runner' ).graphic;
		this.mGGoal = this.GetAsset( 'goal' ).graphic;
		this.mGTrap = this.GetAsset( 'trap' ).graphic;

		super._Finish();
	}
}
