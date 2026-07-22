export type UUID = string;
export type ISODateTime = string;

export type ActorRole = "captain" | "chief" | "qa_reviewer" | "system";

export interface Actor {
  id: string;
  role: ActorRole;
}

export interface VersionedEntity {
  version: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  createdBy: string;
  lastUpdatedBy: string;
}

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
