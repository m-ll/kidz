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
class cUI
{
	constructor( /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		/*createjs.Stage*/ this.mStage = iStage;
		       /*cAssets*/ this.mAssets = iAssets;
		      /*function*/ this.mNextCB = iNextCB;
		        /*object*/ this.mNextCBData = iNextCBData;
	}
	
// public
	/*createjs.Stage*/
	Stage()
	{
		return this.mStage;
	}

	/*cAssets*/
	Assets()
	{
		return this.mAssets;
	}
	
// public
	Init()
	{
	}
	
	Build()
	{
	}
	
	Start()
	{
	}
	
// protected
	_Stop( /*string*/ iNext )
	{
		if( !iNext )
		{
			this.mNextCB.call( this.mNextCBData );
			return;
		}

		this.mNextCB[iNext].call( this.mNextCBData );
	}
}
