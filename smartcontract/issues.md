# Project Issues - SCredence (Service Verification Protocol)

This document outlines the roadmap and tasks for building the Bitcoin-anchored service verification protocol.

## Smart Contract Issues

### Issuer Management

#### Issue #1: Implement Issuer Registration
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Enable the contract owner to register and manage authorized issuers.

---

### Service Proofs

#### Issue #2: Implement Proof Issuance
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Allow authorized issuers to create immutable service verification records.

#### Issue #3: Implement Proof Verification
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Public functions to verify the authenticity of a credential hash.

---

### Security & Controls

#### Issue #4: Proof Revocation Mechanism
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Enable issuers to revoke proofs in case of errors or fraudulent information.
- **Tasks:**
  - [x] Add `revoked-proofs` map.
  - [x] Implement `revoke-service-proof` function.
  - [x] Update verification logic to check for revocation status.

#### Issue #5: Proof Expiration & Renewal
**Priority:** Medium  
**Status:** ✅ Completed  
**Description:** Support time-limited credentials that can be renewed by issuers.
- **Tasks:**
  - [x] Add `expiry-date` to `service-proofs` map.
  - [x] Update `issue-service-proof` to handle expiry validation.
  - [x] Implement `renew-service-proof` function.
  - [x] Update verification logic to check for expiration.

---

## Frontend Issues

### Wallet & Identity

#### Issue #6: Stacks Wallet Integration
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Connect Leather/Xverse wallets to the dApp.

#### Issue #7: Issuer Dashboard
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Interface for authorized organizations to issue and manage proofs.

#### Issue #8: Implement Proof Verification UI
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Create a public verification interface for checking credential authenticity.
