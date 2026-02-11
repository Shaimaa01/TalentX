import { ErrorHandler, ErrorApp } from "../src/infrastructure/ErrorApp";
import express, { Request, Response, NextFunction } from "express";

const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  next("Hello");
});

app.use(ErrorHandler);
app.listen("8080", () => {
  console.log("All good");
});
