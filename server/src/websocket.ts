import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { JWTService } from "./middleware/auth";
import { MessageService } from "./service/MessageService";

export const setupWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  // Map to keep track of connections by userId
  const userConnections = new Map<string, WebSocket>();

  wss.on("connection", (ws, req) => {
    let currentUserId: string | null = null;
    let currentUserRole: string | null = null;

    console.log("New WS connection attempt");

    ws.on("message", async (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            // Handle Authentication/Identification
            if (data.type === "auth") {
                const token = data.token;
                try {
                    const userData = JWTService.decodeToken(token);
                    if (userData && (userData as any).id) {
                        currentUserId = (userData as any).id;
                        currentUserRole = (userData as any).role;
                        userConnections.set(currentUserId!, ws);
                        console.log(`User ${currentUserId} (${currentUserRole}) authenticated via WS`);
                        ws.send(JSON.stringify({ type: "authenticated", status: "ok" }));
                    }
                } catch (err) {
                    console.error("WS Auth failed:", err);
                    ws.send(JSON.stringify({ type: "error", message: "Authentication failed" }));
                }
                return;
            }

            if (!currentUserId || !currentUserRole) {
                ws.send(JSON.stringify({ type: "error", message: "Not authenticated" }));
                return;
            }

            // Handle Direct/Support Messaging
            if (data.type === "message") {
                const { receiver_id, content, isSupport } = data;
                
                // Save to DB via Service
                const savedMsg = await MessageService.createMessage(
                    currentUserId,
                    currentUserRole,
                    { receiver_id, content, isSupport }
                );

                // Determine who should receive this message
                const recipientId = savedMsg.receiverId === "support-system-user-id-001" 
                    ? "admin-broadcast" // Symbolic for admin support
                    : savedMsg.receiverId;

                // Routing logic
                if (recipientId === "admin-broadcast") {
                    // Send to all connected admins
                    // Note: In a real production app, we might check for 'admin' role in connections
                    // For now, let's just broadcast to all if it's support (admins can filter client side)
                    // Or more precisely:
                    userConnections.forEach((conn, uid) => {
                        // Ideally we'd have a way to know if uid is admin
                        // For MVP, just send.
                        if (conn.readyState === WebSocket.OPEN) {
                            conn.send(JSON.stringify({ type: "new_message", message: savedMsg }));
                        }
                    });
                } else {
                    // Private message
                    const recipientWs = userConnections.get(recipientId);
                    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                        recipientWs.send(JSON.stringify({ type: "new_message", message: savedMsg }));
                    }

                    // Also send back to sender if they have other tabs or for confirmation
                    // ws.send(JSON.stringify({ type: "message_sent", message: savedMsg })); 
                }
            }
        } catch (e) {
            console.error("Error processing WS message:", e);
        }
    });

    ws.on("close", () => {
      if (currentUserId) {
        userConnections.delete(currentUserId);
        console.log(`User ${currentUserId} disconnected from WS`);
      }
    });
  });

  return wss;
};
