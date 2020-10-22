import * as Express from 'express';
const app = Express();

const PORT = process.env.PORT || 8080;

app.get("/", (_req, res) => {
  res.send(`
    <h1>TypeScript Express</h1>
`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});