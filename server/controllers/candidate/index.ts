import express from "express";
import * as usersController from "../user/userController";
import * as candidateController from "../candidate/candidateController";

let protectedRouter = express.Router();

protectedRouter.use(usersController.authenticateToken());

protectedRouter.post("/", candidateController.createCandidate);
protectedRouter.get("/", candidateController.getCandidates);
protectedRouter.get("/:candidateId", candidateController.getCandidate);
protectedRouter.put("/:candidateId", candidateController.updateCandidate);
protectedRouter.delete("/:candidateId", candidateController.deleteCandidate);
protectedRouter.get(
  "/:candidateId/listings",
  candidateController.getCandidateListings
);

export default protectedRouter;
