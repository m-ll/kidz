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
	constructor( iStage, iNextCB, iNextCBData )
	{
		super( iStage, iNextCB, iNextCBData );

		this.mSFlip = '';
		this.mGBack = null;
		this.mGCards = [];
	}
	
// public
	GetSFlip()
	{
		return this.mSFlip;
	}
	GetGBack()
	{
		return this.mGBack;
	}
	GetGCards()
	{
		return this.mGCards;
	}

// public
	Init( iConfig )
	{
		super.Init( iConfig );
	}

	Load()
	{
		super.Load();

		this._LoadBack( this );
	}

// private
	_LoadBack( iData )
	{
		let that = iData;
		
		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', that._BuildBack, null, false, that );
		loader.loadFile( { 'id': that.Config().back.id, 'src': that.Config().back.name }, true, 'assets/' );
	}
	_BuildBack( iEvent, iData )
	{
		let loader = iEvent.target;
		let that = iData;
		
		that.mGBack = new createjs.Bitmap( loader.getResult( that.Config().back.id ) );
		let bounds = that.mGBack.getBounds();
		that.mGBack.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		
		//---
		
		let gtext = new createjs.Text( 'Back Loaded ...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.Stage().canvas.width / 2;
		gtext.y = 20 * 2;

		that.Stage().addChild( gtext );
		that.Stage().update( iEvent );

		//---
		
		that._LoadCards( iData );
	}
	
	_LoadCards( iData )
	{
		let that = iData;
		
		let manifest = [];
		that.Config().cards.forEach( iCard =>
		{
			manifest.push( { 'id': iCard.id, 'src': iCard.name } );
		});

		let loader = new createjs.LoadQueue( false );
		loader.on( 'complete', that._BuildCards, null, false, that );
		loader.on( 'fileload', that._BuildCard, null, false, that );
		loader.loadManifest( manifest, true, 'assets/' );
	}
	_BuildCard( iEvent, iData )
	{
		let loader = iEvent.target;
		let that = iData;
		let item = iEvent.item;
		
		let img = new createjs.Bitmap( loader.getResult( item.id ) );
		let bounds = img.getBounds();
		img.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		that.mGCards.push( { 'id': item.id, 'image': img } );

		//---
		
		let gtext = new createjs.Text( 'Card Loaded: ' + item.id + '...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.Stage().canvas.width / 2;
		gtext.y = 20 * ( 2 + that.mGCards.length );

		that.Stage().addChild( gtext );
		that.Stage().update( iEvent );
	}

	_BuildCards( iEvent, iData )
	{
		let that = iData;
		
		that._LoadFlip( that );
	}

	_LoadFlip( iData )
	{
		let that = iData;
		
		let loader = new createjs.LoadQueue( false );
		loader.installPlugin( createjs.Sound );
		loader.on( 'complete', that._BuildFlip, null, false, that );
		loader.loadFile( { 'id': that.Config().flip.id, 'src': that.Config().flip.name }, true, 'assets/' );
	}
	_BuildFlip( iEvent, iData )
	{
		// let loader = iEvent.target;
		let that = iData;
		
		that.mSFlip = that.Config().flip.id; //loader.getResult( that.Config().flip.id );
		
		//---
		
		let gtext = new createjs.Text( 'Sound Loaded: ' + that.mSFlip + '...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.Stage().canvas.width / 2;
		gtext.y = 20 * ( 2 + that.mGCards.length + 1 );

		that.Stage().addChild( gtext );
		that.Stage().update( iEvent );

		//---
		
		that._Finish();
	}
}
