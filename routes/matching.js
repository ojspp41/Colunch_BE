const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User 모델
const { verifyToken } = require("../config/jwt"); // ✅ JWT 검증 미들웨어 사용

// ✅ 매칭 요청 엔드포인트
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // verifyToken 미들웨어에서 설정된 사용자 ID

    // 현재 사용자 정보 가져오기
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 이미 매칭된 사용자 제외
    const matchedUserIds = user.matchedUsers.map(id => id.toString());

    // 필터링 조건
    const filterConditions = [
      { _id: { $ne: userId, $nin: matchedUserIds }, admissionYear: user.admissionYear },
      { _id: { $ne: userId, $nin: matchedUserIds }, age: user.age },
      { _id: { $ne: userId, $nin: matchedUserIds } }
    ];

    let match = null;
    
    for (const condition of filterConditions) {
      match = await User.findOne(condition);
      if (match) break; // 매칭이 되면 반복 종료
    }

    // 매칭된 사용자 없으면 응답
    if (!match) {
      return res.status(404).json({ message: "No matching user found" });
    }

    // 매칭된 사용자의 ID를 matchedUsers에 추가
    user.matchedUsers.push(match._id);

    // ✅ 첫 매칭 여부(isFirstMatch) 업데이트
    if (user.isFirstMatch) {
      user.isFirstMatch = false;
    }

    
    await user.save();

    // 응답
    res.json({
      message: "Matching successful",
      matchedUser: {
        _id: match._id,
        admissionYear: match.admissionYear,
        age: match.age,
        comment: match.comment,
        contactFrequency: match.contactFrequency,
        contact_id: match.contact_id,
        hobby: match.hobby,
        major: match.major,
        mbti: match.mbti,
        song: match.song,
      },
    });
  } catch (error) {
    console.error("Matching Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 매칭된 유저 정보 반환 API
router.get("/matched-users", verifyToken, async (req, res) => {
  try {
    // 현재 요청한 사용자의 ID 가져오기
    const userId = req.user.id;

    // 유저 정보 가져오기 (matchedUsers ID 포함)
    const user = await User.findById(userId).populate(
      "matchedUsers",
      " admissionYear age major mbti comment contactFrequency contact_id hobby song gender "
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 매칭된 유저들의 정보 반환
    res.json({ matchedUsers: user.matchedUsers });
  } catch (error) {
    console.error("Error fetching matched users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
