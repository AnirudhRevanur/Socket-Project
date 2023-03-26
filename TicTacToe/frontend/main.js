let user = null;
let board = [];

var socket = io("http://localhost:3000", [
	{
		transports: ["websocket"],
	},
]);

socket.on("connect", function () {
    user = null;
    board = []
	document.getElementById("message").innerHTML = "Connected";
});

socket.on('setUser', function (data) {
    user = data;
    console.log(user);
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
	board[i] = "X";
	renderBoard();
}
