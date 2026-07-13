import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the user actually exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!existingUser) {
    return NextResponse.json(
      {
        error: "user_not_found",
        error_description: "Your account no longer exists. Please sign out and sign in again.",
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be 4MB or less" },
        { status: 400 },
      );
    }

    // Convert file to base64 data URL for storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update the user's image field
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: dataUrl },
      select: { image: true },
    });

    return NextResponse.json({ image: updated.image });
  } catch (err) {
    console.error("Profile image upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
