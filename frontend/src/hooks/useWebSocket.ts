"use client";
import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAssignmentStore } from "@/store/useAssignmentStore";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

export function useWebSocket(assignmentId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const updateAssignment = useAssignmentStore((s) => s.updateAssignment);
  const fetchAssignment = useAssignmentStore((s) => s.fetchAssignment);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    if (assignmentId) {
      socket.emit("join", assignmentId);
    }

    socket.on("job:progress", (data: { assignmentId: string; progress: number; message: string }) => {
      updateAssignment(data.assignmentId, { status: "processing" } as any);
    });

    socket.on("job:completed", (data: { assignmentId: string }) => {
      if (assignmentId && data.assignmentId === assignmentId) {
        fetchAssignment(assignmentId);
      }
    });

    socket.on("job:failed", (data: { assignmentId: string; error: string }) => {
      updateAssignment(data.assignmentId, { status: "failed" } as any);
    });

    return () => { socket.disconnect(); };
  }, [assignmentId, updateAssignment, fetchAssignment]);

  return socketRef;
}
