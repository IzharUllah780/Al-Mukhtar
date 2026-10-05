import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Video from "@/lib/models/video.model";
import { getAuthUser } from "@/lib/auth";
import { videoCreateSchema, validatePayload } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error("GetAllVideos error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = validatePayload(videoCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const video = await Video.create(validation.data);
    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error("CreateVideo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create video" },
      { status: 500 }
    );
  }
}
