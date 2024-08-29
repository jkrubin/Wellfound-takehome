import { Listing } from "../Listing/types";

export interface Candidate {
  id: number;
  name: string;
  email: string;
  applied: Listing[];
}
