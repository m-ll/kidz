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
				kSpace: 'space',
				kTrap: 'trap'
				};
	}

	/*{createjs.Bitmap,createjs.Bitmap[]}*/
	Init( /*createjs.Bitmap[4]*/ iRunners, /*createjs.Bitmap*/ ioGoal, /*createjs.Bitmap*/ iTrap, /*json*/ iConfig, /*number*/ iLevel )
	{
		this.mTiles = [];
		this.mTileSize = iConfig.mazes[iLevel].tilesize;

		let runner = null;
		let traps = [];

		let maze = iConfig.mazes[iLevel].maze;
		maze.forEach( ( line, y ) => {
			let last_line = [];

			let letters = line.split( '' );
			letters.forEach( ( letter, x ) =>
			{
				switch( letter )
				{
					case '#': last_line.push( cMaze.eTileType.kWall ); break;
					case 't': last_line.push( cMaze.eTileType.kTrap ); break;

					case '^': 
					case '>': 
					case 'v': 
					case '<': 
					case 'x':
					default:
					case ' ': last_line.push( cMaze.eTileType.kSpace ); break;
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
					
					case 't': 
					{
						let trap = iTrap.clone();
						let width = trap.getBounds().width;
						let height = trap.getBounds().height;
						trap.x = this._Index2Pixel( x ) + this.mTileSize / 2 - width / 2; 
						trap.y = this._Index2Pixel( y ) + this.mTileSize / 2 - height / 2;
						traps.push( trap );
					}
					break;
				}
			});

			this.mTiles.push( last_line );
		});

		return { 'runner': runner, 'traps': traps };
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
					/*number*/ this.mLevel = 0;
					/*number*/ this.mLevelMax = 0;
			   
		   /*createjs.Bitmap*/ this.mGBackground = null;
		   /*createjs.Bitmap*/ this.mGRunner = null;
		/*createjs.Bitmap[4]*/ this.mGRunners = { 'top': null, 'right': null, 'bottom': null, 'left': null };
		   /*createjs.Bitmap*/ this.mGGoal = null;
		 /*createjs.Bitmap[]*/ this.mGTraps = [];

		      /*cGame.eState*/ this.mState = cGame.eState.kStartIdle;
	}
	
// public
	static 
	get eState() //TODO: move it to game-ui ?
	{
		return {
				// Idle
				kStartIdle: 'start-idle',
				kIdle: 'idle',
				kStopIdle: 'stop-idle',
				// Move
				kStartMove: 'start-move',
				kMove: 'move',
				kStopMove: 'stop-move',
				// End
				kNextLevel: 'next-level',
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
	/*createjs.Bitmap[]*/
	GetGTraps()
	{
		return this.mGTraps;
	}
	
	/*number*/
	GetLevel()
	{
		return this.mLevel;
	}
	SetLevel( /*number*/ iLevel )
	{
		this.mLevel = iLevel;
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
	
	Init( /*cAssets*/ iAssets, /*json*/ iConfig, /*number*/ iLevel )
	{
		this.mState = cGame.eState.kStartIdle;
		this.mLevel = iLevel;

		this.mGBackground = iAssets.GetGBackgrounds()[this.mLevel];
		this.mGGoal = iAssets.GetGGoal();
		this.mGRunners = iAssets.GetGRunners();

		this.mLevelMax = iConfig.mazes.length - 1;
		let runner_traps = this.mMaze.Init( this.mGRunners, this.mGGoal, iAssets.GetGTrap(), iConfig, this.mLevel );
		this.mGRunner = runner_traps.runner;
		this.mGTraps = runner_traps.traps;
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
		if( tiles.topleft.type === cMaze.eTileType.kWall || tiles.topright.type === cMaze.eTileType.kWall )
			new_y = tiles.topleft.y2 + 1;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}
	GotoRight( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x + iStep;
		let new_y = this.mGRunner.y;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.topright.type === cMaze.eTileType.kWall || tiles.bottomright.type === cMaze.eTileType.kWall )
			new_x = tiles.topright.x1 - this.mGRunner.getBounds().width;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}
	GotoBottom( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x;
		let new_y = this.mGRunner.y + iStep;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.bottomleft.type === cMaze.eTileType.kWall || tiles.bottomright.type === cMaze.eTileType.kWall )
			new_y = tiles.bottomleft.y1 - this.mGRunner.getBounds().height;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}
	GotoLeft( /*number*/ iStep )
	{
		let new_x = this.mGRunner.x - iStep;
		let new_y = this.mGRunner.y;

		let tiles = this.mMaze.GetTiles( this.mGRunner, new_x, new_y );
		if( tiles.topleft.type === cMaze.eTileType.kWall || tiles.bottomleft.type === cMaze.eTileType.kWall )
			new_x = tiles.topleft.x2 + 1;
		
		this.mMaze.SetPosition( this.mGRunner, new_x, new_y );
	}

	/*boolean*/
	NextLevel()
	{
		return this.Win() && this.mLevel < this.mLevelMax;
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
		let runner_x1 = this.mGRunner.x;
		let runner_x2 = this.mGRunner.x + this.mGRunner.getBounds().width - 1;
		let runner_y1 = this.mGRunner.y;
		let runner_y2 = this.mGRunner.y + this.mGRunner.getBounds().height - 1;

		return this.mGTraps.some( trap => 
		{
			let trap_x1 = trap.x;
			let trap_x2 = trap.x + trap.getBounds().width - 1;
			let trap_y1 = trap.y;
			let trap_y2 = trap.y + trap.getBounds().height - 1;
	
			if( runner_x2 < trap_x1 )
				return false;
			if( runner_x1 > trap_x2 )
				return false;
			if( runner_y2 < trap_y1 )
				return false;
			if( runner_y1 > trap_y2 )
				return false;
				
			return true;
		});
	}
}
