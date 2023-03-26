const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
app.use(cors());

const io = new Server(server, {
	cors: {
		origin: "https://localhost:5500",
	},
});

let users = [];
let turn = "X";
let board = ["", "", "", "", "", "", "", "", ""];

io.on("connection", (socket) => {
	if (users.length === 2) {
		socket.emit("full");
		return;
	}
	if (users.length == 0) {
		turn = "X";
		board = ["", "", "", "", "", "", "", "", ""];
	}

	let user = {
		id: socket.id,
		name: "Player " + (users.length + 1),
		symbol: users.length === 0 ? "X" : "O",
		number: users.length + 1,
	};

	if (users.length < 2) {
		users.push(user);
	}
	socket.emit("setUser", user);

	if (users.length === 2) {
		io.emit("start", {
			users: users,
			turn: turn,
			board: board,
		});
		io.sockets.emit("turn", turn);
	}

	socket.on("move", (data) => {
		board = data.board;
		turn = data.turn;

		io.emit("move", {
			board: board,
			turn: turn,
			i: data.i,
		});

		turn = turn === "X" ? "O" : "X";
		io.sockets.emit("turn", turn);

		let winner = "";
		if (board[0] === board[1] && board[1] === board[2] && board[0] !== "") {
			winner = board[0];
		}
		if (board[3] === board[4] && board[4] === board[5] && board[3] !== "") {
			winner = board[3];
		}
		if (board[6] === board[7] && board[7] === board[8] && board[6] !== "") {
			winner = board[6];
		}
		if (board[0] === board[3] && board[3] === board[6] && board[0] !== "") {
			winner = board[0];
		}
		if (board[1] === board[4] && board[1] === board[7] && board[1] !== "") {
			winner = board[1];
		}
		if (board[2] === board[5] && board[5] === board[8] && board[2] !== "") {
			winner = board[2];
		}
		if (board[0] === board[4] && board[4] === board[8] && board[0] !== "") {
			winner = board[0];
		}
		if (board[2] === board[4] && board[4] === board[6] && board[2] !== "") {
			winner = board[2];
		}
		if (winner !== "") {
			io.emit("winner", winner);
		}

		let draw = true;
		for (let i = 0; i < 9; i++) {
			if (board[i] === "") {
				draw = false;
			}
		}
		if (draw) {
			io.emit("winner", "Draw");
		}
	});

	socket.on("disconnect", () => {
		users = users.filter((user) => user.id !== socket.id);
	});
});

app.get("/", (req, res) => {
	res.send("<h1>Hello world</h1>");
});

server.listen(PORT, () => {
	console.log("listening on ", PORT);
});
