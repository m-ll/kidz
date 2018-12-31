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

	/*number*/
	_Compute( /*string|number*/ iPos, /*createjs.Text*/ iLetter, /*number*/ iSize )
	{
		let max_width = iLetter.getBounds().width;
		let max_height = iLetter.getBounds().height;
		
		let outside_top = 0 - max_height / 2;
		let outside_bottom = this.mHeight + max_height / 2;
		let outside_left = 0 - max_width / 2;
		let outside_right = this.mWidth - max_width / 2;

		if( iPos === 'oleft' )
			return outside_left;
		else if( iPos === 'oright' )
			return outside_right;
		else if( iPos === 'otop' )
			return outside_top;
		else if( iPos === 'obottom' )
			return outside_bottom;
		else
			return iPos * iSize;
	}

	_BuildTweens()
	{
		let duration = 200;
		
		let tweens = 
		[
			{ 'from': { 'x': 'oleft',  'y': Math.random()      }, 'to': { 'x': 0.42, 'y': 0.50 } },
			{ 'from': { 'x': Math.random(),     'y': 'otop'    }, 'to': { 'x': 0.47, 'y': 0.50 } },
			{ 'from': { 'x': Math.random(),     'y': 'obottom' }, 'to': { 'x': 0.52, 'y': 0.50 } },
			{ 'from': { 'x': 'oright', 'y': Math.random()      }, 'to': { 'x': 0.57, 'y': 0.50 } }
		];
		
		this.mGLetters.forEach( ( letter, index ) => 
		{
			let index_tween = index % tweens.length;
			let from = { 'x': this._Compute( tweens[index_tween].from.x, letter, this.mWidth ), 'y': this._Compute( tweens[index_tween].from.y, letter, this.mHeight ) };
			let to = { 'x': this._Compute( tweens[index_tween].to.x, letter, this.mWidth ), 'y': this._Compute( tweens[index_tween].to.y, letter, this.mHeight ) };

			letter.x = from.x;
			letter.y = from.y;
			
			let tween = createjs.Tween.get( letter, { paused: true } ).to( { 'x': to.x, 'y': to.y, 'rotation': 360 * 2 }, duration );
			this.mGTweens.push( tween );
		});

		// Keep the last one displayed a little
		this.mGTweens.slice(-1)[0].wait( duration );
	}
}
