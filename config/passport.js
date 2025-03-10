const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET, // 선택 (보안용)
      callbackURL: process.env.KAKAO_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("✅ 카카오 ID:", profile.id);

      try {
        let user = await User.findOne({ kakaoId: profile.id });

        let isFirstLogin = false;

        if (!user) {
          // ✅ 첫 로그인 유저 (DB에 존재하지 않음)
          isFirstLogin = true;
          user = new User({
            kakaoId: profile.id,
            isFirstLogin: true, // ✅ 첫 로그인 여부 저장
          });

          await user.save();
          console.log("✅ 신규 유저 저장 (첫 로그인 유저입니다):", user);
        } else {
          // ✅ 기존 로그인 유저
          isFirstLogin = user.isFirstLogin; // 기존 유저의 isFirstLogin 값을 사용
          console.log("✅ 기존 유저 로그인:", user);
        }

        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return done(null, { id: user._id, token, isFirstLogin }); // ✅ 첫 로그인 여부도 반환
      } catch (error) {
        console.error("❌ 카카오 로그인 에러:", error);
        return done(error, null);
      }
    }
  )
);

// ✅ 세션에 저장할 최소한의 데이터만 저장 (id만 저장)
passport.serializeUser((user, done) => {
  console.log("🔹 Serialize user:", user); // 디버깅 로그 추가
  done(null, { id: user.id, isFirstLogin: user.isFirstLogin }); // ✅ 첫 로그인 여부도 함께 저장
});

// ✅ 세션에서 id를 기반으로 사용자 복원
passport.deserializeUser(async (data, done) => {
  console.log("🔹 Deserialize user ID:", data.id); // 디버깅 로그 추가
  try {
    const user = await User.findById(data.id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
