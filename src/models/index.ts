import { User } from "./User";
import { Horoscope } from "./Horoscope";

User.hasMany(Horoscope, {
  foreignKey: "userId",
  as: "horoscopes",
  onDelete: "CASCADE",
});

Horoscope.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
