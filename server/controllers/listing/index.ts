import express from "express";
import * as usersController from "../user/userController";
import * as listingController from "./listingController";

let protectedRouter = express.Router();
let router = express.Router();

//Protected Routes
protectedRouter.use(usersController.authenticateToken());
protectedRouter.post("/", listingController.createListing);
protectedRouter.put("/:listingId", listingController.updateListing);
protectedRouter.post(
  "/:listingId/assign/:candidateId",
  listingController.assignCandidate
);
protectedRouter.post(
  "/:listingId/unassign/:candidateId",
  listingController.unassignCandidate
);
protectedRouter.delete("/:listingId", listingController.deleteListing);
//Public Routes
router.get("/", listingController.getListings);
router.get("/:listingId", listingController.getListing);
router.use(protectedRouter);

export default router;
