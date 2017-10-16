var socket;

var playing = false;
var id;
var ip;
var map = [];

function playClicked() {
	if (document.getElementById("name").value == "") {
		alert("You must put a name");
		return;
	}
	document.getElementById("playButton").disabled = true;
	if (!playing) {
		play(document.getElementById("serverSelect").value);
	}
}

function play(server) {
	for (i = 0; i < servers.length; i++) {
		if (servers[i].name == server) {
			ip = "http://" + servers[i].ip + ":" + servers[i].port + "/";
		}
	}

	console.log("Connecting to server");
	socket = io.connect(ip);

	socket.emit("gameConnect", { //tell server youre connected with your preferences
		name: document.getElementById("name").value,
		color: document.getElementById("color").value
	});

	socket.on("gameConnected", function(response) { //once connected set localplayer to server's player
		console.log(response);
		localPlayer = response.playerInstance;
		id = response.playerInstance.id;
		map = response.map;
		mapSize = response.mapSize;
		tileSize = response.tileSize;
		innerTileSize = response.innerTileSize;
		document.getElementById("title").remove();
		document.getElementById("panel").remove();
		playing = true;
		console.log('Connected successfully to the server (' + response.playerInstance.name + " " + response.playerInstance.id + ")");
	});

	socket.on("playerAdded", function(player) {
		if (player.id == id)
			return;
		for (i = 0; i < otherPlayers.length; i++) {
			if (otherPlayers[i].id == player.id) {
				return; //found someone
			}
		}
		otherPlayers.push(player); //if not returned add player to otherplayers if its not yours
	});

	socket.on("playerRemoved", function(player) {
		//no need to check for localplayer
		for (i = 0; i < otherPlayers.length; i++) {
			if (otherPlayers[i].id == player.id) {
				otherPlayers.splice(otherPlayers[i], 1);
			}
		}
	});

	socket.on("updatePlayer", function(player) { //updatePlayers sent at 30hz
		if (player.id == id) {
			localPlayer.x = player.x;
			localPlayer.y = player.y;
		}
		for (i = 0; i < otherPlayers.length; i++) {
			if (otherPlayers[i].id == player.id) {
				otherPlayers[i].x = player.x;
				otherPlayers[i].y = player.y;
			}
		}
	});

	socket.on("updateTiles", function(updateTiles) {
		for (i = 0; i < updateTiles.length; i++) {
			map[updateTiles[i].x][updateTiles[i].y] = updateTiles[i];
		}
	});
}

function updateDir(dir) {
	socket.emit("updateDir", dir);
}
