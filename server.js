import http from "node:http";
import express from "express";
const app = express();

const port = 3000;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));

app.use(express.static("public"));

app.all("*", function (req, res) {
  res.write("Hello world");
  res.end();
});