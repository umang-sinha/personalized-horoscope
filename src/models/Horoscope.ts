import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import { ZodiacSigns } from "../utils/zodiac";

interface HoroscopeAttributes {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  zodiacSign: ZodiacSigns;
  text: string;
}

interface HoroscopeCreationAttributes
  extends Optional<HoroscopeAttributes, "id"> {}

export class Horoscope
  extends Model<HoroscopeAttributes, HoroscopeCreationAttributes>
  implements HoroscopeAttributes
{
  public id!: string;
  public userId!: string;
  public date!: string;
  public zodiacSign!: ZodiacSigns;
  public text!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Horoscope.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    zodiacSign: {
      type: DataTypes.ENUM(...Object.values(ZodiacSigns)),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "horoscopes",
    indexes: [
      {
        unique: true,
        fields: ["userId", "date"],
        name: "unique_user_per_day",
      },
      {
        fields: ["userId", "date"],
        name: "idx_user_date",
      },
    ],
  }
);
