"use client";

import { MessageSquare } from "lucide-react";
import StudentLayout from "@/app/dashboard/StudentLayout";

export default function StudentMessagesPage() {
  return (
    <StudentLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Chat with classmates and club members.
        </p>
      </header>

      <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-primary" />
        </div>
        <p className="font-medium text-foreground">Messaging is coming soon</p>
        <p className="text-sm max-w-sm mt-1">
          Direct messages and group chats aren’t available yet. Check back
          after launch — we’re building it.
        </p>
      </div>
    </StudentLayout>
  );
}
