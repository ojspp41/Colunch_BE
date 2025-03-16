const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// ✅ 카카오 로그인 요청
router.get("/kakao", passport.authenticate("kakao"));


router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login-fail" }),
  (req, res) => {
    const { token, isFirstLogin } = req.user;

    // ✅ 프론트엔드 URL (환경변수 사용 추천)
    const FRONTEND_URL = process.env.FRONTEND_URL || "https://colunch-nine.vercel.app";

    // ✅ 프론트엔드로 accessToken과 isFirstLogin을 URL로 전달
    res.redirect(`${FRONTEND_URL}?accessToken=${token}&isFirstLogin=${isFirstLogin}`);
  }
);

// ✅ 유저 정보 반환 (로그인 상태 확인)


// ✅ 로그아웃
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
