# Frontend - Stacks Lending Protocol

Next.js web application for interacting with the dual-asset lending protocol on Stacks blockchain.

## Project Overview

This frontend application provides a user-friendly interface for:
- **Lenders**: Deposit STX, view yield, and withdraw funds
- **Borrowers**: Supply sBTC collateral, borrow STX, and manage positions
- **Liquidators**: Monitor and liquidate undercollateralized positions

## Technology Stack

- **Next.js 16+**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **@stacks/connect**: Wallet connection and authentication (Hiro, Xverse, etc.)
- **@stacks/transactions**: Transaction building, signing, and broadcasting

## Key Dependencies

### Blockchain Integration
- **@stacks/connect** (^7.2.0): Handles wallet connections, user authentication, and transaction signing
- **@stacks/transactions** (^7.2.0): Builds and manages Stacks transactions, contract calls, and STX transfers

### Core Framework
- **Next.js 16.0.8**: React framework with server-side rendering
- **React 19.2.1**: UI library
- **TypeScript 5**: Type safety

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Navbar
│   ├── page.tsx           # Home page
│   └── [address]/         # Dynamic route for transaction history
├── components/            # React components
│   ├── deposit-form.tsx
│   ├── withdraw-form.tsx
│   ├── borrow-form.tsx
│   ├── repay-form.tsx
│   ├── liquidate-form.tsx
│   └── ...
├── hooks/                 # Custom React hooks
│   └── use-stacks.ts     # Wallet connection hook
├── lib/                   # Utility functions
│   ├── lending-pool.ts   # Contract interaction functions
│   ├── oracle.ts         # Oracle price fetching
│   ├── stx-utils.ts      # STX utility functions
│   └── fetch-address-transactions.ts
├── package.json
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Stacks Wallet** (Hiro/Leather or Xverse) for testing

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- Next.js and React dependencies
- **@stacks/connect** for wallet integration
- **@stacks/transactions** for transaction handling
- Tailwind CSS and other styling dependencies

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Stacks Network Configuration
NEXT_PUBLIC_STACKS_NETWORK=testnet  # or 'mainnet'
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so  # or https://api.hiro.so for mainnet

# Contract Addresses (update after deployment)
NEXT_PUBLIC_LENDING_POOL_CONTRACT=ST...
NEXT_PUBLIC_MOCK_ORACLE_CONTRACT=ST...
NEXT_PUBLIC_SBTC_TOKEN_CONTRACT=SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Key Features

### Wallet Integration

The frontend uses **@stacks/connect** to:
- Connect to Stacks wallets (Hiro/Leather, Xverse)
- Authenticate users
- Sign transactions
- Manage user sessions

### Contract Interactions

The frontend uses **@stacks/transactions** to:
- Build contract call transactions
- Handle STX transfers
- Manage transaction post-conditions
- Broadcast transactions to the network

## Development Workflow

1. **Start Development Server**: `npm run dev`
2. **Connect Wallet**: Use the wallet connection button in the navbar
3. **Interact with Contracts**: Use the various forms to deposit, borrow, etc.
4. **View Transactions**: Check transaction history on the address page

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Integration with Smart Contracts

The frontend interacts with:
- **Lending Pool Contract**: Main protocol contract
- **Mock Oracle Contract**: Price feed for sBTC/STX
- **sBTC Token Contract**: For collateral management
- **Bitflow DEX**: For liquidation swaps (handled in contract)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [@stacks/connect Documentation](https://docs.hiro.so/stacks.js/connect)
- [@stacks/transactions Documentation](https://docs.hiro.so/stacks.js/transactions)
- [Stacks Documentation](https://docs.stacks.co)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

When contributing to the frontend:

1. Create a feature branch
2. Write/update components
3. Test wallet integration
4. Test contract interactions
5. Update documentation as needed
6. Submit a pull request

## License

[Add your license here]
