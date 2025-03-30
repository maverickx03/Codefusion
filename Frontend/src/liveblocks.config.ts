import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Passing custom headers and body to your endpoint
const client = createClient({
  authEndpoint: async (room) => {
    const headers = {
      // Custom headers
      // ...

      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      // Custom body
      // ...

      room,
    });

    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers,
      body,
    });

    return await response.json();
  },
});

// Create a room context for Liveblocks
export const {
  RoomProvider,
  useRoom,  // ✅ Now correctly exported
  useOthers,
} = createRoomContext(client);
