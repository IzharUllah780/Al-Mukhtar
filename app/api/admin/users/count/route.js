import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const total = await User.countDocuments({});
    const verified = await User.countDocuments({ isVerified: true });
    return NextResponse.json({ success: true, count: total, total, verifiedCount: verified });
  } catch (error) {
    console.error("GetUserCount error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

