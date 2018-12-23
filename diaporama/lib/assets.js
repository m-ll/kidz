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
	constructor( iStage, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;
		
		this.mConfig = null;

		this.mGBackground = null;
		this.mGSprites = [];
		this.mTSprites = [];
	}
	
// public
	GetGBackground()
	{
		return this.mGBackground;
	}
	GetGSprites()
	{
		return this.mGSprites;
	}
	GetTSprites()
	{
		return this.mTSprites;
	}
	
	Load( iConfig )
	{
		this.mConfig = iConfig;
		this._LoadBackground();
	}

// private
	_LoadBackground()
	{
		let that = this;
		
		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', that._BuildBackground, null, false, that );
		loader.loadFile( { 'id': that.mConfig.background.id, 'src': that.mConfig.background.name }, true, 'assets/' );
	}
	_BuildBackground( iEvent, iData )
	{
		let loader = iEvent.target;
		let that = iData;
		
		that.mGBackground = new createjs.Bitmap( loader.getResult( that.mConfig.background.id ) );
		let bounds = that.mGBackground.getBounds();
		that.mGBackground.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		
		//---
		
		let gtext = new createjs.Text( 'Background Loaded ...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.mStage.canvas.width / 2;
		gtext.y = 20 * 2;

		that.mStage.addChild( gtext );
		that.mStage.update( iEvent );

		//---
		
		that._LoadSprites( iEvent, iData );
	}
	
	_LoadSprites( iEvent, iData )
	{
		let that = iData;
		
		let manifest = [];
		that.mConfig.levels.forEach( iLevel =>
		{
			manifest.push( { 'id': iLevel.id, 'src': iLevel.name } );
		});

		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', that._BuildSprites, null, false, that );
		loader.on( 'fileload', that._BuildSprite, null, false, that );
		loader.loadManifest( manifest, true, 'assets/' );
	}
	_BuildSprite( iEvent, iData )
	{
		let loader = iEvent.target;
		let that = iData;
		let item = iEvent.item;
		
		let level = that.mConfig.levels.find( iLevel => iLevel.id === item.id );

		if( level.spritesheet )
		{
			let spritesheet_images_id = level.spritesheet.ids;
			let spritesheet_images = Array.from( spritesheet_images_id, iId => loader.getResult( iId ) );
			level.spritesheet.images = spritesheet_images;

			let gspritesheet = new createjs.SpriteSheet( level.spritesheet );
			let gsprite = new createjs.Sprite( gspritesheet, level.start );
			let bounds = gsprite.getBounds();
			gsprite.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );

			that.mGSprites.push( gsprite );
		}
		else
		{
			let gsprite = new createjs.Bitmap( loader.getResult( level.id ) );
			let bounds = gsprite.getBounds();
			gsprite.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
			
			that.mGSprites.push( gsprite );
		}

		that.mTSprites.push( level.tweens ); //TODO: maybe get them in game as they are not really assets
		
		//---
		
		let gtext = new createjs.Text( 'Sprite Loaded: ' + level.id + '...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.mStage.canvas.width / 2;
		gtext.y = 20 * ( 2 + that.mGSprites.length );

		that.mStage.addChild( gtext );
		that.mStage.update( iEvent );
	}

	_BuildSprites( iEvent, iData )
	{
		let that = iData;
		
		that._Finish( iEvent, that );
	}

	_Finish( iEvent, iData )
	{
		let that = iData;
		
		//---

		that.mStage.removeAllChildren();
		that.mNextCB.call( that.mNextCBData );
	}
}
