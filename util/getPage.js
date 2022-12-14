export default function getPage(markup = "", title = "", scriptPath = "", serializedProps) {

  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  <body>
    <div id="root">${markup}</div>
  </body>
  <script>
    window.__DATA__ = ${serializedProps};
  </script>
  <script src="${scriptPath}" type="module"></script>

  </html>
`;
};