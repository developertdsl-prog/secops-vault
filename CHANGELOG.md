# Changelog - SecOps-Vault

All notable changes to this project are documented chronologically in accordance with [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2022-12-23
### Added
- Enterprise-grade Envelope Encryption engine using AES-256-GCM with Key Encryption Keys (KEK) and Data Encryption Keys (DEK).
- Dynamic database and API credential leasing with automated revocation daemons and renewable TTLs.
- Internal Public Key Infrastructure (PKI) Certificate Authority issuing X.509 certificates.
- Zero-downtime secret rotation daemon with atomic version incrementation.
- React 18 Trader-grade SecOps Terminal Console with live lease monitors and cryptographic audit feed.

## [0.8.0] - 2022-11-18
### Added
- Path-based Role-Based Access Control (RBAC) policy engine enforcing zero-trust principle of least privilege.
- HMAC-SHA256 signed tamper-evident audit trail for SOC2 and ISO 27001 compliance.

## [0.5.0] - 2022-09-23
### Added
- RESTful KV Secret endpoints with path traversal support (`/v1/secret/data/*`).
- Pre-configured database credential templates for PostgreSQL, MongoDB, and AWS IAM roles.

## [0.2.0] - 2022-08-12
### Added
- Cryptographic primitive abstractions and random IV generator.
- API rate limiting and security token authorization middleware.

## [0.1.0] - 2022-07-01
### Initial
- Core project scaffolding, Mongoose schemas, Docker orchestration, and initial architectural RFC.
