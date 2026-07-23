"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Quicksell</h1>

      {session ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Logged in as: <strong>{session.user?.name}</strong></p>
          <p className="text-sm text-gray-500">{session.user?.email}</p>
          <Button variant="destructive" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      ) : (
        <Button onClick={() => signIn("google")}>
          Sign in with Google
        </Button>
      )}
    </main>
  );
}