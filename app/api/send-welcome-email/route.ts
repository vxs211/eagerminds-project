import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email, handle } = await request.json();

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to Bookmarks!",
      html: `
        <h1>Welcome to Bookmarks!</h1>
        <p>Hi there! Your account has been created successfully.</p>
        <p>Your profile handle is: <strong>@${handle}</strong></p>
        <p>You can now start adding your favorite bookmarks and sharing them with the world.</p>
        <p>Visit your dashboard to get started: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">${process.env.NEXT_PUBLIC_APP_URL}/dashboard</a></p>
      `,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
