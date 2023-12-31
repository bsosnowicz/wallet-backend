const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../schemas/user");

const secret = "siema";

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async function (payload, done) {
    try {
      const user = await User.findOne({ _id: payload.id });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      return done(null, user);
    } catch (e) {
      console.log(e.message);
    }
  })
);
