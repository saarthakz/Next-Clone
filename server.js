import http from "node:http";
import express from "express";
const app = express();

const port = 3001;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));

app.use(express.static("public"));

app.all("*", function (req, res) {

  const assetsRegex = new RegExp("/__assets__/");
  const apiRegex = new RegExp("/__api__/");
  const htmlRegex = new RegExp(".html");

  const result = assetsRegex.exec(req.url) || apiRegex.exec(req.url) || htmlRegex.exec(req.url);

  if (result == null) {
    res.redirect(req.url + ".html");
  } else {
    res.send("Hello");
    res.end();
  };

});