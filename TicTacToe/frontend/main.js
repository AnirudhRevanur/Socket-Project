let user = null;
let users = [];
let turn = "";
let board = [];

var socket = io("http://localhost:3000", [
	{
		transports: ["websocket"],
	},
]);

socket.on("connect", function () {
	user = null;
	board = [];
	document.getElementById("message").innerHTML = "Connected";
	document.getElementById("turn").innerHTML = "";
});

socket.on("full", () => {
	document.getElementById("message").innerHTML = "Server is full";
	document.getElementById("turn").innerHTML = "";
});

socket.on("setUser", function (data) {
	user = data;
	console.log(user);
});

socket.on("start", (data) => {
	users = data.users;
	turn = data.turn;
	board = data.board;
	renderBoard();

	document.getElementById(
		"message"
	).innerHTML = `You are ${user.name} and your symbol is ${user.symbol}`;
});

socket.on("turn", (data) => {
	turn = data;
	document.getElementById(
		"message"
	).innerHTML = `You are ${user.symbol}`;
	document.getElementById("turn").innerHTML = `It is ${turn}'s turn`;
});

socket.on("move", (data) => {
	board = data.board;
	turn = data.turn;
	renderBoard();
});

socket.on('winner', (data) => {
    document.getElementById('message').innerHTML = ''
    document.getElementById('turn').innerHTML = `The winner is ${data}`
})

socket.on("disconnect", function () {
	document.getElementById("message").innerHTML = "Disconnected";
});

window.onload = function () {
	renderBoard();
};

function renderBoard() {
	let boardDiv = document.getElementById("board");
	let boardHTML = "";
	for (let i = 0; i < board.length; i++) {
		boardHTML += `<div onclick="handleClick(${i})" class="cursor-pointer w-32 h-32 text-5xl text-white grid place-content-center border-2 ${
			board[i] === "O"
				? "bg-red-500"
				: board[i] === "X"
				? "bg-green-500"
				: ""
		}">${board[i]}</div>`;
	}
	boardDiv.innerHTML = boardHTML;
}

function handleClick(i) {
	if (board[i] === "") {
		if (turn === user.symbol) {
			board[i] = user.symbol;
			socket.emit("move", {
				board: board,
				turn: turn,
				i: i,
			});
		} else {
			document.getElementById("turn").innerHTML = `IT IS ${turn}'s TURN`;
		}
	}
}
