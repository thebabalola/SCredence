# StacksLend

A decentralized dual-asset lending protocol built on the Stacks blockchain. StacksLend enables users to deposit STX to earn yield, borrow STX against sBTC collateral, and participate in liquidations to maintain protocol health.

## 🌟 Features

### For Lenders
- **Deposit STX** - Supply STX tokens to the lending pool
- **Earn Yield** - Receive 10% annual interest from borrower payments
- **Flexible Withdrawals** - Withdraw deposited STX plus earned interest anytime

### For Borrowers
- **Borrow STX** - Use sBTC as collateral to borrow STX tokens
- **70% LTV Ratio** - Borrow up to 70% of your collateral value
- **Flexible Repayment** - Repay loans and reclaim collateral at any time

### For Liquidators
- **Monitor Positions** - Track undercollateralized loans in real-time
- **Liquidate Positions** - Trigger liquidations when health factor drops below 100%
- **Earn Bounties** - Receive 10% of liquidated collateral as reward

## 📁 Project Structure

```
stackslend/
├── smartcontract/          # Clarity smart contracts
│   ├── contracts/          # Contract source files
│   │   ├── lending-pool.clar
│   │   └── mock-oracle.clar
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
└── backend/                # Event monitoring & API service
    ├── src/                # Backend source code
    │   ├── webhooks/       # Chainhook event handlers
    │   ├── services/       # Business logic
    │   └── api/            # REST API endpoints
    └── README.md           # Backend documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Clarinet** - [Installation Guide](https://docs.hiro.so/clarinet/getting-started)
- **Stacks Wallet** - Hiro/Leather or Xverse wallet
- **Docker** (optional, for backend Chainhook service)

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

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

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

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **@hirosystems/chainhooks-client** - Real-time blockchain events
- **PostgreSQL/MongoDB** - Data persistence

## 📊 Protocol Parameters

- **LTV Percentage**: 70% - Maximum loan-to-value ratio
- **Interest Rate**: 10% annually
- **Liquidation Threshold**: 100% - When liquidation can be triggered
- **Liquidator Bounty**: 10% of collateral value

## 🔒 Security Features

### Smart Contract Security
- ✅ **Clarity 4 Features** - Latest security enhancements
- ✅ **Contract Verification** - `contract-hash?` for external contract validation
- ✅ **Asset Protection** - `restrict-assets?` for post-condition enforcement
- ✅ **Time-based Logic** - `stacks-block-time` for accurate interest calculations

### Protocol Security
- ✅ **Collateralization** - Over-collateralized loans (70% LTV)
- ✅ **Liquidation Mechanism** - Automated liquidation via Bitflow DEX
- ✅ **Interest Accrual** - Continuous interest tracking with yield index
- ✅ **Oracle Integration** - Price feeds for accurate collateral valuation

## 🌐 Deployed Contracts

### Mainnet
- **Lending Pool**: `SPZYY7560YPR8BY63XNTDX36HBY1G8K0TST365B2.stackslend-v1`
- **Mock Oracle**: `SPZYY7560YPR8BY63XNTDX36HBY1G8K0TST365B2.mock-oracle-v1`

### Testnet
Deploy your own instance following the [smart contract deployment guide](./smartcontract/README.md#deployment).

## 📖 Documentation

- **[Smart Contract Documentation](./smartcontract/README.md)** - Contract architecture and deployment
- **[Frontend Documentation](./frontend/README.md)** - UI implementation and wallet integration
- **[Backend Documentation](./backend/README.md)** - Event monitoring and API setup
- **[Clarity 4 Implementation](./smartcontract/clarity-smartcontract-guide.md)** - Clarity 4 features guide
- **[Issues & Roadmap](./smartcontract/issues.md)** - Development tasks and feature requests

## 🔑 Key Concepts

### Interest Accrual
Interest accrues continuously based on:
- Total borrowed STX in the pool
- Time elapsed since last accrual
- Annual interest rate (10%)

### Yield Index
Each lender has a `yield-index` that tracks their deposit time:
- Ensures fair interest distribution
- New deposits don't earn retroactive interest
- Lenders only earn on funds they've supplied

### Liquidation Process
When a position becomes undercollateralized (health factor < 100%):
1. Liquidator triggers liquidation transaction
2. 10% of collateral transferred to liquidator as bounty
3. Remaining 90% sold on Bitflow DEX for STX
4. STX proceeds distributed to lenders as yield
5. Borrower's debt is cleared

## 🔗 Integration Points

- **sBTC Token** - Collateral asset for borrowing
- **Bitflow DEX** - Automated liquidation swaps (sBTC → STX)
- **Mock Oracle** - Price feeds (replace with Pyth/Redstone in production)
- **Chainhook** - Real-time blockchain event monitoring

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Pick a Component** - Choose smart contracts, frontend, or backend
2. **Check Issues** - Browse [`smartcontract/issues.md`](./smartcontract/issues.md) for tasks
3. **Create a Branch** - Use format: `feature/<component>-<description>`
4. **Implement Changes** - Follow the component's coding standards
5. **Write Tests** - Ensure all tests pass
6. **Submit PR** - Include clear description and testing notes

### Development Workflow
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests for affected components
5. Update documentation as needed
6. Submit a pull request

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

### Backend
```bash
cd backend
npm test       # Run test suite
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

### Backend
- **Railway/Render**: Deploy with Docker or Node.js buildpack
- **AWS/GCP**: Deploy as containerized service
- Configure Chainhook service to point to backend webhook URL

## 📚 Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Documentation](https://docs.hiro.so/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [@stacks/connect Documentation](https://docs.hiro.so/stacks.js/connect)
- [Chainhook Documentation](https://docs.hiro.so/chainhook)
- [Bitflow DEX](https://bitflow.finance)

## ⚠️ Disclaimer

**This protocol has not undergone a professional security audit.** Use at your own risk. Do not deposit funds you cannot afford to lose.

## 📜 License

[Specify your license here - e.g., MIT, Apache 2.0, etc.]

## 🔗 Links

- **GitHub Repository**: https://github.com/StacksLend/stackslend
- **Frontend**: (Now merged into this monorepo)
- **Backend**: (Now merged into this monorepo)

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check component-specific README files
- Review test files for usage examples

---

**Built with ❤️ on Stacks blockchain**
