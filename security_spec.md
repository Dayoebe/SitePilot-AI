# SitePilot AI Security Specification & Test Matrix

## 1. Data Invariants
1. **Tenant Isolation**: Every resource (website, audit, client, task, automation rule, notification) must belong to a valid workspace (`workspaceId`). Cross-workspace reads or writes are strictly forbidden.
2. **Membership Verification**: A user can only access workspace data if they have an active record in `/workspaces/{workspaceId}/members/{memberId}` where `memberId == request.auth.uid`.
3. **Role Tiering (ABAC)**:
   - `owner` and `admin` have full management access including workspace settings, member management, and resource deletion.
   - `analyst` and `member` can create and edit websites, audits, clients, tasks, and run automations, but cannot delete workspaces or alter member roles.
   - `viewer` has strictly read-only access.
4. **Identity & Ownership Integrity**:
   - `createdBy` and `userId` fields must match `request.auth.uid`.
   - Immutable fields (`workspaceId`, `createdBy`, `createdAt`) cannot be altered during updates.
5. **Public Shared Reports**:
   - Shared reports in `/sharedReports/{token}` are strictly read-only by unauthenticated/authenticated users, only if `resource.data.isRevoked == false` and expiration has not passed. Writes to shared reports are restricted to authenticated workspace members who generated them.
6. **Denial of Wallet & Boundary Protection**:
   - All string inputs (URLs, titles, names, notes) are bounded by maximum length checks.
   - All collections use explicit path ID validation.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1: Cross-Tenant Theft**
   - User `attacker-uid` attempts to read `/workspaces/victim-corp-workspace/audits/audit-123`.
   - Expected: `PERMISSION_DENIED` (attacker is not a member of victim workspace).

2. **Payload 2: Identity Forgery on Creation**
   - User `attacker-uid` creates a Website document claiming `createdBy: 'victim-ceo-uid'`.
   - Expected: `PERMISSION_DENIED` (rule checks `incoming().createdBy == request.auth.uid`).

3. **Payload 3: Privilege Escalation (Self-Admin Promotion)**
   - Member with role `'viewer'` attempts to update their own member document to `role: 'owner'`.
   - Expected: `PERMISSION_DENIED` (role updates require existing owner or admin role).

4. **Payload 4: Shadow Field Injection**
   - User submits an audit update containing `{ "systemMasterOverride": true }`.
   - Expected: `PERMISSION_DENIED` (`affectedKeys().hasOnly(...)` strictly rejects unrecognized keys).

5. **Payload 5: Overwrite of Immutable Creation Timestamp**
   - Attacker updates a task attempting to backdate `createdAt: '2020-01-01T00:00:00Z'`.
   - Expected: `PERMISSION_DENIED` (`incoming().createdAt == existing().createdAt`).

6. **Payload 6: Denial of Wallet via 2MB Document Payload**
   - Malicious user tries to save a client note with a 2,000,000 character string.
   - Expected: `PERMISSION_DENIED` (length guards: `notes.size() <= 2000`).

7. **Payload 7: Unauthenticated Write to Website Catalog**
   - Anonymous visitor attempts to write to `/workspaces/ws-1/websites/hack-target`.
   - Expected: `PERMISSION_DENIED` (`request.auth != null` mandatory).

8. **Payload 8: Viewer Role State Manipulation**
   - A user with `'viewer'` role attempts to update a Task status to `'done'`.
   - Expected: `PERMISSION_DENIED` (viewers are restricted to read operations only).

9. **Payload 9: Revoked Public Report Access Bypass**
   - Public client attempts to read a shared report `/sharedReports/share-token-xyz` where `isRevoked == true`.
   - Expected: `PERMISSION_DENIED` (read rule enforces `!resource.data.isRevoked`).

10. **Payload 10: Path ID Poisoning**
    - User crafts a request targeting a workspace with 5,000 bytes of null characters and special escape sequences.
    - Expected: `PERMISSION_DENIED` (`isValidId(workspaceId)` restricts to `^[a-zA-Z0-9_\-]+$` and `<= 128` chars).

11. **Payload 11: Non-Owner Deletion of Entire Workspace**
    - Regular member attempts `DELETE /workspaces/ws-enterprise`.
    - Expected: `PERMISSION_DENIED` (workspace deletion strictly requires `isWorkspaceOwner()`).

12. **Payload 12: Client Manipulation of Completed Audit Core Scores**
    - User attempts to manually falsify Lighthouse score from 42 to 99 on a completed audit.
    - Expected: `PERMISSION_DENIED` (terminal status lock or strictly controlled execution flow).
