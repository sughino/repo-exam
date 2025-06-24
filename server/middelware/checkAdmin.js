export const checkAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.admin) { 
            return res.status(403).json({
                status: "error",
                data: {},
                message: "Access denied",
                code: 403
            });
        }

        next();
    } catch (error) {
        console.error("Error in middleware to check admin:", error);
        res.status(500).json({ status: "error", message: "Server error", code: 500 });
    }
};