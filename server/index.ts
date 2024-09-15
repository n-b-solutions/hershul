import { createServer } from "http";

import connectDB from "./DB/mongoConnect";
import { viteNodeApp } from "./app";
import { initSocketio } from "./socketio";

//connect to DB
connectDB();
//create server
const server = createServer(viteNodeApp);
//connect to socket io
initSocketio(server);

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
