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
class cFaf /* F(irst) A(nd) F(oremost): before assets loaded */
{
	constructor()
	{
		          /*number*/ this.mWidth = 0;
				  /*number*/ this.mHeight = 0;
				  
		          /*string*/ this.mText = 'm-ll';
		 /*createjs.Text[]*/ this.mGLetters = [];
		/*createjs.Tween[]*/ this.mGTweens = [];

				  /*object*/ this.mLetterOutside = {};
	}
	
// public
	/*createjs.Text[]*/
	GetGLetters()
	{
		return this.mGLetters;
	}
	/*createjs.Tween[]*/
	GetGTweens()
	{
		return this.mGTweens;
	}
	/*createjs.Text*/
	NextGLetter( /*createjs.Text*/ iLetter )
	{
		let index = this.mGLetters.indexOf( iLetter );
		if( index < 0 || index >= this.mGLetters.length - 1 )
			return null;

		index++;
		
		return this.mGLetters[index];
	}
	/*createjs.Tween*/
	NextGTween( /*createjs.Tween*/ iTween )
	{
		let index = this.mGTweens.indexOf( iTween );
		if( index < 0 || index >= this.mGTweens.length - 1 )
			return null;
		
		index++;
		
		return this.mGTweens[index];
	}
	
// public
	Init()
	{
	}

	Build( /*createjs.Stage*/ iStage )
	{
		this.mWidth = iStage.canvas.width;
		this.mHeight = iStage.canvas.height;

		this._BuildLetters();
		this._ComputeInfo();
		this._BuildTweens();
	}
	
// private
	_BuildLetters()
	{
		this.mText.split('').forEach( letter =>
		{
			let text = new createjs.Text( letter, 'bold 50px Arial', 'rgb( 255, 0, 0 )' );
			text.textAlign = 'center';
			text.textBaseline = 'middle';
			this.mGLetters.push( text );
		});
	}
	_ComputeInfo()
	{
		let max_width = Math.max( ...this.mGLetters.map( letter => letter.getBounds().width ), 0 );
		let max_height = Math.max( ...this.mGLetters.map( letter => letter.getBounds().height ), 0 );
		
		this.mLetterOutside.top = 0 - max_height / 2;
		this.mLetterOutside.bottom = this.mHeight + max_height / 2;
		this.mLetterOutside.left = 0 - max_width / 2;
		this.mLetterOutside.right = this.mWidth - max_width / 2;
	}

	/*number*/
	_Compute( /*string|number*/ iPos, /*number*/ iSize )
	{
		if( iPos === 'oleft' )
			return this.mLetterOutside.left;
		else if( iPos === 'oright' )
			return this.mLetterOutside.right;
		else if( iPos === 'otop' )
			return this.mLetterOutside.top;
		else if( iPos === 'obottom' )
			return this.mLetterOutside.bottom;
		else
			return iPos * iSize;
	}

	_BuildTweens()
	{
		let duration = 200;
		
		let tweens = 
		[
			{ 'from': { 'x': this._Compute( 'oleft' ),            'y': this._Compute( 0.8, this.mHeight ) }, 
				'to': { 'x': this._Compute( 0.42, this.mWidth ),  'y': this._Compute( 0.5, this.mHeight ) } },
			{ 'from': { 'x': this._Compute( 0.1, this.mWidth ),   'y': this._Compute( 'otop' ) }, 
				'to': { 'x': this._Compute( 0.47, this.mWidth ),  'y': this._Compute( 0.5, this.mHeight ) } },
			{ 'from': { 'x': this._Compute( 0.7, this.mWidth ),   'y': this._Compute( 'otop' ) }, 
				'to': { 'x': this._Compute( 0.52, this.mWidth ),  'y': this._Compute( 0.5, this.mHeight ) } },
			{ 'from': { 'x': this._Compute( 'oright' ),           'y': this._Compute( 0.7, this.mHeight ) }, 
				'to': { 'x': this._Compute( 0.57, this.mWidth ),  'y': this._Compute( 0.5, this.mHeight ) } }
		];
		
		this.mGLetters.forEach( ( letter, index ) => 
		{
			let index_tween = index % tweens.length;
			let from = tweens[index_tween].from;
			let to = tweens[index_tween].to;

			letter.x = from.x;
			letter.y = from.y;
			
			let tween = createjs.Tween.get( letter, { paused: true } ).to( { 'x': to.x, 'y': to.y, 'rotation': 360 * 2 }, duration );
			this.mGTweens.push( tween );
		});

		// Keep the last one displayed a little
		this.mGTweens.slice(-1)[0].wait( duration );
	}
}
