import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const hmm = auth();
  console.log(hmm)
  const user = await currentUser();

  if (!hmm) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  return NextResponse.json(
    {
      message: "Authenticated",
      data: { userId: hmm, username: user?.username },
    },
    { status: 200 }
  );
}