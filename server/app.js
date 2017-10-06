const PORT = 27015;
var io = require('socket.io')(PORT);
var uuid = require('uuid/v4');
var player = require('./player.js');
var gameServer = require('./GameServer.js');
var gs = new gameServer(io);

console.log('socket.io:: Listening on port ' + PORT);

io.on('connection', function(client) { // when socket gets connection
	client.on('gameConnect', function(name) { // when game sends gameConnect
		client.playerInstance = new player.Player(name, uuid()); // give client a playerinstance
		gs.addPlayer(client.playerInstance);
		client.emit('gameConnected', { // give client it's properties
			playerInstance: client.playerInstance
		});
		console.log('socket.io:: client ' + client.playerInstance.name + " (" + client.playerInstance.id + ') connected');
	});

	client.on('updateDir', function(newDir) {
		client.playerInstance.dir = newDir;
	});

	client.on('disconnect', function() {
		gs.removePlayer(client.playerInstance);
		console.log('socket.io:: client ' + client.playerInstance.name + " (" + client.playerInstance.id + ') disconnected');
	});
});

function update() {
	gs.update();
	io.emit("updatePlayers", gs.players);
}
setInterval(update, 1000 / 30);
