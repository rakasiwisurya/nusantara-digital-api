import app from "./app";

const port = process.env.PORT;

app.listen(port, () => {
  console.info(`[server] server is running on port: ${port}`);
});
