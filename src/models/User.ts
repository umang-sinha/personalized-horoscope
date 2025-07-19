import { DataTypes, Model, Optional } from "sequelize";
import { ZodiacSigns } from "../utils/zodiac";
import { sequelize } from "../db";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  birthdate: Date;
  zodiacSign: ZodiacSigns;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "zodiacSign"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public birthdate!: Date;
  public zodiacSign!: ZodiacSigns;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    zodiacSign: {
      type: DataTypes.ENUM(...Object.values(ZodiacSigns)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
