const jwt = require("jsonwebtoken");

// ✅ JWT 생성 함수
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ JWT 검증 미들웨어
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }
  
    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"에서 TOKEN 부분만 추출
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  };

module.exports = { generateToken, verifyToken };
