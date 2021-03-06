var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var userModel = require('../models/user.model');

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 't_password',
      },
      (username, t_password, done) => {
        userModel
          .singleByUserName(username)
          .then((rows) => {
            if (rows.length === 0) {
              return done(null, false, { message: 'Invalid username' });
            }
            var user = rows[0];
            var ret = bcrypt.compareSync(t_password, user.password);
            if (ret) {
              return done(null, user);
            }

            return done(null, false, { message: 'Invalid password' });
          })
          .catch((err) => {
            return done(err, false);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
