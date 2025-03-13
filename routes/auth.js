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
    const FRONTEND_URL = process.env.FRONTEND_URL || "https://colunch-phi.vercel.app";

    // ✅ JWT 토큰을 HTTP-Only 쿠키로 설정
    res.cookie("accessToken", token, {
      httpOnly: false,  // 클라이언트에서 JS로 접근 불가능 (보안 강화)
      secure: false,  // 로컬 개발 환경에서는 false, 배포 환경에서는 true (HTTPS 필요)
      sameSite: "lax", // CSRF 방지 설정
      maxAge: 60 * 60 * 1000, // 1시간 유지
    });
    // ✅ 프론트엔드로 리다이렉트
    res.redirect(`${FRONTEND_URL}?isFirstLogin=${isFirstLogin}`);
  }
);
// ✅ 유저 정보 반환 (로그인 상태 확인)


// ✅ 로그아웃
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
