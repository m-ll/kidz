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
class cAssets
{
	constructor( /*createjs.Stage*/ iStage, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		/*createjs.Stage*/ this.mStage = iStage;
		      /*function*/ this.mNextCB = iNextCB;
		        /*object*/ this.mNextCBData = iNextCBData;
		
		          /*json*/ this.mConfig = null;
	}
	
// public
	/*json*/ 
	Config()
	{
		return this.mConfig;
	}

	/*createjs.Stage*/
	Stage()
	{
		return this.mStage;
	}

// public
	Init( /*json*/ iConfig )
	{
		this.mConfig = iConfig;
	}

	Load()
	{
	}

// protected
	_Finish()
	{
		this.mStage.removeAllChildren();
		this.mNextCB.call( this.mNextCBData );
	}
}
