# Security and data-protection plan

## Scope and current boundary

The current static prototype must not collect or store production personal data. Registration and checkout remain disabled. Sample records must be fictional and contain no reusable passwords, real identity numbers, bank details or mobile-money secrets.

## Controls required before live processing

1. Maintain a data inventory showing each field, purpose, lawful basis, recipient, retention period and deletion method.
2. Register with Uganda's Personal Data Protection Office where required and publish the controller's verified legal identity and contact details.
3. Use server-side authentication with multi-factor protection for administrators and least-privilege roles.
4. Encrypt personal data in transit and at rest; store credentials only as salted password hashes; keep secrets outside source code.
5. Separate identity evidence from marketplace records and use pseudonymous internal identifiers.
6. Record consent and notices by version, date, language and channel; provide access, correction, withdrawal and deletion processes.
7. Log administrative access and changes without recording full identity or payment data.
8. Define retention, backups, restoration tests, breach escalation and provider exit/deletion procedures.
9. Complete a data-protection impact assessment before national-ID processing, profiling, location tracking or sharing data with government or commercial partners.
10. Obtain independent security review and close high-risk findings before pilot launch.

## Payment boundary

ShambaNi should not handle mobile-money PINs or store card/payment credentials. A Bank of Uganda-licensed provider should host or tokenize payment entry. The backend should store provider references, amounts, statuses and reconciliation events only. Refund, dispute, failed-payment and duplicate-callback behaviour must be documented and tested.

## Incident minimum

Assign an incident lead and contacts; define severity levels; preserve logs; isolate affected credentials and services; assess data and financial exposure; notify the appropriate authority and affected people when legally required; record corrective actions and test recovery.

## Evidence pack

Keep dated copies of the data map, privacy impact assessment, PDPO evidence, access-role matrix, provider agreements, threat model, penetration/security review, backup restoration result, incident drill, deletion test and launch approval.
