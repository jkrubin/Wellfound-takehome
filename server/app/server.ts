import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./sequelize";
import router from "./routes";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.port || 8080;

app.use("/v1", router);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
  });
});
