const express = require("express");
const mongoose = require("mongoose");
const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const router = express.Router();

/**
 * ✅ QR 인증 완료 처리 API
 * POST /api/qr/verify
 */
router.get("/verify", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "잘못된 유저 ID입니다." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    user.isQrVerified = true;
    await user.save();

    res.json({ message: "QR 인증이 완료되었습니다.", isQrVerified: true });
  } catch (error) {
    console.error("❌ QR 인증 처리 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * ✅ QR 인증 여부 조회 API
 * GET /api/qr/status
 */
router.get("/status", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "잘못된 유저 ID입니다." });
    }

    const user = await User.findById(userId).select("isQrVerified");

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    res.json({ isQrVerified: user.isQrVerified });
  } catch (error) {
    console.error("❌ QR 인증 여부 조회 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
