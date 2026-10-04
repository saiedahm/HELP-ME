import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";

const PRIVACY_POLICY_VERSION = "v1";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "company";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const companyName = String(body?.companyName ?? "").trim();
    const password = String(body?.password ?? "");
    const privacyConsent = body?.privacyConsent === true;

    if (!name || !email || !companyName || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (!privacyConsent) {
      return NextResponse.json({ error: "Privacy consent is required." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const slug = `${slugify(companyName)}-${crypto.randomUUID().slice(0, 8)}`;
    const periodStart = new Date();
    periodStart.setUTCDate(1);
    periodStart.setUTCHours(0, 0, 0, 0);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          privacyConsentAt: new Date(),
          privacyConsentVersion: PRIVACY_POLICY_VERSION,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: companyName,
          slug,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
          subscription: {
            create: {
              plan: "FREE",
              status: "ACTIVE",
            },
          },
          usage: {
            create: {
              periodStart,
            },
          },
        },
      });

      return { userId: user.id, organizationId: organization.id };
    });

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    console.error("HELP-ME registration error:", error);
    return NextResponse.json({ error: "Unable to create the account." }, { status: 500 });
  }
}
