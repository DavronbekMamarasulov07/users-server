const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Ruxsat yo'q" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Sizda bu amalni bajarishingiz uchun ruxsat yo'q" });
    }
    next();
  };
};

export default roleMiddleware;
