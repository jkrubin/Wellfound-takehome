import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { Applicant, Listing } from "./listing";

@Table({ tableName: "candidates" })
export class Candidate extends Model {
  @Column
  name!: string;

  @Column
  email!: string;

  @BelongsToMany(() => Listing, () => Applicant)
  applied!: Listing[];
}
