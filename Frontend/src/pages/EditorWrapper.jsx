// src/pages/EditorWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import {
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { CollaborativeEditor } from "./CollaborativeEditor";

const EditorWrapper = () => {
  const { projectID } = useParams();

  if (!projectID) return <div>Invalid project ID</div>;

  return (
    <RoomProvider
      id={projectID}
      initialPresence={{}}
      userInfo={{
        name: localStorage.getItem("username") || "Guest",
      }}
    >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <CollaborativeEditor />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default EditorWrapper;
