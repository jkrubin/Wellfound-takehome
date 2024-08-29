import { Response, Request } from "express";
import { Candidate } from "../../models/candidate";
import { Listing } from "../../models/listing";
import { AuthRequest } from "../user/userController";

export const createCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const newCandidate = await Candidate.create({ name, email });
    return res.send(newCandidate);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Could not create new candidate" });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await Candidate.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Listing,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });
    return res.send(candidates);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Could not fetch candidates" });
  }
};

export const getCandidate = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;
    const candidate = await Candidate.findByPk(candidateId, {
      include: [
        {
          model: Listing,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });
    if (!candidate) {
      return res.status(404).send({ message: "Candidate not found" });
    }
    return res.send(candidate);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Could not fetch candidate" });
  }
};

export const updateCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId } = req.params;
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).send({ message: "Candidate not found" });
    }
    const { name, email } = req.body;
    await candidate.update({ name, email });
    return res.send(candidate);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Could not update candidate" });
  }
};

export const deleteCandidate = async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId } = req.params;
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).send({ message: "Candidate not found" });
    }
    await candidate.destroy();
    return res.send({ message: "Candidate deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Could not delete candidate" });
  }
};

export const getCandidateListings = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;
    const candidate = await Candidate.findByPk(candidateId, {
      include: [{ model: Listing, through: { attributes: [] } }],
    });
    if (!candidate) {
      return res.status(404).send({ message: "Candidate not found" });
    }
    return res.send(candidate.applied);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Could not fetch candidate listings" });
  }
};
