import type { ISODateString, UUID } from "./common";

export type UserRole =
  | "user"
  | "admin"
  | "support";

export type UserStatus =
  | "active"
  | "suspended"
  | "deleted";

export interface User {
  id: UUID;
  email: string;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
  locale: string;
  timezone: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UserSession {
  id: UUID;
  userId: UUID;
  createdAt: ISODateString;
  expiresAt: ISODateString;
  lastActivityAt: ISODateString;
} 
