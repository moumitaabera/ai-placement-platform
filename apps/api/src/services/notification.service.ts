import prisma from "../lib/prisma";

export const getNotifications = async (
  userId: string
) => {
  console.log("GET NOTIFICATIONS USER ID:", userId);

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("FOUND NOTIFICATIONS:", notifications);

  return notifications;
};

export const markNotificationAsRead = async (
  userId: string,
  notificationId: string
) => {
  const notification =
    await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};