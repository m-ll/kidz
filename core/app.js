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
class cApp
{
	constructor()
	{
		this.mConfig = null;
		this.mCanvasId = '';

		this.mStage = null;
	}
	
// public
	Stage()
	{
		return this.mStage;
	}
	
	Config()
	{
		return this.mConfig;
	}
	
// public
	Init( iConfig, iCanvasId )
	{
		this.mConfig = iConfig;
		this.mCanvasId = iCanvasId;

		createjs.Sound.registerPlugins( [createjs.HTMLAudioPlugin] );
		// createjs.Sound.initializeDefaultPlugins(); // WebAudioPlugin will raise an error when refreshing page: InvalidStateError: An attempt was made to use an object that is not, or is no longer, usable
		
		//TODO: error handling
	}
	
	Build()
	{
		this.mStage = new createjs.Stage( this.mCanvasId );
		this.mStage.enableMouseOver();
		
		createjs.Touch.enable( this.mStage );
	}
	
	Start()
	{
	}
}
