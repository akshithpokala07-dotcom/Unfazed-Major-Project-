const notifications = [];

const createNotification = ({
    therapistId,
    clientId = null,
    type,
    message
}) => {
    const notification = {
        id: Date.now().toString(),
        therapistId,
        clientId,
        type,
        message,
        createdAt: new Date()
    };

    notifications.push(notification);

    console.log("Notification created:", notification);

    return notification;
};

const getNotifications = (therapistId) => {
    return notifications.filter(
        (notification) =>
            notification.therapistId.toString() ===
            therapistId.toString()
    );
};

module.exports = {
    createNotification,
    getNotifications
};