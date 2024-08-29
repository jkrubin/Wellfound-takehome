import {
  Table,
  Model,
  Column,
  UpdatedAt,
  CreatedAt,
  BeforeCreate,
  BeforeUpdate,
  Unique,
} from "sequelize-typescript";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
@Table({ tableName: "users" })
export class User extends Model {
  @Unique
  @Column
  email!: string;

  @Column
  password!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BeforeCreate
  @BeforeUpdate
  static hashPassword(user: User) {
    if (user.changed("password")) {
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      user.password = bcrypt.hashSync(user.password, salt);
    }
  }

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
