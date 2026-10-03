const { canAccess } = require("../services/entitlementService");

const entitlementMiddleware = (featureKey) => {
    return async (req, res, next) => {
        try {
            const therapistId = req.therapistId;

            if (!therapistId) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            const allowed = await canAccess(
                therapistId,
                featureKey
            );

            if (!allowed) {
                return res.status(403).json({
                    message: "This feature is not available on your current plan"
                });
            }

            next();

        } catch (error) {
            console.error(
                "Entitlement middleware error:",
                error
            );

            res.status(500).json({
                message: "Could not check feature access"
            });
        }
    };
};

module.exports = entitlementMiddleware;