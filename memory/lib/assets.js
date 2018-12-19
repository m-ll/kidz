///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

this.kidz = this.kidz||{};

(function() {
	"use strict";

// constructor
	function cAssets( iStage, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;
		
		this.mConfig = null;

		this.mGBack = null;
		this.mGCards = [];
	}
	
	var p = cAssets.prototype;
	
// public
	p.GetGBack = function()
	{
		return this.mGBack;
	};
	p.GetGCards = function()
	{
		return this.mGCards;
	};
	
	p.Load = function( iConfig )
	{
		this.mConfig = iConfig;
		this._LoadBack();
	};

// private
	p._LoadBack = function()
	{
		var that = this;
		
		var loader = new createjs.LoadQueue( false );
		loader.on( 'complete', that._BuildBack, null, false, that );
		loader.loadFile( { 'id': that.mConfig['card-back']['id'], 'src': that.mConfig['card-back']['name'] }, true, 'assets/' );
	};
	p._BuildBack = function( iEvent, iData )
	{
		var loader = iEvent.target;
		var that = iData;
		
		that.mGBack = new createjs.Bitmap( loader.getResult( that.mConfig['card-back']['id'] ) );
		var bounds = that.mGBack.getBounds();
		that.mGBack.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		
		//---
		
		var gtext = new createjs.Text( 'Back Loaded ...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.mStage.canvas.width / 2;
		gtext.y = 20 * 2;

		that.mStage.addChild( gtext );
		that.mStage.update( iEvent );

		//---
		
		that._LoadCards( iEvent, iData );
	};
	
	p._LoadCards = function( iEvent, iData )
	{
		var that = iData;
		
		var manifest = [];
		that.mConfig['cards'].forEach( iElement =>
		{
			manifest.push( { 'id': iElement['id'], 'src': iElement['name'] } );
		});

		var loader = new createjs.LoadQueue( false );
		loader.on( 'complete', that._Finish, null, false, that );
		loader.on( 'fileload', that._BuildCard, null, false, that );
		loader.loadManifest( manifest, true, 'assets/' );
	};
	p._BuildCard = function( iEvent, iData )
	{
		var loader = iEvent.target;
		var that = iData;
		var item = iEvent.item;
		
		var img = new createjs.Bitmap( loader.getResult( item.id ) );
		var bounds = img.getBounds();
		img.setBounds( bounds.x, bounds.y, bounds.width, bounds.height );
		that.mGCards.push( { 'id': item.id, 'image': img } );

		// var spriteSheet = new createjs.SpriteSheet(
		// {
			// framerate: 3,
			// 'images': [loader.getResult( 'butterfly' )],
			// 'frames': { 'regX': 0, 'regY': 0, 'width': 50, 'height': 50, 'count': 2 },
			// //define two animations, run (loops, 1.5x speed) and jump (returns to run):
			// 'animations': {
				// 'fly': [0, 1, 'fly', 3],
			// }
		// });
		// sgButterfly = new createjs.Sprite( spriteSheet, 'fly' );
		
		//---
		
		var gtext = new createjs.Text( 'Card Loaded: ' + item.id + '...', 'bold 20px Arial', '#000000' );
		gtext.textAlign = 'center';
		gtext.textBaseline = 'middle';
		gtext.x = that.mStage.canvas.width / 2;
		gtext.y = 20 * ( 2 + that.mGCards.length );

		that.mStage.addChild( gtext );
		that.mStage.update( iEvent );
	};

	p._Finish = function( iEvent, iData )
	{
		var that = iData;
		
		//---

		that.mStage.removeAllChildren();
		that.mNextCB.call( that.mNextCBData );
	};
	
// 
	kidz.cAssets = cAssets;
}());
