///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

class cMaze
{
	constructor()
	{
		             /*number*/ this.mTileSize = 1;
		/*cMaze.eTileType[][]*/ this.mTiles = [];
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

	/*createjs.Bitmap*/
	Init( /*createjs.Bitmap[4]*/ iRunners, /*createjs.Bitmap*/ ioGoal, /*json*/ iConfig )
	{
		this.mTiles = [];
		this.mTileSize = iConfig.tilesize;

		let runner = null;

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

					case '^': 
					case '>': 
					case 'v': 
					case '<': last_line.push( cMaze.eTileType.kSpace ); break;

					case 'x': last_line.push( cMaze.eTileType.kSpace ); break;
				}

				switch( letter )
				{
					case '^': runner = iRunners.top; break;
					case '>': runner = iRunners.right; break;
					case 'v': runner = iRunners.bottom; break;
					case '<': runner = iRunners.left; break;
				}

				switch( letter )
				{
					case '^':
					case '>':
					case 'v':
					case '<':
					{
						let width = runner.getBounds().width;
						let height = runner.getBounds().height;
						runner.x = this._Index2Pixel( x ) + this.mTileSize / 2 - width / 2; 
						runner.y = this._Index2Pixel( y ) + this.mTileSize / 2 - height / 2;
					}
					break;
					
					case 'x': 
					{
						let width = ioGoal.getBounds().width;
						let height = ioGoal.getBounds().height;
						ioGoal.x = this._Index2Pixel( x ) + this.mTileSize / 2 - width / 2; 
						ioGoal.y = this._Index2Pixel( y ) + this.mTileSize / 2 - height / 2;
					}
					break;
				}
			});

			this.mTiles.push( last_line );
		});

		return runner;
	}

	/*object*/
	GetTiles( /*createjs.Bitmap*/ iGraphic, /*number*/ iX, /*number*/ iY )
	{
		let tile_x1 = Math.floor( iX / this.mTileSize );
		let tile_y1 = Math.floor( iY / this.mTileSize );
		let tile_x2 = Math.floor( ( iX + iGraphic.getBounds().width - 1 ) / this.mTileSize );
		let tile_y2 = Math.floor( ( iY + iGraphic.getBounds().height - 1 ) / this.mTileSize );
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

	SetPosition( /*createjs.Bitmap*/ ioGraphic, /*number*/ iX, /*number*/ iY )
	{
		ioGraphic.x = this._ClampX( iX );
		ioGraphic.y = this._ClampY( iY );
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
		/*createjs.Bitmap[4]*/ this.mGRunners = { 'top': null, 'right': null, 'bottom': null, 'left': null };
		/*createjs.Bitmap*/ this.mGGoal = null;

		   /*cGame.eState*/ this.mState = cGame.eState.kStartIdle;
	}
	
// public
	static 
	get eState()
	{
		return {
				kStartIdle: 'start-idle',
				kIdle: 'idle',
				kStopIdle: 'stop-idle',
				kStartMove: 'start-move',
				kMove: 'move',
				kStopMove: 'stop-move',
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
		this.mState = cGame.eState.kStartIdle;
		
		this.mGBackground = iAssets.GetGBackground(); //TODO: maybe clone ?
		this.mGGoal = iAssets.GetGGoal();
		this.mGRunners = iAssets.GetGRunners();

		this.mGRunner = this.mMaze.Init( this.mGRunners, this.mGGoal, iConfig );
	}
	
	StartMoveTop()
	{
		let new_runner = this.mGRunners.top;
		let previous_runner = this.mGRunner;
		switch( previous_runner )
		{
			case this.mGRunners.top:
			case this.mGRunners.bottom:
				new_runner.x = this.mGRunner.x;
				new_runner.y = this.mGRunner.y;
				break;
			case this.mGRunners.right:
			case this.mGRunners.left:
				new_runner.x = previous_runner.x + previous_runner.getBounds().width / 2 - new_runner.getBounds().width / 2;
				new_runner.y = previous_runner.y + previous_runner.getBounds().height / 2 - new_runner.getBounds().height / 2;
				break;
		}
		this.mGRunner = new_runner;

		this.GotoTop( 0 ); // To recompute the position to not have a part inside the wall
	}
	StartMoveRight()
	{
		let new_runner = this.mGRunners.right;
		let previous_runner = this.mGRunner;
		switch( previous_runner )
		{
			case this.mGRunners.top:
			case this.mGRunners.bottom:
				new_runner.x = previous_runner.x + previous_runner.getBounds().width / 2 - new_runner.getBounds().width / 2;
				new_runner.y = previous_runner.y + previous_runner.getBounds().height / 2 - new_runner.getBounds().height / 2;
				break;
			case this.mGRunners.right:
			case this.mGRunners.left:
				new_runner.x = this.mGRunner.x;
				new_runner.y = this.mGRunner.y;
				break;
		}
		this.mGRunner = new_runner;

		this.GotoRight( 0 );
	}
	StartMoveBottom()
	{
		let new_runner = this.mGRunners.bottom;
		let previous_runner = this.mGRunner;
		switch( previous_runner )
		{
			case this.mGRunners.top:
			case this.mGRunners.bottom:
				new_runner.x = this.mGRunner.x;
				new_runner.y = this.mGRunner.y;
				break;
			case this.mGRunners.right:
			case this.mGRunners.left:
				new_runner.x = previous_runner.x + previous_runner.getBounds().width / 2 - new_runner.getBounds().width / 2;
				new_runner.y = previous_runner.y + previous_runner.getBounds().height / 2 - new_runner.getBounds().height / 2;
				break;
		}
		this.mGRunner = new_runner;

		this.GotoBottom( 0 );
	}
	StartMoveLeft()
	{
		let new_runner = this.mGRunners.left;
		let previous_runner = this.mGRunner;
		switch( previous_runner )
		{
			case this.mGRunners.top:
			case this.mGRunners.bottom:
				new_runner.x = previous_runner.x + previous_runner.getBounds().width / 2 - new_runner.getBounds().width / 2;
				new_runner.y = previous_runner.y + previous_runner.getBounds().height / 2 - new_runner.getBounds().height / 2;
				break;
			case this.mGRunners.right:
			case this.mGRunners.left:
				new_runner.x = this.mGRunner.x;
				new_runner.y = this.mGRunner.y;
				break;
		}
		this.mGRunner = new_runner;

		this.GotoLeft( 0 );
	}

	GotoTop( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x;
		let new_y = this.mGRunner.y - iStep;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.topleft.type !== cMaze.eTileType.kSpace || tiles.topright.type !== cMaze.eTileType.kSpace )
			new_y = tiles.topleft.y2 + 1;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}
	GotoRight( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x + iStep;
		let new_y = this.mGRunner.y;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.topright.type !== cMaze.eTileType.kSpace || tiles.bottomright.type !== cMaze.eTileType.kSpace )
			new_x = tiles.topright.x1 - this.mGRunner.getBounds().width;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}
	GotoBottom( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x;
		let new_y = this.mGRunner.y + iStep;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.bottomleft.type !== cMaze.eTileType.kSpace || tiles.bottomright.type !== cMaze.eTileType.kSpace )
			new_y = tiles.bottomleft.y1 - this.mGRunner.getBounds().height;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}
	GotoLeft( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x - iStep;
		let new_y = this.mGRunner.y;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.topleft.type !== cMaze.eTileType.kSpace || tiles.bottomleft.type !== cMaze.eTileType.kSpace )
			new_x = tiles.topleft.x2 + 1;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}

	/*boolean*/
	Win()
	{
		let center_x = this.mGRunner.x + this.mGRunner.getBounds().width / 2;
		let center_y = this.mGRunner.y + this.mGRunner.getBounds().height / 2;

		if( center_x < this.mGGoal.x )
			return false;
		if( center_x > this.mGGoal.x + this.mGGoal.getBounds().width - 1 )
			return false;
		if( center_y < this.mGGoal.y )
			return false;
		if( center_y > this.mGGoal.y + this.mGGoal.getBounds().height - 1 )
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
