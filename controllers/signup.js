
const User = require("../models/user");
module.exports=async (req, res) => {
    try {
      const { name, username, user_type, password } = req.body;
      joining_date = Date.now();
      const user = new User({ name, user_type, joining_date, username });
      const newuser = await User.register(user, password);
      req.login(newuser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome new user!");
        res.redirect("/dashboard");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("signup");
    }
  }