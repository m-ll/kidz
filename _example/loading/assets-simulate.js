///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cAssets as cCoreAssets } from '../../core/assets.js';

const sleep = ( milliseconds ) => 
{
	return new Promise( resolve => setTimeout( resolve, milliseconds ) );
}  

export 
class cAssetsSimulate extends cCoreAssets
{
	constructor( /*number*/ iNumberLoop, /*number*/ iDuration )
	{
		super();

		/*number*/ this.mDuration = iDuration;	
		/*number*/ this.mNumberLoop = iNumberLoop;	

		/*number*/ this.mLoop = 0;	
	}
	
// public
	Init()
	{
		super.Init( [] );
	}

	Load()
	{
		// Overwrite everything and simulate our own assets loading
		// super.Load();
		this._Loop();
	}
	
// private
	_Loop()
	{
		sleep( this.mDuration ).then( () => 
		{	
			this._SetProgress( this.mLoop / this.mNumberLoop );
			
			if( this.mLoop >= this.mNumberLoop )
			{
				this._Finish();
				return;
			}

			this.mLoop++;
			this._Loop();
		});
	}
	_Finish()
	{
		super._Finish();
	}
}
