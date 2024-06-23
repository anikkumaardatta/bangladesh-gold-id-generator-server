const app = require("./app");
const { serverPort } = require("./secret");
const connectDB = require("./configuration/db.config");

app.listen(serverPort, async (res) => {
  console.log(`BDGOLD app listening on http://localhost:${serverPort}/`);
  await connectDB();
});
