import type { ColumnType } from "kysely";

export type AalLevel = "aal1" | "aal2" | "aal3";

export type FactorStatus = "unverified" | "verified";

export type FactorType = "totp" | "webauthn";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, string | number | bigint, string | number | bigint>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type KeyStatus = "default" | "expired" | "invalid" | "valid";

export type KeyType = "aead-det" | "aead-ietf" | "auth" | "generichash" | "hmacsha256" | "hmacsha512" | "kdf" | "secretbox" | "secretstream" | "shorthash" | "stream_xchacha20";

export type Numeric = ColumnType<string, string | number, string | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AuthAuditLogEntries {
  instanceId: string | null;
  id: string;
  payload: Json | null;
  createdAt: Timestamp | null;
  ipAddress: Generated<string>;
}

export interface AuthIdentities {
  id: string;
  userId: string;
  identityData: Json;
  provider: string;
  lastSignInAt: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  email: Generated<string | null>;
}

export interface AuthInstances {
  id: string;
  uuid: string | null;
  rawBaseConfig: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface AuthMfaAmrClaims {
  sessionId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  authenticationMethod: string;
  id: string;
}

export interface AuthMfaChallenges {
  id: string;
  factorId: string;
  createdAt: Timestamp;
  verifiedAt: Timestamp | null;
  ipAddress: string;
}

export interface AuthMfaFactors {
  id: string;
  userId: string;
  friendlyName: string | null;
  factorType: FactorType;
  status: FactorStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  secret: string | null;
}

export interface AuthRefreshTokens {
  instanceId: string | null;
  id: Generated<Int8>;
  token: string | null;
  userId: string | null;
  revoked: boolean | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  parent: string | null;
  sessionId: string | null;
}

export interface AuthSamlProviders {
  id: string;
  ssoProviderId: string;
  entityId: string;
  metadataXml: string;
  metadataUrl: string | null;
  attributeMapping: Json | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface AuthSamlRelayStates {
  id: string;
  ssoProviderId: string;
  requestId: string;
  forEmail: string | null;
  redirectTo: string | null;
  fromIpAddress: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface AuthSchemaMigrations {
  version: string;
}

export interface AuthSessions {
  id: string;
  userId: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  factorId: string | null;
  aal: AalLevel | null;
  notAfter: Timestamp | null;
}

export interface AuthSsoDomains {
  id: string;
  ssoProviderId: string;
  domain: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface AuthSsoProviders {
  id: string;
  resourceId: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface AuthUsers {
  instanceId: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encryptedPassword: string | null;
  emailConfirmedAt: Timestamp | null;
  invitedAt: Timestamp | null;
  confirmationToken: string | null;
  confirmationSentAt: Timestamp | null;
  recoveryToken: string | null;
  recoverySentAt: Timestamp | null;
  emailChangeTokenNew: string | null;
  emailChange: string | null;
  emailChangeSentAt: Timestamp | null;
  lastSignInAt: Timestamp | null;
  rawAppMetaData: Json | null;
  rawUserMetaData: Json | null;
  isSuperAdmin: boolean | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  phone: Generated<string | null>;
  phoneConfirmedAt: Timestamp | null;
  phoneChange: Generated<string | null>;
  phoneChangeToken: Generated<string | null>;
  phoneChangeSentAt: Timestamp | null;
  confirmedAt: Generated<Timestamp | null>;
  emailChangeTokenCurrent: Generated<string | null>;
  emailChangeConfirmStatus: Generated<number | null>;
  bannedUntil: Timestamp | null;
  reauthenticationToken: Generated<string | null>;
  reauthenticationSentAt: Timestamp | null;
  isSsoUser: Generated<boolean>;
  deletedAt: Timestamp | null;
}

export interface Board {
  id: string;
  name: string;
  userId: string;
  updatedAt: Timestamp;
  createdAt: Generated<Timestamp>;
}

export interface Column {
  id: string;
  name: string;
  order: Generated<number>;
  boardId: string;
  updatedAt: Timestamp;
  createdAt: Generated<Timestamp>;
}

export interface Example {
  id: Generated<number>;
  name: string;
}

export interface ExtensionsPgStatStatements {
  userid: number | null;
  dbid: number | null;
  toplevel: boolean | null;
  queryid: Int8 | null;
  query: string | null;
  plans: Int8 | null;
  totalPlanTime: number | null;
  minPlanTime: number | null;
  maxPlanTime: number | null;
  meanPlanTime: number | null;
  stddevPlanTime: number | null;
  calls: Int8 | null;
  totalExecTime: number | null;
  minExecTime: number | null;
  maxExecTime: number | null;
  meanExecTime: number | null;
  stddevExecTime: number | null;
  rows: Int8 | null;
  sharedBlksHit: Int8 | null;
  sharedBlksRead: Int8 | null;
  sharedBlksDirtied: Int8 | null;
  sharedBlksWritten: Int8 | null;
  localBlksHit: Int8 | null;
  localBlksRead: Int8 | null;
  localBlksDirtied: Int8 | null;
  localBlksWritten: Int8 | null;
  tempBlksRead: Int8 | null;
  tempBlksWritten: Int8 | null;
  blkReadTime: number | null;
  blkWriteTime: number | null;
  tempBlkReadTime: number | null;
  tempBlkWriteTime: number | null;
  walRecords: Int8 | null;
  walFpi: Int8 | null;
  walBytes: Numeric | null;
  jitFunctions: Int8 | null;
  jitGenerationTime: number | null;
  jitInliningCount: Int8 | null;
  jitInliningTime: number | null;
  jitOptimizationCount: Int8 | null;
  jitOptimizationTime: number | null;
  jitEmissionCount: Int8 | null;
  jitEmissionTime: number | null;
}

export interface ExtensionsPgStatStatementsInfo {
  dealloc: Int8 | null;
  statsReset: Timestamp | null;
}

export interface Key {
  id: string;
  hashedPassword: string | null;
  userId: string;
  primary: boolean;
  expires: Int8 | null;
}

export interface PgsodiumDecryptedKey {
  id: string | null;
  status: KeyStatus | null;
  created: Timestamp | null;
  expires: Timestamp | null;
  keyType: KeyType | null;
  keyId: Int8 | null;
  keyContext: Buffer | null;
  name: string | null;
  associatedData: string | null;
  rawKey: Buffer | null;
  decryptedRawKey: Buffer | null;
  rawKeyNonce: Buffer | null;
  parentKey: string | null;
  comment: string | null;
}

export interface PgsodiumKey {
  id: Generated<string>;
  status: Generated<KeyStatus | null>;
  created: Generated<Timestamp>;
  expires: Timestamp | null;
  keyType: KeyType | null;
  keyId: Generated<Int8 | null>;
  keyContext: Generated<Buffer | null>;
  name: string | null;
  associatedData: Generated<string | null>;
  rawKey: Buffer | null;
  rawKeyNonce: Buffer | null;
  parentKey: string | null;
  comment: string | null;
  userData: string | null;
}

export interface PgsodiumMaskColumns {
  attname: string | null;
  attrelid: number | null;
  keyId: string | null;
  keyIdColumn: string | null;
  associatedColumns: string | null;
  nonceColumn: string | null;
  formatType: string | null;
}

export interface PgsodiumMaskingRule {
  attrelid: number | null;
  attnum: number | null;
  relnamespace: string | null;
  relname: string | null;
  attname: string | null;
  formatType: string | null;
  colDescription: string | null;
  keyIdColumn: string | null;
  keyId: string | null;
  associatedColumns: string | null;
  nonceColumn: string | null;
  viewName: string | null;
  priority: number | null;
}

export interface PgsodiumValidKey {
  id: string | null;
  name: string | null;
  status: KeyStatus | null;
  keyType: KeyType | null;
  keyId: Int8 | null;
  keyContext: Buffer | null;
  created: Timestamp | null;
  expires: Timestamp | null;
  associatedData: string | null;
}

export interface Session {
  id: string;
  userId: string;
  activeExpires: Int8;
  idleExpires: Int8;
}

export interface StorageBuckets {
  id: string;
  name: string;
  owner: string | null;
  createdAt: Generated<Timestamp | null>;
  updatedAt: Generated<Timestamp | null>;
  public: Generated<boolean | null>;
  avifAutodetection: Generated<boolean | null>;
  fileSizeLimit: Int8 | null;
  allowedMimeTypes: string[] | null;
}

export interface StorageMigrations {
  id: number;
  name: string;
  hash: string;
  executedAt: Generated<Timestamp | null>;
}

export interface StorageObjects {
  id: Generated<string>;
  bucketId: string | null;
  name: string | null;
  owner: string | null;
  createdAt: Generated<Timestamp | null>;
  updatedAt: Generated<Timestamp | null>;
  lastAccessedAt: Generated<Timestamp | null>;
  metadata: Json | null;
  pathTokens: Generated<string[] | null>;
}

export interface SubTask {
  id: string;
  name: string;
  order: Generated<number>;
  updatedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  achieved: Generated<boolean>;
  taskId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  order: Generated<number>;
  columnId: string;
  updatedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  endsAt: Timestamp | null;
}

export interface User {
  id: string;
  email: string;
}

export interface DB {
  "auth.auditLogEntries": AuthAuditLogEntries;
  "auth.identities": AuthIdentities;
  "auth.instances": AuthInstances;
  "auth.mfaAmrClaims": AuthMfaAmrClaims;
  "auth.mfaChallenges": AuthMfaChallenges;
  "auth.mfaFactors": AuthMfaFactors;
  "auth.refreshTokens": AuthRefreshTokens;
  "auth.samlProviders": AuthSamlProviders;
  "auth.samlRelayStates": AuthSamlRelayStates;
  "auth.schemaMigrations": AuthSchemaMigrations;
  "auth.sessions": AuthSessions;
  "auth.ssoDomains": AuthSsoDomains;
  "auth.ssoProviders": AuthSsoProviders;
  "auth.users": AuthUsers;
  Board: Board;
  Column: Column;
  Example: Example;
  "extensions.pgStatStatements": ExtensionsPgStatStatements;
  "extensions.pgStatStatementsInfo": ExtensionsPgStatStatementsInfo;
  key: Key;
  "pgsodium.decryptedKey": PgsodiumDecryptedKey;
  "pgsodium.key": PgsodiumKey;
  "pgsodium.maskColumns": PgsodiumMaskColumns;
  "pgsodium.maskingRule": PgsodiumMaskingRule;
  "pgsodium.validKey": PgsodiumValidKey;
  session: Session;
  "storage.buckets": StorageBuckets;
  "storage.migrations": StorageMigrations;
  "storage.objects": StorageObjects;
  SubTask: SubTask;
  Task: Task;
  user: User;
}
