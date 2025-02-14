import { NextResponse } from "next/server";
import config from "@/../config/config.json";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: "Logged out successfully",
        success: true,
      },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.delete(config.other["cookie-name"]);

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Error logging out",
      },
      { status: 500 }
    );
  }
}
