const express = require("express");
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: "sk_dev_yZuzbboFw6wftysdes9UGfN1dAvykJ2KWmrIQ1ZDzMsB8Fr1I8OacH0LglBzVB24",
});

const app = express();
app.use(express.json());

app.post("/api/liveblocks-auth", (req, res) => {
  // Get the current user from your database
  const user = __getUserFromDB__(req);

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo: user.metadata },  // Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  session.allow(`${user.organization}:*`, session.READ_ACCESS);
  session.allow(`${user.organization}:${user.group}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return res.status(status).end(body);
});