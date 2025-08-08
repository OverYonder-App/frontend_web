"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/constants/roles";

interface Comment {
  id: string;
  author: string;
  text: string;
}

interface CommentsSectionProps {
  eventId: string;
}

export default function CommentsSection({ eventId }: CommentsSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/events/${eventId}/comments`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    })();
  }, [eventId]);

  const canPost =
    user &&
    [UserRole.INSTITUTION_ADMIN, UserRole.FACULTY].includes(
      user.role_type as UserRole,
    );

  const handleSubmit = async () => {
    if (!canPost || !text.trim()) return;
    try {
      const res = await fetch(`/api/events/${eventId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setText("");
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <ul className="space-y-2 mb-4">
        {comments.length >= 0 &&
           comments.map((c,index) => (
            <li key={index} className="border rounded p-2">
              <p className="text-sm font-semibold">{c.author}</p>
              <p className="text-sm">{c.text}</p>
            </li>
          ))}
        {comments.length === 0 && (
          <li className="text-sm text-gray-500">No comments yet.</li>
        )}
      </ul>
      {canPost ? (
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment"
          />
          <Button
            onClick={handleSubmit}
            className="bg-[#745296] hover:bg-[#845296]"
          >
            Post Comment
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          You are not authorized to post comments.
        </p>
      )}
    </div>
  );
}

