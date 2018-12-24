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
		super.Init( iConfig );
	}

	Load()
	{
		super.Load();
		
		this._LoadBack();
	}

// private
	_LoadBack()
	{
		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', this._BuildBack, null, false, { that: this } );
		loader.loadFile( { 'id': this.Config().back.id, 'src': this.Config().back.name }, true, 'assets/' );
	}
	_BuildBack( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let loader = iEvent.target;
		let that = iData.that;
		
		that.mGBack = new createjs.Bitmap( loader.getResult( that.Config().back.id ) );
		let bounds = that.mGBack.getBounds();
		that.mGBack.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		
		//---
		
		that._LoadCards();
	}
	
	_LoadCards()
	{
		let manifest = [];
		this.Config().cards.forEach( iCard =>
		{
			manifest.push( { 'id': iCard.id, 'src': iCard.name } );
		});

		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', this._BuildCards, null, false, { that: this } );
		loader.on( 'fileload', this._BuildCard, null, false, { that: this } );
		loader.on( 'progress', this._ProgressCards, null, false, { that: this } );
		loader.loadManifest( manifest, true, 'assets/' );
	}
	_BuildCard( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let loader = iEvent.target;
		let that = iData.that;
		let item = iEvent.item;
		
		let img = new createjs.Bitmap( loader.getResult( item.id ) );
		let bounds = img.getBounds();
		img.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		that.mGCards.push( { 'id': item.id, 'image': img } );

	}
	_ProgressCards( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that._SetProgress( iEvent.loaded );
	}
	_BuildCards( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that._LoadFlip();
	}

	_LoadFlip()
	{
		let loader = new createjs.LoadQueue( false );
		loader.installPlugin( createjs.Sound );
		loader.on( 'complete', this._BuildFlip, null, false, { that: this } );
		loader.loadFile( { 'id': this.Config().flip.id, 'src': this.Config().flip.name }, true, 'assets/' );
	}
	_BuildFlip( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		// let loader = iEvent.target;
		let that = iData.that;
		
		that.mSFlip = that.Config().flip.id; //loader.getResult( that.Config().flip.id );
		
		//---
		
		that._Finish();
	}
}
