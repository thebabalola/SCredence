# SCredence

Bitcoin-Anchored Verification for Internships, NYSC & Professional Service

A decentralized verification system built on the Stacks blockchain for recording and validating internships, national service (NYSC), volunteering, and early-career work on-chain.

The project leverages Bitcoin's immutability via Stacks to create long-lasting, tamper-resistant records of service and contribution—credentials that young people can carry for life.

**This is not a speculative DeFi product.**  
It is an identity and proof primitive designed for trust, credibility, and long-term value.

## 🌟 Features

### For Service Providers (Issuers)
- **Register as Verifier** - Organizations, employers, and institutions can register as authorized issuers
- **Issue Service Proofs** - Create immutable records of completed internships, NYSC, volunteering, etc.
- **Revoke Authorization** - Ability to revoke issuer status if needed

### For Service Participants
- **Permanent Records** - Own your service credentials forever, anchored to Bitcoin
- **Portable Credentials** - Use proofs across employers, platforms, and borders
- **Instant Verification** - Anyone can verify authenticity on-chain

### For Verifiers (Employers, Institutions)
- **Quick Verification** - Instantly verify service records on-chain
- **Fraud Prevention** - Cryptographic proofs prevent forgery and manipulation
- **Trustless Validation** - No need to contact issuing institutions

## 📋 Problem

Across Nigeria and many emerging markets:

- Internship and NYSC records are **paper-based or fragmented**
- Verification is **slow, manual, and easy to dispute**
- Young people **struggle to prove experience** to employers
- Certificates can be **lost, forged, or unverifiable**

There is no neutral, permanent, and verifiable system for proving service and work history.

## ✅ Solution

SCredence records service credentials on-chain as verifiable proofs, anchored to Bitcoin via Stacks.

Each verified record:

- ✓ Is **immutable**
- ✓ Is **independently verifiable**
- ✓ **Belongs to the individual**, not an institution
- ✓ Can be **reused across employers, platforms, and borders**

## 📝 What Can Be Recorded

The system supports proofs for:

- ✅ Internships
- ✅ NYSC service & CDS participation
- ✅ Volunteering
- ✅ Apprenticeships
- ✅ Training programs
- ✅ Certificates & skill completion (future expansion)
- ✅ Professional licenses (future expansion)

## 📁 Project Structure

```
SCredence/
├── smartcontract/          # Clarity smart contracts
│   ├── contracts/          # Contract source files
│   │   ├── service-verification.clar
│   │   └── traits.clar
│   ├── tests/              # Contract test suite
│   └── README.md           # Smart contract documentation
│
├── frontend/               # Next.js web application
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks (useStacks)
│   ├── lib/                # Contract interaction utilities
│   └── README.md           # Frontend documentation
│
└── backend/                # Event monitoring & API service (future)
    ├── src/                # Backend source code
    │   ├── webhooks/       # Chainhook event handlers
    │   ├── services/       # Business logic
    │   └── api/            # REST API endpoints
    └── README.md           # Backend documentation
```

## 🔄 How It Works (High Level)

1. **Issuers Register** - Organizations, employers, and institutions register as authorized verifiers
2. **Service Completed** - Participant completes internship, NYSC, volunteering, etc.
3. **Record Issued** - Issuer creates an on-chain proof containing:
   - Hash of the credential
   - Issuer address
   - Service type and duration
   - Timestamp
4. **Participant Owns Proof** - The service record belongs to the participant permanently
5. **Anyone Can Verify** - Employers, platforms, or anyone can verify authenticity on-chain

**No sensitive documents are stored on-chain** — only cryptographic proofs.

## 🪙 Why Bitcoin & Stacks

This system is intentionally built for Bitcoin L2 (Stacks) because:

- ✓ **Proofs of service should be permanent** - Bitcoin provides unmatched trust and finality
- ✓ **Smart contracts without compromise** - Stacks enables programmability without compromising Bitcoin's security
- ✓ **Credentials should outlive platforms** - Records should exist beyond companies and governments
- ✓ **Identity belongs on Bitcoin** - Proof and credentials are foundational infrastructure

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Clarinet** - [Installation Guide](https://docs.hiro.so/clarinet/getting-started)
- **Stacks Wallet** - Hiro/Leather or Xverse wallet

### Smart Contracts

```bash
# Navigate to smart contract directory
cd smartcontract

# Install dependencies
npm install

# Run tests
npm run test

# Check contract syntax
clarinet check

# Deploy to testnet
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your contract addresses

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

### Smart Contracts
- **Clarity 4** - Smart contract language for Stacks
- **Clarinet** - Development and testing framework
- **Vitest** - Testing framework
- **@stacks/clarinet-sdk** - SDK for Clarinet simnet
- **@stacks/transactions** - Transaction building utilities

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **@stacks/connect** - Wallet connection (Hiro, Xverse)
- **@stacks/transactions** - Transaction handling

## 🎯 Core Smart Contract Features

- ✅ Service proof issuance
- ✅ Issuer authorization & revocation
- ✅ Immutable record storage (hash-based)
- ✅ Public verification functions
- ✅ Event emission for indexing & analytics

## 💼 Use Cases

- Employers verifying internship experience
- NYSC members proving service history
- NGOs validating volunteer participation
- Youth building verifiable work profiles
- Institutions issuing digital credentials
- Platforms integrating trusted proof-of-service

## 🌍 Impact

- **Empowers youth** with verifiable credentials
- **Reduces fraud** and misrepresentation
- **Improves hiring trust** between employers and candidates
- **Supports inclusion** - financial and professional
- **Creates infrastructure** for long-term digital identity

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core service proof contract
- ✅ Issuer registration
- ✅ Verification functions
- 🔄 Frontend verification portal

### Phase 2
- 📋 Certificate & training proofs
- 📋 NFT-based credentials (optional)
- 📋 Enhanced search and filtering
- 📋 Multi-signature issuer support

### Phase 3
- 📋 Cross-platform integrations
- 📋 Anchoring proofs directly to Bitcoin blocks
- 📋 Expansion beyond Nigeria (pan-African, global)
- 📋 API for third-party integrations

## 📖 Documentation

- **[Smart Contract Documentation](./smartcontract/README.md)** - Contract architecture and deployment
- **[Frontend Documentation](./frontend/README.md)** - UI implementation and wallet integration
- **[Clarity 4 Implementation](./smartcontract/clarity-smartcontract-guide.md)** - Clarity 4 features guide (if applicable)

## 🔑 Why This Matters

SCredence is not about hype.  
It is about **trust, credibility, and opportunity**—anchored to the most secure blockchain in the world.

Young people deserve permanent, portable, and verifiable credentials that cannot be lost, forged, or disputed.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Pick a Component** - Choose smart contracts, frontend, or backend
2. **Check Issues** - Browse issues for available tasks
3. **Create a Branch** - Use format: `feature/<component>-<description>`
4. **Implement Changes** - Follow the component's coding standards
5. **Write Tests** - Ensure all tests pass
6. **Submit PR** - Include clear description and testing notes

## 🧪 Testing

### Smart Contracts
```bash
cd smartcontract
npm run test
```

### Frontend
```bash
cd frontend
npm run build  # Verify build succeeds
npm run lint   # Check code quality
```

## 📦 Deployment

### Smart Contracts
1. Update `settings/Testnet.toml` with deployer mnemonic
2. Generate deployment plan: `clarinet deployments generate --testnet --low-cost`
3. Deploy: `clarinet deployment apply -p deployments/default.testnet-plan.yaml`

### Frontend
- **Vercel** (recommended): Connect GitHub repo for automatic deployments
- **Netlify**: Similar automatic deployment from GitHub
- Set environment variables in deployment platform

## 📚 Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Documentation](https://docs.hiro.so/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [@stacks/connect Documentation](https://docs.hiro.so/stacks.js/connect)

## ⚠️ Disclaimer

**This protocol is under active development.** Use at your own risk. We recommend thorough testing before production use.

## 📜 License

MIT

## 🔗 Links

- **GitHub Repository**: [SCredence on GitHub]
- **Documentation**: See component-specific README files

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check component-specific README files
- Review test files for usage examples

---

**Built with ❤️ on Stacks blockchain - Anchored to Bitcoin**
