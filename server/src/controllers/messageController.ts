import { Response, Request } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/auth";
import { JWTService } from "../middleware/auth";
import { MessageService } from "../service/MessageService";

export const listMessages = async (req: AuthRequest, res: Response) => {
  const userToken = JWTService.extractToken(req);
  const userData = JWTService.decodeToken(userToken);

  const { isSupport, type, threadUserId, receiverID } = req.query;

  try {
    if (
      isSupport === "true" &&
      userData.role === "admin" &&
      type === "threads"
    ) {
      const threads = await MessageService.getSupportThreads();
      return res.json(MessageService.formatThreads(threads));
    }

    if (isSupport === "true") {
      const messages = await MessageService.getSupportMessages(
        userData.id,
        userData.role === "admin",
        threadUserId as string
      );
      return res.json(MessageService.formatMessages(messages));
    }

    const messages = await MessageService.getDirectMessages(
      userData.id,
      receiverID as string
    );
    return res.json(MessageService.formatMessages(messages));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
  const senderId = req.user?.id;
  const userRole = req.user?.role;
  const { receiver_id, content, isSupport } = req.body;

  if (!senderId || !userRole) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const formattedMessage = await MessageService.createMessage(
      senderId,
      userRole,
      {
        receiver_id,
        content,
        isSupport: isSupport === true || isSupport === "true",
      }
    );

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  const userToken = JWTService.extractToken(req);
  const userData = JWTService.decodeToken(userToken);

  if (!userData.id) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [generalCount, supportCount] = await Promise.all([
      // General messages (exclude support)
      prisma.message.count({
        where: {
          receiverId: userData.id,
          read: false,
          NOT: [
            { senderId: "support-system-user-id-001" },
            { receiverId: "support-system-user-id-001" },
          ],
        },
      }),
      // Support messages (from support to user, or for admins all to support)
      prisma.message.count({
        where: {
          receiverId:
            req.user?.role === "admin"
              ? "support-system-user-id-001"
              : userData.id,
          read: false,
          senderId:
            req.user?.role === "admin"
              ? { not: "support-system-user-id-001" }
              : "support-system-user-id-001",
        },
      }),
    ]);

    res.json({ general: generalCount, support: supportCount });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response) => {
  const userToken = JWTService.extractToken(req);
  const userData = JWTService.decodeToken(userToken);

  const { isSupport, threadUserId } = req.body;

  try {
    let where: any = { read: false };

    if (isSupport) {
      if (req.user?.role === "admin") {
        // Admin marks client messages as read in a specific thread
        where = {
          ...where,
          senderId: threadUserId,
          receiverId: "support-system-user-id-001",
        };
      } else {
        // Client/Talent marks admin support replies as read
        where = {
          ...where,
          senderId: "support-system-user-id-001",
          receiverId: userData.id,
        };
      }
    } else {
      // Mark all regular DMs to this user as read
      where = {
        ...where,
        receiverId: userData.id,
        NOT: [
          { senderId: "support-system-user-id-001" },
          { receiverId: "support-system-user-id-001" },
        ],
      };
    }

    await prisma.message.updateMany({
      where,
      data: { read: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
