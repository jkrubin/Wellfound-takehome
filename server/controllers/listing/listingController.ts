import { Response, Request } from "express";
import { Applicant, Listing } from "../../models/listing";
import { AuthRequest } from "../user/userController";
import { Candidate } from "../../models/candidate";

export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    const { title, description } = req.body;
    const newListing = await Listing.create({
      title,
      description,
      userId: user?.id,
    });
    return res.send(newListing.toJSON());
  } catch (err) {
    return res.status(500).send({ message: "could not create new listing" });
  }
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const listings = await Listing.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Candidate,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });
    return res.send(listings);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "could not fetch listings" });
  }
};

export const getListing = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findByPk(listingId, {
      include: [
        {
          model: Candidate,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });
    if (!listing) {
      return res.status(404).send({ message: "could not find listing" });
    }
    return res.send(listing);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "could not fetch listing" });
  }
};
export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).send({ message: "listing not found" });
    }
    const { title, description } = req.body;
    await listing.update({ title, description });
    return res.send(listing);
  } catch (err) {
    return res.status(500).send({ message: "unable to update listing" });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).send({ message: "listing not found" });
    }
    await listing.destroy();
    return res.send({ message: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server was unable to delete listing" });
  }
};

export const assignCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId, candidateId } = req.params;
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).send({ message: "listing not found" });
    }
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).send({ message: "candidate not found" });
    }
    const existingApplicant = await Applicant.findOne({
      where: { listingId, candidateId },
    });
    if (existingApplicant) {
      return res
        .status(409)
        .send({ message: "candidate is already assigned to this listing" });
    }
    const application = await Applicant.create({ listingId, candidateId });
    return res.send(application);
  } catch (err) {
    return res.status(500).send({ message: "unable to assign candidate" });
  }
};

export const unassignCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId, candidateId } = req.params;
    const application = await Applicant.findOne({
      where: { listingId, candidateId },
    });
    if (!application) {
      return res.status(404).send("candidate not found under listing");
    }
    await application.destroy();
    return res.send({ message: "OK" });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};
