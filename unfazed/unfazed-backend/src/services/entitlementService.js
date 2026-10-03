const SubscriptionTierConfig = require("../models/SubscriptionTierConfig");

const canAccess = async (therapistId, featureKey) => {
    let config = await SubscriptionTierConfig.findOne({
        therapist: therapistId
    });

    // Create a default Free-tier configuration if one doesn't exist
    if (!config) {
        config = await SubscriptionTierConfig.create({
            therapist: therapistId,
            tier: "free",
            features: {
                notes: true,
                payments: true,
                analytics: false,
                chat: false,
                advancedAnalytics: false
            }
        });
    }

    return config.features?.[featureKey] === true;
};

module.exports = {
    canAccess
};