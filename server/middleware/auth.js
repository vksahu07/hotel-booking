export const requireAuth = async (req, res, next) => {
  try {
    const userId = req.auth?.userId || req.headers["user-id"];
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User identification missing" });
    }
    
    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
