const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User 모델
const { verifyToken } = require("../config/jwt"); // ✅ JWT 검증 미들웨어 사용

// ✅ 매칭 요청 엔드포인트
router.post("/", verifyToken, async (req, res) => {
  try {
    // 요청한 사용자 정보 가져오기
    const userId = req.user.id; // verifyToken에서 설정된 req.user.id

    // 현재 사용자 정보 불러오기
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 이미 매칭된 사용자 제외
    const matchedUserIds = user.matchedUsers.map(id => id.toString());

    // 매칭 대상 찾기
    let match = await User.findOne({
      _id: { $ne: userId, $nin: matchedUserIds }, // 본인과 이미 매칭된 사용자 제외
      admissionYear: user.admissionYear, // 같은 학번 우선
    });

    if (!match) {
      // 학번이 같은 사람이 없으면 같은 나이 찾기
      match = await User.findOne({
        _id: { $ne: userId, $nin: matchedUserIds },
        age: user.age,
      });
    }

    if (!match) {
      // 같은 학번과 나이가 없으면 랜덤 선택
      match = await User.findOne({
        _id: { $ne: userId, $nin: matchedUserIds },
      }).skip(Math.floor(Math.random() * await User.countDocuments()));
    }

    // 매칭된 사용자 없으면 응답
    if (!match) {
      return res.status(404).json({ message: "No matching user found" });
    }

    // 매칭된 사용자의 ID를 matchedUsers에 추가
    user.matchedUsers.push(match._id);
    await user.save();

    // 응답
    res.json({
      message: "Matching successful",
      matchedUserId: match._id,
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
      const user = await User.findById(userId).populate("matchedUsers", "_id kakaoId admissionYear age major mbti comment");
      
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
