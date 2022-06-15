const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstName: { type: String, required: [true, "Cannot be Empty"] },
  lastName: { type: String, required: [true, "Cannot be Empty"] },
  email: { type: String, required: [true, "Cannot be Empty"], unique: true },
  password: { type: String, required: [true, "Cannot be Empty"] },
});

//replace plain text password with hashed password befor saving the document
// pre-middleware

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

userSchema.methods.comparePassword = function (loginPassword) {
  return bcrypt.compare(loginPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
