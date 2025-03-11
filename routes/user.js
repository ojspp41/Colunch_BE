const express = require("express");
const mongoose = require("mongoose");
const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const router = express.Router();




router.post("/signup", verifyToken, async (req, res) => {
  try {
    console.log("Decoded User:", req.user); // ✅ user 정보 확인

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "잘못된 유저 ID입니다." });
    }

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const {
      admissionYear,
      age,
      comment,
      contactFrequency,
      contact_id,
      hobby,
      major,
      mbti,
      song,
      username,
      gender, // ✅ 추가된 gender 필드
    } = req.body;

    // ✅ 데이터 유효성 검사
    if (admissionYear === undefined || age === undefined || gender === undefined) {
      return res.status(400).json({ message: "입력값이 누락되었습니다." });
    }

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }

    user.admissionYear = admissionYear;
    user.age = age;
    user.comment = comment;
    user.contactFrequency = contactFrequency;
    user.contact_id = contact_id;
    user.hobby = hobby;
    user.major = major;
    user.mbti = mbti;
    user.song = song;
    user.username = username;
    user.gender = gender; // ✅ gender 저장

    console.log("🔹 저장할 유저 정보:", user); // ✅ 저장 전 데이터 확인

    await user.save();

    res.json({ message: "회원 정보가 성공적으로 업데이트되었습니다.", user });
  } catch (error) {
    console.error("❌ 회원 정보 저장 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
