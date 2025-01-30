import { NextRequest, NextResponse } from "next/server";
import { Helpers } from "@/helpers/Helpers";
import Errors from "@/common/errors";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const decodedToken = Helpers.verifyToken(token);

    return NextResponse.json({
      success: true,
      user: {
        id: decodedToken.id,
        email: decodedToken.email,
        phoneNumber: decodedToken.phoneNumber,
        username: decodedToken.username,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        admin: decodedToken.admin,
      },
    });
  } catch (e) {
    let error = Helpers.FetchError(e as Error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.status }
    );
  }
}
