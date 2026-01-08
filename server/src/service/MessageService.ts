import { prisma } from "../prisma";

export class MessageService {
  private static SUPPORT_ID = "support-system-user-id-001";

  static async sendMessage(
    senderID: string,
    ReceiverID: string,
    content: string
  ) {
    return await prisma.message.create({
      data: {
        senderId: senderID,
        receiverId: ReceiverID,
        content: content,
      },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
      },
    });
  }

  static async getSupportThreads() {
    return await prisma.message.findMany({
      where: { receiverId: this.SUPPORT_ID },
      distinct: ["senderId"],
      include: { sender: true },
      orderBy: { timestamp: "desc" },
    });
  }

  static async getSupportMessages(
    userId: string,
    isAdmin: boolean,
    threadUserId?: string
  ) {
    const targetId = isAdmin && threadUserId ? threadUserId : userId;
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: targetId, receiverId: this.SUPPORT_ID },
          { senderId: this.SUPPORT_ID, receiverId: targetId },
        ],
      },
      include: { sender: true },
      orderBy: { timestamp: "asc" },
    });
  }

  static async getDirectMessages(userId: string, receiverId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      include: { sender: true },
      orderBy: { timestamp: "asc" },
    });
  }

  static formatMessages(messages: any[]) {
    if (!messages) return [];
    return messages.map((m) => ({
      ...m,
      sender_name:
        m.senderId === this.SUPPORT_ID
          ? "Admin Support"
          : m.sender?.full_name || "System",
      sender_avatar:
        m.senderId === this.SUPPORT_ID
          ? "https://ui-avatars.com/api/?name=Admin+Support&background=00c853&color=fff"
          : m.sender?.avatar_url,
    }));
  }

  static formatThreads = (threads: any[]) => {
    return threads.map((t) => ({
      userId: t.senderId,
      userName: t.sender?.full_name || "Unknown User",
      userAvatar: t.sender?.avatar_url || null,
      lastMessage: t.content,
      time: t.timestamp,
    }));
  };

  static async createMessage(
    senderId: string,
    userRole: string,
    payload: { receiver_id: string; content: string; isSupport?: boolean }
  ) {
    const { receiver_id, content, isSupport } = payload;

    const actualSenderId =
      isSupport && userRole === "admin" ? this.SUPPORT_ID : senderId;
    const actualReceiverId =
      isSupport && userRole !== "admin" ? this.SUPPORT_ID : receiver_id;

    const message = await prisma.message.create({
      data: {
        senderId: actualSenderId,
        receiverId: actualReceiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
      },
    });

    // Notify Admins for new support tickets
    if (isSupport && userRole !== "admin") {
      const admins = await prisma.user.findMany({ where: { role: "admin" } });
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: "support_ticket",
          content: `New support ticket from ${
            message.sender.full_name
          }: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
          data: JSON.stringify({ senderId: senderId, messageId: message.id }),
        })),
      });
    }

    return {
      ...message,
      sender_name:
        actualSenderId === this.SUPPORT_ID
          ? "Admin Support"
          : message.sender.full_name,
      sender_avatar:
        actualSenderId === this.SUPPORT_ID
          ? "https://ui-avatars.com/api/?name=Admin+Support&background=00c853&color=fff"
          : message.sender.avatar_url,
    };
  }
}
