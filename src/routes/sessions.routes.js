import { Router } from "express";
import passport from "passport";
import { current, login, logout, resetPwd, newpass} from "../controllers/session.controller.js";

const sessionsRouter = new Router();

sessionsRouter.post(
  "/signup",
  passport.authenticate("register", {
    passReqToCallback: true,
    session: false,
    failureRedirect: "/errorSignup",
    successRedirect: "/",
  })
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    passReqToCallback: true,
    session: false,
    failureRedirect: "/errorLogin"
  }),
  login
);

sessionsRouter.get("/logout", passport.authenticate('jwt',{session:false}), logout)

// Passport con github
sessionsRouter.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get("/github/callback", 
  passport.authenticate("github", 
    {
      passReqToCallback:true,
      session:false,
      failureRedirect: "/"
    }),
    login
);

sessionsRouter.get("/current", passport.authenticate('jwt',{session:false}), current);

sessionsRouter.post("/resetpwd", resetPwd);
sessionsRouter.post("/newpass", newpass);


export default sessionsRouter;
