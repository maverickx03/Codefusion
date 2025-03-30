"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "../liveblocks.config";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import EditorNavbar from "../components/EditorNavbar";
import { api_base_url } from "../helper";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUpdateMyPresence } from "@liveblocks/react";


export function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const room = useRoom();
  const yProvider = getYjsProviderForRoom(room);
  const [tab, setTab] = useState("C");
  const [isCodeLoaded, setIsCodeLoaded] = useState(false);
  const { projectID } = useParams(); // Project ID
  const location = useLocation();
  const initialProjectTitle =
    location.state?.projectTitle || "Untitled Project";
  const [projectName, setProjectName] = useState(initialProjectTitle);

  const navigate = useNavigate();

  useEffect(() => {
    if (projectName) {
      document.title = projectName + " - Codefusion"; // Or whatever suffix you want
    }
  }, [projectName]);

  const userId = localStorage.getItem("userId");
  const [username, setUsername] = useState("");

  const updateMyPresence = useUpdateMyPresence();

useEffect(() => {
  if (!userId) return;

  fetch(`${api_base_url}/getUserDetails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const username = data.user.username;
        setUsername(username);
        updateMyPresence({ name: username }); // 👈 This is what fixes it!
      } else {
        console.log("Failed to fetch user data");
      }
    });
}, []);


  // Load code from DB into yText on tab change
  useEffect(() => {
    if (!projectID) return;
    const fetchCode = async () => {
      try {
        if (!userId) return;

        const res = await fetch(api_base_url + "/getProject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, projId: projectID }),
        });

        const data = await res.json();
        const project = data.project;
        if (!project) return;
        setProjectName(project.title || initialProjectTitle);

        const codeMap = {
          C: project?.cCode || "",
          Cpp: project?.cppCode || "",
          js: project?.jsCode || "",
          python: project?.python || "",
        };



        const initialCode = codeMap[tab] || "";
        const yText = yProvider.getYDoc().getText("monaco");

        yText.delete(0, yText.length);
        yText.insert(0, initialCode);

        setIsCodeLoaded(true);
      } catch (err) {
        console.error("Error loading code from DB:", err);
      }
    };

    fetchCode();
  }, [tab, projectID]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to access the editor.");
      navigate("/login"); // or your login route
    }
  }, []);

  // Bind Monaco + Yjs after code is loaded
  useEffect(() => {
    if (!editorRef || !isCodeLoaded) return;

    const yDoc = yProvider.getYDoc();
    const yText = yDoc.getText("monaco");
    const yInput = yDoc.getText("input");
    const yOutput = yDoc.getText("output");

    const updateInput = () => setInput(yInput.toString());
    const updateOutput = () => setOutput(yOutput.toString());

    const binding = new MonacoBinding(
      yText,
      editorRef.getModel() as editor.ITextModel,
      new Set([editorRef]),
      yProvider.awareness as unknown as Awareness
    );

    yInput.observe(updateInput);
    yOutput.observe(updateOutput);

    return () => {
      yInput.unobserve(updateInput);
      yOutput.unobserve(updateOutput);
      binding.destroy();
    };
  }, [editorRef, isCodeLoaded]);

  const handleOnMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      setEditorRef(editorInstance);
    },
    []
  );

  const executeCode = async () => {
    if (!editorRef) return;
    const code = yProvider.getYDoc().getText("monaco").toString();

    const requestBody = {
      language: tab,
      code: code,
      input: input,
    };

    try {
      const response = await fetch(api_base_url + "/runCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const outputText =
        data.output || `Error: ${data.error || "Unknown error"}`;
      setOutput(outputText);

      const yOutput = yProvider.getYDoc().getText("output");
      yOutput.delete(0, yOutput.length);
      yOutput.insert(0, outputText);
    } catch (error) {
      console.error("Execution failed:", error);
      setOutput("Execution Failed");
    }
  };

  const saveCodeToDB = async () => {
    const code = yProvider.getYDoc().getText("monaco").toString();
    const userId = localStorage.getItem("userId");

    if (!userId || !projectID || !code) return;

    const payload: Record<string, any> = {
      userId,
      projId: projectID,
      cCode: undefined,
      cppCode: undefined,
      jsCode: undefined,
      python: undefined,
    };

    if (tab === "C") payload.cCode = code;
    else if (tab === "Cpp") payload.cppCode = code;
    else if (tab === "js") payload.jsCode = code;
    else if (tab === "python") payload.python = code;

    try {
      const response = await fetch(api_base_url + "/updateProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      alert("Code saved successfully!");
    } catch (err) {
      console.error("Error saving code:", err);
      alert("Failed to save code.");
    }
  };

  return (
    <>
      <EditorNavbar projectName={projectName} />

      <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px] ">
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              setIsCodeLoaded(false); // Reset when changing tabs
              setTab(e.target.value);
            }}
            className="tab-selector p-[6px] px-[10px] text-[15px] cursor-pointer bg-[#1E1E1E] text-white"
            value={tab}
          >
            <option value="C">C</option>
            <option value="Cpp">Cpp</option>
            <option value="js">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <button
          onClick={saveCodeToDB}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save Code
        </button>
      </div>

      <div className="flex flex-col h-screen">
        <Editor
          onMount={handleOnMount}
          height="50vh"
          width="100%"
          theme="vs-light"
          language={tab.toLowerCase()}
          options={{ tabSize: 2 }}
        />

        <div className="flex flex-col justify-content-right p-4">
          <textarea
            value={input}
            onChange={(e) => {
              const newInput = e.target.value;
              setInput(newInput);
              const yInput = yProvider.getYDoc().getText("input");
              yInput.delete(0, yInput.length);
              yInput.insert(0, newInput);
            }}
            className="border p-2 mb-2 text-black"
            placeholder="Enter input..."
          />
          <button
            onClick={executeCode}
            className="bg-blue-500 text-white p-2 mb-2"
          >
            Run Code
          </button>
          <textarea
            value={output}
            readOnly
            className="border p-2 text-black"
            placeholder="Output will be displayed here..."
          />
        </div>
      </div>
    </>
  );
}
