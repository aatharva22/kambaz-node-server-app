import express from "express"
const app = express();
import Hello from "./hello.js";
import Lab5 from "./Lab5/index.js";
Hello(app);
Lab5(app)
app.listen(4000
);