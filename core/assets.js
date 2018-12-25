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
	constructor()
	{
		   /*json*/ this.mConfig = null;

		/*{string,createjs.DisplayObject}[]*/ this.mGraphics = [];
		                /*{string,string}[]*/ this.mSounds = [];

		 /*number*/ this.mProgress = 0;
		/*boolean*/ this.mComplete = false;
	}
	
// public
	/*json*/ 
	Config()
	{
		return this.mConfig;
	}

	/*{string,object}*/
	GetAsset( /*string*/ iId )
	{
		let graphic = this.mGraphics.find( graphic => graphic.id === iId );
		if( graphic )
			return graphic;
		
		return this.mSounds.find( sound => sound.id === iId );
	}

	/*{string,object}[]*/
	GetAssetsStartWith( /*string*/ iId )
	{
		let graphics = this.mGraphics.filter( graphic => graphic.id.startsWith( iId ) );
		if( graphics )
			return graphics;
		
		return this.mSounds.filter( sound => sound.id.startsWith( iId ) );
	}

	/*boolean*/ 
	IsCompleted()
	{
		return this.mComplete;
	}
	
// public
	Init( /*json*/ iConfig )
	{
		this.mConfig = iConfig;
	}

	Load()
	{
		this._LoadGraphics();
	}
	
// protected
	/*number*/ 
	_GetProgress()
	{
		return this.mProgress;
	}
	_SetProgress( /*number*/ iProgress )
	{
		this.mProgress = iProgress;
	}

	_Finish()
	{
		this.mComplete = true;
	}

// private
	_LoadGraphics()
	{
		let manifest = [];
		this.Config().forEach( asset => manifest.push( { 'id': asset.id, 'src': asset.name } ) );

		let loader = new createjs.LoadQueue( false );
		loader.installPlugin( createjs.Sound );
		loader.on( 'complete', this._BuildGraphics, null, false, { that: this } );
		loader.on( 'fileload', this._BuildGraphic, null, false, { that: this } );
		loader.on( 'progress', this._ProgressGraphics, null, false, { that: this } );
		loader.loadManifest( manifest, true, 'assets/' );
	}
	_BuildGraphic( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let loader = iEvent.target;
		let that = iData.that;
		let item = iEvent.item;
		
		let asset = that.Config().find( asset => asset.id === item.id );

		if( asset.name.includes( '.wav' ) || asset.name.includes( 'mp3' ) )
		{
			that.mSounds.push( { 'id': asset.id, 'sound': asset.id } ); //loader.getResult( that.Config().flip.id );
		}
		else if( asset.spritesheet )
		{
			let spritesheet_images_id = asset.spritesheet.ids;
			let spritesheet_images = Array.from( spritesheet_images_id, id => loader.getResult( id ) );
			asset.spritesheet.images = spritesheet_images;

			let gspritesheet = new createjs.SpriteSheet( asset.spritesheet );
			let gsprite = new createjs.Sprite( gspritesheet, asset.start );
			let bounds = gsprite.getBounds();
			gsprite.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );

			that.mGraphics.push( { 'id': asset.id, 'graphic': gsprite } );
		}
		else
		{
			let gsprite = new createjs.Bitmap( loader.getResult( asset.id ) );
			let bounds = gsprite.getBounds();
			gsprite.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
			
			that.mGraphics.push( { 'id': asset.id, 'graphic': gsprite } );
		}
	}
	_ProgressGraphics( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that._SetProgress( iEvent.loaded ); //TODO: check divide by iEvent.total (?)
	}
	_BuildGraphics( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that._Finish();
	}
}
