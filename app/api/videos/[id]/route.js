import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Video from "@/lib/models/video.model";
import { getAuthUser } from "@/lib/auth";
import { videoUpdateSchema, validatePayload } from "@/lib/validations";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const video = await Video.findById(id).lean();
    if (!video) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("GetVideoById error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validation = validatePayload(videoUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const video = await Video.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!video) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("UpdateVideo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("DeleteVideo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}
