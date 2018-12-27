///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

class cBoundingBox
{
	constructor( /*number*/ iX, /*number*/ iY, /*number*/ iWidth, /*number*/ iHeight )
	{
		/*number*/ this.mX = iX;
		/*number*/ this.mY = iY;
		/*number*/ this.mWidth = Math.max( 1, iWidth );
		/*number*/ this.mHeight = Math.max( 1, iHeight );
	}

	/*number*/ X() { return this.mX; }
	/*number*/ Y() { return this.mY; }
	/*number*/ Width() { return this.mWidth; }
	/*number*/ Height() { return this.mHeight; }

	/*number*/ X1() { return this.mX; }
	/*number*/ Y1() { return this.mY; }
	/*number*/ X2() { return this.mX + this.mWidth - 1; }
	/*number*/ Y2() { return this.mY + this.mHeight - 1; }
}

class cMaze
{
	constructor()
	{
		             /*number*/ this.mTileSize = 1;
		/*cMaze.eTileType[][]*/ this.mTiles = [];
		             /*number*/ this.mRunnerBB = null;
		             /*number*/ this.mGoalBB = null;
	}
	
// public
	static 
	get eTileType()
	{
		return {
				kWall: 'wall',
				kSpace: 'space'
				};
	}

	Init( /*cAssets*/ iAssets, /*json*/ iConfig )
	{
		this.mTiles = [];
		this.mTileSize = iConfig.tilesize;

		let maze = iConfig.maze;
		maze.forEach( ( line, y ) => {
			let last_line = [];

			let letters = line.split( '' );
			letters.forEach( ( letter, x ) =>
			{
				switch( letter )
				{
					case '#': last_line.push( cMaze.eTileType.kWall ); break;
					default:
					case ' ': last_line.push( cMaze.eTileType.kSpace ); break;

					case 'o': 
					{
						let width = iAssets.GetGRunner().getBounds().width;
						let height = iAssets.GetGRunner().getBounds().height;
						this.mRunnerBB = new cBoundingBox( this._Index2Pixel( x ) + this.mTileSize / 2 - width / 2, 
															this._Index2Pixel( y ) + this.mTileSize / 2 - height / 2,
															width,
															height );

						last_line.push( cMaze.eTileType.kSpace ); 
					}
					break;
					case 'x': 
					{
						let width = iAssets.GetGGoal().getBounds().width;
						let height = iAssets.GetGGoal().getBounds().height;
						this.mGoalBB = new cBoundingBox( this._Index2Pixel( x ) + this.mTileSize / 2 - width / 2, 
															this._Index2Pixel( y ) + this.mTileSize / 2 - height / 2,
															width,
															height );

						last_line.push( cMaze.eTileType.kSpace );
					}
					break;
				}
			});

			this.mTiles.push( last_line );
		});
	}

	/*object*/
	GetRunnerTiles( /*number*/ iX, /*number*/ iY )
	{
		let bb = new cBoundingBox( iX, iY, this.mRunnerBB.Width(), this.mRunnerBB.Height() );
		let tile_x1 = Math.floor( bb.X1() / this.mTileSize );
		let tile_y1 = Math.floor( bb.Y1() / this.mTileSize );
		let tile_x2 = Math.floor( bb.X2() / this.mTileSize );
		let tile_y2 = Math.floor( bb.Y2() / this.mTileSize );
		return { 
			'topleft': { 'type': this.mTiles[tile_y1][tile_x1], 
			             'x1': this._Index2Pixel( tile_x1 ), 'y1': this._Index2Pixel( tile_y1 ), 'x2': this._Index2Pixel( tile_x1 + 1 ) - 1, 'y2': this._Index2Pixel( tile_y1 + 1 ) - 1 },
			'topright': { 'type': this.mTiles[tile_y1][tile_x2],
			              'x1': this._Index2Pixel( tile_x2 ), 'y1': this._Index2Pixel( tile_y1 ), 'x2': this._Index2Pixel( tile_x2 + 1 ) - 1, 'y2': this._Index2Pixel( tile_y1 + 1 ) - 1 },
			'bottomright': { 'type': this.mTiles[tile_y2][tile_x2],
			                 'x1': this._Index2Pixel( tile_x2 ), 'y1': this._Index2Pixel( tile_y2 ), 'x2': this._Index2Pixel( tile_x2 + 1 ) - 1, 'y2': this._Index2Pixel( tile_y2 + 1 ) - 1 },
			'bottomleft': { 'type': this.mTiles[tile_y2][tile_x1],
			                'x1': this._Index2Pixel( tile_x1 ), 'y1': this._Index2Pixel( tile_y2 ), 'x2': this._Index2Pixel( tile_x1 + 1 ) - 1, 'y2': this._Index2Pixel( tile_y2 + 1 ) - 1 },
			}
	}

	/*cBoundingBox*/
	GetRunnerBoundingBox()
	{
		return this.mRunnerBB;
	}
	SetRunnerPosition( /*number*/ iX, /*number*/ iY )
	{
		this.mRunnerBB.mX = this._ClampX( iX );
		this.mRunnerBB.mY = this._ClampY( iY );
	}

	/*cBoundingBox*/
	GetGoalBoundingBox()
	{
		return this.mGoalBB;
	}
	SetGoalPosition( /*number*/ iX, /*number*/ iY )
	{
		this.mGoalBB.mX = this._ClampX( iX );
		this.mGoalBB.mY = this._ClampY( iY );
	}

// private
	/*number*/
	_ClampX( /*number*/ iX )
	{
		return Math.min( Math.max( iX, 0 ), this._Index2Pixel( this.mTiles[0].length ) - 1 );
	}
	/*number*/
	_ClampY( /*number*/ iY )
	{
		return Math.min( Math.max( iY, 0 ), this._Index2Pixel( this.mTiles.length ) - 1 );
	}

	/*number*/
	_Index2Pixel( /*number*/ iIndex )
	{
		return iIndex * this.mTileSize;
	}
}

export 
class cGame
{
	constructor()
	{
			      /*cMaze*/ this.mMaze = new cMaze();
			   
		/*createjs.Bitmap*/ this.mGBackground = null;
		/*createjs.Bitmap*/ this.mGRunner = null;
		/*createjs.Bitmap*/ this.mGGoal = null;

		   /*cGame.eState*/ this.mState = cGame.eState.kIdle;
	}
	
// public
	static 
	get eState()
	{
		return {
				kIdle: 'idle',
				kMove: 'move',
				kWin: 'win',
				kLose: 'lose'
				};
	}

// public
	/*createjs.Bitmap*/
	GetGBackground()
	{
		return this.mGBackground;
	}
	/*createjs.Bitmap*/
	GetGRunner()
	{
		return this.mGRunner;
	}
	/*createjs.Bitmap*/
	GetGGoal()
	{
		return this.mGGoal;
	}

	/*cGame.eState*/
	GetState()
	{
		return this.mState;
	}
	SetState( /*cGame.eState*/ iState )
	{
		this.mState = iState;
	}
	
	Init( /*cAssets*/ iAssets, /*json*/ iConfig )
	{
		this.mState = cGame.eState.kIdle;
		
		this.mGBackground = iAssets.GetGBackground(); //TODO: maybe clone ?
		this.mGRunner = iAssets.GetGRunner();
		this.mGGoal = iAssets.GetGGoal();
		
		this.mMaze.Init( iAssets, iConfig );
	}

	/*{number,number}*/
	GetRunnerPosition()
	{
		return { 'x': this.mMaze.GetRunnerBoundingBox().X(), 'y': this.mMaze.GetRunnerBoundingBox().Y() };
	}
	/*{number,number}*/
	GetGoalPosition()
	{
		return { 'x': this.mMaze.GetGoalBoundingBox().X(), 'y': this.mMaze.GetGoalBoundingBox().Y() };
	}

	GotoTop( /*number*/ iStep )
	{
		let new_x = this.mMaze.GetRunnerBoundingBox().X();
		let new_y = this.mMaze.GetRunnerBoundingBox().Y() - iStep;

		let tiles = this.mMaze.GetRunnerTiles( new_x, new_y );
		if( tiles.topleft.type !== cMaze.eTileType.kSpace || tiles.topright.type !== cMaze.eTileType.kSpace )
			new_y = tiles.topleft.y2 + 1;
		
		this.mMaze.SetRunnerPosition( new_x, new_y );
	}
	GotoRight( /*number*/ iStep )
	{
		let new_x = this.mMaze.GetRunnerBoundingBox().X() + iStep;
		let new_y = this.mMaze.GetRunnerBoundingBox().Y();

		let tiles = this.mMaze.GetRunnerTiles( new_x, new_y );
		if( tiles.topright.type !== cMaze.eTileType.kSpace || tiles.bottomright.type !== cMaze.eTileType.kSpace )
			new_x = tiles.topright.x1 - this.mMaze.GetRunnerBoundingBox().Width();
		
		this.mMaze.SetRunnerPosition( new_x, new_y );
	}
	GotoBottom( /*number*/ iStep )
	{
		let new_x = this.mMaze.GetRunnerBoundingBox().X();
		let new_y = this.mMaze.GetRunnerBoundingBox().Y() + iStep;

		let tiles = this.mMaze.GetRunnerTiles( new_x, new_y );
		if( tiles.bottomleft.type !== cMaze.eTileType.kSpace || tiles.bottomright.type !== cMaze.eTileType.kSpace )
			new_y = tiles.bottomleft.y1 - this.mMaze.GetRunnerBoundingBox().Height();
		
		this.mMaze.SetRunnerPosition( new_x, new_y );
	}
	GotoLeft( /*number*/ iStep )
	{
		let new_x = this.mMaze.GetRunnerBoundingBox().X() - iStep;
		let new_y = this.mMaze.GetRunnerBoundingBox().Y();

		let tiles = this.mMaze.GetRunnerTiles( new_x, new_y );
		if( tiles.topleft.type !== cMaze.eTileType.kSpace || tiles.bottomleft.type !== cMaze.eTileType.kSpace )
			new_x = tiles.topleft.x2 + 1;
		
		this.mMaze.SetRunnerPosition( new_x, new_y );
	}

	/*boolean*/
	Win()
	{
		let center_x = this.mMaze.GetRunnerBoundingBox().X() + this.mMaze.GetRunnerBoundingBox().Width() / 2;
		let center_y = this.mMaze.GetRunnerBoundingBox().Y() + this.mMaze.GetRunnerBoundingBox().Height() / 2;

		if( center_x < this.mMaze.GetGoalBoundingBox().X() )
			return false;
		if( center_x > this.mMaze.GetGoalBoundingBox().X() + this.mMaze.GetGoalBoundingBox().Width() - 1 )
			return false;
		if( center_y < this.mMaze.GetGoalBoundingBox().Y() )
			return false;
		if( center_y > this.mMaze.GetGoalBoundingBox().Y() + this.mMaze.GetGoalBoundingBox().Height() - 1 )
			return false;

		return true;
	}

	/*boolean*/
	Lose()
	{
		// return this.mMaze.GetRunnerX() === this.mMaze.GetTrapX();
		return false;
	}
}
