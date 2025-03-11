const express = require("express");
const mongoose = require("mongoose");
const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const router = express.Router();

// 🔹 전체 회원 수를 반환하는 새로운 엔드포인트
router.get("/", async (req, res) => {
  try {
    // 전체 회원 수 조회
    const data = await User.countDocuments();

    res.json({ data });
  } catch (error) {
    console.error("❌ 전체 회원 수 조회 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
