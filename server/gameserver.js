module.exports = function(map) {
	this.speed = 0.25;
	this.players = [];
	this.mapObject = map;

	this.update = function() {
		if (this.players != null) {
			for (i = 0; i < this.players.length; i++) {
				this.players[i].oldX = this.players[i].x;
				this.players[i].oldY = this.players[i].y;

				this.mapObject.updateTiles = [];
				if (this.players[i].x % 1 === 0 && this.players[i].y % 1 === 0) { //when in sqaure
					this.players[i].dir = this.players[i].nextDir;
					if (this.mapObject.map[this.players[i].x][this.players[i].y].id != this.players[i].id) {
						this.mapObject.setCellData(this.players[i].x, this.players[i].y, this.players[i].id, this.players[i].color);
					}
				}

				//x
				if (this.players[i].dir == "right") {
					this.players[i].x += this.speed;
				}
				if (this.players[i].dir == "left") {
					this.players[i].x -= this.speed;
				}

				//y
				if (this.players[i].dir == "up") {
					this.players[i].y -= this.speed;
				}
				if (this.players[i].dir == "down") {
					this.players[i].y += this.speed;
				}

				if (this.players[i].x < 0) {
					this.players[i].x = 0;
					this.players[i].dir = "stop";
				} else if (this.players[i].x > this.mapObject.mapSize - 1) {
					this.players[i].x = this.mapObject.mapSize - 1;
					this.players[i].dir = "stop";
				}

				if (this.players[i].y < 0) {
					this.players[i].y = 0;
					this.players[i].dir = "stop";
				} else if (this.players[i].y > this.mapObject.mapSize - 1) {
					this.players[i].y = this.mapObject.mapSize - 1;
					this.players[i].dir = "stop";
				}
			}
		}
	};


	this.changeDir = function(player, newDir) {
		if (player == null)
			return;
		if (newDir == "up" && player.dir == "down")
			return;
		if (newDir == "down" && player.dir == "up")
			return;
		if (newDir == "left" && player.dir == "right")
			return;
		if (newDir == "right" && player.dir == "left")
			return;
		player.nextDir = newDir;
	};

	this.addPlayer = function(player) {
		this.players.push(player);
	};

	this.removePlayer = function(player) {
		this.players.splice(this.players.indexOf(player), 1);
	};
};
