import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export async function requirePlatformAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, isPlatformAdmin: true } });
  return user?.isPlatformAdmin ? user : null;
}
