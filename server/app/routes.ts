import express from "express";
import userRouter from "../controllers/user";
import listingRouter from "../controllers/listing";
import candidateRouter from "../controllers/candidate";
const app = express();

app.use("/auth", userRouter);
app.use("/listing", listingRouter);
app.use("/candidate", candidateRouter);
export default app;
