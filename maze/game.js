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
		/*cMaze.eTileType[][]*/ this.mTiles = [];
		    /*{number,number}*/ this.mRunner = {};
		    /*{number,number}*/ this.mGoal = {};
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

	Init( /*json*/ iConfig )
	{
		this.mTiles = [];

		let maze = iConfig;
		maze.forEach( line => {
			let last_line = [];

			let letters = line.split( '' );
			letters.forEach( letter =>
			{
				switch( letter )
				{
					case '#': last_line.push( cMaze.eTileType.kWall ); break;
					default:
					case ' ': last_line.push( cMaze.eTileType.kSpace ); break;
				}
			});

			this.mTiles.push( last_line );
		});

		for( let y = 0; y < maze.length; y++ )
		{
			let line = maze[y];
			for( let x = 0; x < line.length; x++ )
			{
				let letter = line[x];
				if( letter === 'o' )
					this.mRunner = { 'x': x, 'y': y };
				if( letter === 'x' )
					this.mGoal = { 'x': x, 'y': y };
			}
		}
	}

	/*cMaze.eTileType*/
	GetTile( /*number*/ iX, /*number*/ iY )
	{
		return this.mTiles[iY][iX];
	}

	/*{number,number}*/
	GetRunnerPosition()
	{
		return Object.assign( {}, this.mRunner );
	}
	SetRunnerPosition( /*number*/ iX, /*number*/ iY )
	{
		this.mRunner.x = this._ClampX( iX );
		this.mRunner.y = this._ClampY( iY );
	}
	/*{number,number}*/
	GetGoalPosition()
	{
		return Object.assign( {}, this.mGoal );
	}
	SetGoalPosition( /*number*/ iX, /*number*/ iY )
	{
		this.mGoal.x = this._ClampX( iX );
		this.mGoal.y = this._ClampY( iY );
	}

// private
	/*number*/
	_ClampX( /*number*/ iX )
	{
		return Math.min( Math.max( iX, 0 ), this.mTiles[0].length - 1 );
	}
	/*number*/
	_ClampY( /*number*/ iY )
	{
		return Math.min( Math.max( iY, 0 ), this.mTiles.length - 1 );
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
		
		this.mMaze.Init( iConfig.maze );
	}

	/*{number,number}*/
	GetRunnerPosition()
	{
		return { 'x': this.mMaze.GetRunnerPosition().x * 50, 'y': this.mMaze.GetRunnerPosition().y * 50 };
	}
	/*{number,number}*/
	GetGoalPosition()
	{
		return { 'x': this.mMaze.GetGoalPosition().x * 50, 'y': this.mMaze.GetGoalPosition().y * 50 };
	}

	GotoTop()
	{
		let new_x = this.mMaze.GetRunnerPosition().x;
		let new_y = this.mMaze.GetRunnerPosition().y - 1;

		this._MoveTo( new_x, new_y );
	}
	GotoRight()
	{
		let new_x = this.mMaze.GetRunnerPosition().x + 1;
		let new_y = this.mMaze.GetRunnerPosition().y;

		this._MoveTo( new_x, new_y );
	}
	GotoBottom()
	{
		let new_x = this.mMaze.GetRunnerPosition().x;
		let new_y = this.mMaze.GetRunnerPosition().y + 1;

		this._MoveTo( new_x, new_y );
	}
	GotoLeft()
	{
		let new_x = this.mMaze.GetRunnerPosition().x - 1;
		let new_y = this.mMaze.GetRunnerPosition().y;

		this._MoveTo( new_x, new_y );
	}

	/*boolean*/
	Win()
	{
		return this.mMaze.GetRunnerPosition().x === this.mMaze.GetGoalPosition().x &&
			   this.mMaze.GetRunnerPosition().y === this.mMaze.GetGoalPosition().y;
	}

	/*boolean*/
	Lose()
	{
		// return this.mMaze.GetRunnerPosition() === this.mMaze.GetTrapPosition();
		return false;
	}

// private
	_MoveTo( /*number*/ iX, /*number*/ iY )
	{
		if( this.mMaze.GetTile( iX, iY ) === cMaze.eTileType.kWall )
			return;
		
		this.mMaze.SetRunnerPosition( iX, iY );
	}
}
