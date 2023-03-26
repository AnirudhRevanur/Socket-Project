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
	console.log("a user connected");

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
