import { NextRequest, NextResponse } from "next/server";
export async function GET(request:NextRequest){return NextResponse.json({verified:request.cookies.get("helpme_email_verified")?.value==="1"});}
