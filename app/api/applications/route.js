import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/lib/models/application.model";
import { getAuthUser } from "@/lib/auth";
import { applicationCreateSchema, validatePayload } from "@/lib/validations";
import { sendApplicationConfirmationEmail } from "@/lib/email";

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

    const applications = await Application.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("GetAllApplications error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    const body = await req.json();
    const validation = validatePayload(applicationCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const application = await Application.create({
      ...validation.data,
      user: auth?.id || null,
    });

    // Send course application confirmation email
    const recipientEmail = auth?.user?.email || body.email;
    if (recipientEmail) {
      try {
        await sendApplicationConfirmationEmail({
          to: recipientEmail,
          applicantName: application.name,
          courseName: application.course,
          shift: application.shift,
          qualification: application.qualification,
          whatsapp: application.whatsapp,
          applicationId: application._id.toString(),
        });
      } catch (emailErr) {
        console.error("Failed to send application confirmation email:", emailErr.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SubmitApplication error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
