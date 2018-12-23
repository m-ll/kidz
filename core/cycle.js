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
class cCycle
{
	constructor( iStage, iAssets, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mAssets = iAssets;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;
	}
	
// public
	Stage()
	{
		return this.mStage;
	}

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
	_Stop()
	{
		this.mNextCB.call( this.mNextCBData );
	}
}
