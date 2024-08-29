import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev";

export interface AuthRequest extends Request {
  user?: User;
}

const getUserInfo = (user: User) => {
  const { id, email, password } = user.toJSON();
  return { id, email, password };
};
const signUser = (user: User) => {
  const userJSON = getUserInfo(user);
  console.log("user info", userJSON);
  return jwt.sign(getUserInfo(user), JWT_SECRET, { expiresIn: "2 days" });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "an account already exists with this email" });
    }
    let newUser = await User.create({ email, password });
    const jwt = signUser(newUser);
    return res.send({ user: newUser.toJSON(), jwt });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(403)
        .send({ message: "No Account found with this email" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(403).send({ message: "Incorrect password" });
    }
    const jwt = signUser(user);
    return res.send({ user: user.toJSON(), jwt });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const authenticateToken = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("here");
    const token = req.headers["x-access-token"] as any as string;

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "You are not logged in" });
    }
    jwt.verify(token, JWT_SECRET, async (err, decodedUser: any) => {
      console.log("decoded user:", decodedUser);
      if (err) {
        return res
          .status(440)
          .send({ message: "Your login session has expired" });
      } else {
        const user = await User.findOne({ where: { id: decodedUser?.id } });
        if (!user) {
          return res.status(500).send({ message: "No matching user found" });
        }
        req.user = user;
        console.log("user found and set");
        next();
      }
    });
  };
};
