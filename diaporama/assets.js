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
	constructor( /*createjs.Stage*/ iStage, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iNextCB, iNextCBData );

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
		super.Init( iConfig );
	}

	Load()
	{
		super.Load();

		this._LoadBackground();
	}
	
// private
	_LoadBackground()
	{
		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', this._BuildBackground, null, false, { that: this } );
		loader.loadFile( { 'id': this.Config().background.id, 'src': this.Config().background.name }, true, 'assets/' );
	}
	_BuildBackground( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let loader = iEvent.target;
		let that = iData.that;
		
		that.mGBackground = new createjs.Bitmap( loader.getResult( that.Config().background.id ) );
		let bounds = that.mGBackground.getBounds();
		that.mGBackground.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		
		//---
		
		let gtext = new createjs.Text( 'Background Loaded ...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.Stage().canvas.width / 2;
		gtext.y = 20 * 2;

		that.Stage().addChild( gtext );
		that.Stage().update( iEvent );

		//---
		
		that._LoadSprites();
	}
	
	_LoadSprites()
	{
		let manifest = [];
		this.Config().levels.forEach( iLevel =>
		{
			manifest.push( { 'id': iLevel.id, 'src': iLevel.name } );
		});

		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', this._BuildSprites, null, false, { that: this } );
		loader.on( 'fileload', this._BuildSprite, null, false, { that: this } );
		loader.loadManifest( manifest, true, 'assets/' );
	}
	_BuildSprite( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let loader = iEvent.target;
		let that = iData.that;
		let item = iEvent.item;
		
		let level = that.Config().levels.find( iLevel => iLevel.id === item.id );

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
		gtext.x = that.Stage().canvas.width / 2;
		gtext.y = 20 * ( 2 + that.mGSprites.length );

		that.Stage().addChild( gtext );
		that.Stage().update( iEvent );
	}

	_BuildSprites( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that._Finish();
	}
}
