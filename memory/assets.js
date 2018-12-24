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

		               /*createjs.Container*/ this.mGProgress = null;

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
		
		this._BuildProgress();

		this._LoadBack();
	}

// private
	_BuildProgress()
	{
		let gprogress = new createjs.Shape();
		gprogress.graphics.beginFill( 'rgba( 255, 0, 0, 0.75 )' ).drawRect( 0, 0, 1, 40 ).endFill();

		// To be able to use scaleX on its child without scaling x/y of the container
		this.mGProgress = new createjs.Container();
		this.mGProgress.addChild( gprogress );

		this.mGProgress.x = this.Stage().canvas.width / 2 - 600 / 2;
		this.mGProgress.y = this.Stage().canvas.height / 2 - 40 / 2;

		this.Stage().addChild( this.mGProgress );
	}
	_RefreshProgress( /*number*/ iProgress )
	{
		this.mGProgress.getChildAt( 0 ).scaleX = iProgress;
		this.Stage().update();
	}

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
		
		// let gtext = new createjs.Text( 'Back Loaded ...', 'bold 20px Arial', '#000000' );
		// gtext.textAlign = 'center';
		// gtext.textBaseline = 'middle';
		// gtext.x = that.Stage().canvas.width / 2;
		// gtext.y = 20 * 2;

		// that.Stage().addChild( gtext );
		// that.Stage().update( iEvent );

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

		//---
		
		// let gtext = new createjs.Text( 'Card Loaded: ' + item.id + '...', 'bold 20px Arial', '#000000' );
		// gtext.textAlign = 'center';
		// gtext.textBaseline = 'middle';
		// gtext.x = that.Stage().canvas.width / 2;
		// gtext.y = 20 * ( 2 + that.mGCards.length );

		// that.Stage().addChild( gtext );
		// that.Stage().update( iEvent );
	}
	_ProgressCards( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		
		that._RefreshProgress( iEvent.loaded * 600 );
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
		
		// let gtext = new createjs.Text( 'Sound Loaded: ' + that.mSFlip + '...', 'bold 20px Arial', '#000000' );
		// gtext.textAlign = 'center';
		// gtext.textBaseline = 'middle';
		// gtext.x = that.Stage().canvas.width / 2;
		// gtext.y = 20 * ( 2 + that.mGCards.length + 1 );

		// that.Stage().addChild( gtext );
		// that.Stage().update( iEvent );

		//---
		
		that._Finish();
	}
}
