const passport = require('passport');

const auth = (req, res, next) => 
  passport.authenticate('local', (err, user, msg) => {
    if (err) return next(err);
    if (msg) {
      req.flash('info', msg.message);
      return res.redirect('back');
    }
    return req.logIn(user, (err) => {
      if (err) return next(err);
      return req.session.save(() => {
        req.flash('success', 'Вижу вас как на яву!');
        res.redirect('/admin');
      });
    });
  })(req, res, next);

module.exports = auth;
