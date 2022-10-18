import http from "node:http";
import express from "express";
const app = express();

const port = 3001;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));

app.use(express.static('public', { index: '_' }));

app.all("*", async function (req, res) {

  if (req.url === '/') req.url = "/index";

  const assetsRegex = new RegExp("/__assets__/");
  const apiRegex = new RegExp("/__api__/");
  const htmlRegex = new RegExp(".html");

  const result = assetsRegex.exec(req.url) || apiRegex.exec(req.url) || htmlRegex.exec(req.url);

  if (result == null) {
    res.redirect(req.url + ".html");
    return;
  };

  if (htmlRegex != null) {
    //Try Server Side Rendering
    const route = req.url.split(".html")[0];
    let html = "";
    try {
      const { default: renderer } = await import("./functions" + route + ".js");
      // console.log(renderer);
      html = await renderer();
    } catch (error) {
      console.log(error);
    };
    res.send(html);
  };

});