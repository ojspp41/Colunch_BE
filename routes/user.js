const express = require("express");
const mongoose = require("mongoose");
const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const router = express.Router();


router.get("/match", verifyToken, async (req, res) => {
  try {
    console.log("Decoded User:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 🔹 사용자가 이미 매칭을 시도한 적이 있는지 확인
    if (!user.isFirstMatch) {
      return res.status(403).json({ message: "매칭은 한 번만 가능합니다." });
    }

    // 🔹 사용자의 학번 (admissionYear)
    const { admissionYear } = user;

    // 🔹 이미 매칭된 유저 목록
    const matchedUsers = user.matchedUsers || [];

    // 🔹 같은 학번의 유저 중, 자기 자신과 이미 매칭된 유저를 제외하고 찾음
    const candidates = await User.find({
      admissionYear,
      _id: { $ne: userId }, // 자기 자신 제외
      matchedUsers: { $nin: [userId] }, // 이미 매칭된 사람 제외
    });

    if (candidates.length === 0) {
      return res.status(404).json({ message: "매칭 가능한 사용자가 없습니다." });
    }

    // 🔹 랜덤으로 한 명 선택
    const matchedUser = candidates[Math.floor(Math.random() * candidates.length)];

    // 🔹 매칭된 사람을 서로의 matchedUsers 목록에 추가
    user.matchedUsers = [...(user.matchedUsers || []), matchedUser._id];
    matchedUser.matchedUsers = [...(matchedUser.matchedUsers || []), userId];

    // 🔹 이제 더 이상 직접 매칭을 할 수 없도록 설정
    user.isFirstMatch = false;

    // 🔹 변경 사항을 저장
    await user.save();
    await matchedUser.save();

    // 🔹 매칭된 사용자 정보 응답 (보안상 필요한 정보만 전달)
    res.json({
      message: "매칭이 완료되었습니다. 한 번만 매칭할 수 있습니다!",
      matchedUser: {
        contact_id: matchedUser.contact_id,
        username: matchedUser.username,
        age: matchedUser.age,
        hobby: matchedUser.hobby,
        major: matchedUser.major,
        mbti: matchedUser.mbti,
        song: matchedUser.song,
        comment: matchedUser.comment,
      },
    });
  } catch (error) {
    console.error("❌ 매칭 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});


router.get("/match", verifyToken, async (req, res) => {
  try {
    console.log("Decoded User:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    // 🔹 사용자의 학번 (admissionYear)
    const { admissionYear } = user;

    // 🔹 이미 매칭된 유저 목록
    const matchedUsers = user.matchedUsers || [];

    // 🔹 같은 학번의 유저 중, 자기 자신과 이미 매칭된 유저를 제외하고 찾음
    const candidates = await User.find({
      admissionYear,
      _id: { $ne: userId }, // 자기 자신 제외
      matchedUsers: { $nin: [userId] }, // 이미 매칭된 사람 제외
    });

    if (candidates.length === 0) {
      return res.status(404).json({ message: "매칭 가능한 사용자가 없습니다." });
    }

    // 🔹 랜덤으로 한 명 선택
    const matchedUser = candidates[Math.floor(Math.random() * candidates.length)];

    // 🔹 매칭된 사람을 서로의 matchedUsers 목록에 추가
    user.matchedUsers = [...(user.matchedUsers || []), matchedUser._id];
    matchedUser.matchedUsers = [...(matchedUser.matchedUsers || []), userId];

    // 🔹 변경 사항을 저장
    await user.save();
    await matchedUser.save();

    // 🔹 매칭된 사용자 정보 응답 (보안상 필요한 정보만 전달)
    res.json({
      message: "매칭이 완료되었습니다.",
      matchedUser: {
        _id: matchedUser._id,
        contact_id: matchedUser.contact_id,
        username: matchedUser.username,
        age: matchedUser.age,
        hobby: matchedUser.hobby,
        major: matchedUser.major,
        mbti: matchedUser.mbti,
        song: matchedUser.song,
        comment: matchedUser.comment,
      },
    });
  } catch (error) {
    console.error("❌ 매칭 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

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
