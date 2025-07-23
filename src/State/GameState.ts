export class GameState {

	private static instance: GameState;
	aircraftState = new Map();
	currentAircraft: string;
	
	public static getInstanceOf(): GameState
	{
		if (this.instance == null) 
		{
			this.instance = new GameState();
		}
		
		return this.instance;
	}

}