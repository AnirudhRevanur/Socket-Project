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
