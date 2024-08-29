import {
  Model,
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  ForeignKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "./user";
import { Candidate } from "./candidate";

@Table({ tableName: "listings" })
export class Listing extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @Column
  title!: string;

  @Column
  description!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BelongsTo(() => User)
  owner!: User;

  @BelongsToMany(() => Candidate, () => Applicant)
  applicants!: Applicant[];
}

@Table
export class Applicant extends Model {
  @ForeignKey(() => Listing)
  @AllowNull(false)
  @Column
  listingId!: number;

  @ForeignKey(() => Candidate)
  @AllowNull(false)
  @Column
  candidateId!: number;
}
