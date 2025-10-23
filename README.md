# 🚀 Quick Setup Guide

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Ethers.js 6** - Blockchain interaction
- **Radix UI** - Component library
- **Framer Motion** - Animations

### Backend
- **FastAPI** - Python web framework
- **Playwright** - Web scraping
- **BeautifulSoup4** - HTML parsing
- **Supabase** - Database & Authentication

### Blockchain
- **Solidity 0.8.28** - Smart contracts
- **Hardhat** - Development environment
- **OpenZeppelin** - Contract library
- **Lisk Sepolia** - Testnet network

---

## Prerequisites

- Node.js 18+
- Python 3.8+
- Git
- MetaMask wallet

---

## 1️⃣ Fact-Checker AI Backend

### Setup

```bash
cd fact-checker

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
```

**Create `requirements.txt` if not present:**
```txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.11.9
playwright==1.40.0
beautifulsoup4==4.12.2
requests==2.31.0
python-dotenv==1.0.0
```

### Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**API available at:** `http://localhost:8000`

---

## 2️⃣ Lisk-Chain Blockchain

### Setup

```bash
cd lisk-chain

# Install dependencies
npm install

# Create .env file
touch .env
```

**Add to `.env`:**
```env
LISK_RPC_URL=https://rpc.sepolia-api.lisk.com
PRIVATE_KEY=your_wallet_private_key_here
```

### Compile & Deploy

```bash
# Compile contracts
npx hardhat compile

# Deploy to Lisk Sepolia
npx hardhat run scripts/deploy.ts --network liskSepolia
```

**Save the contract addresses!**

---

## 3️⃣ Web Frontend

### Setup

```bash
cd web

# Install dependencies
npm install
```

**Update `.env` file with contract addresses:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://rfynrqipqcvbeixodwjp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmeW5ycWlwcWN2YmVpeG9kd2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2Njg5MjEsImV4cCI6MjA3NTI0NDkyMX0.rdMg6U0M1BdStmfCOgvy2by2tZBC_P_8D34-oJhnCQ0

NEXT_PUBLIC_RELIEF_DONATION_CONTRACT=0x_deployed_contract_address
NEXT_PUBLIC_DONATION_NFT_CONTRACT=0x_deployed_nft_address
NEXT_PUBLIC_FACT_CHECKER_API=http://localhost:8000
NEXT_PUBLIC_LISK_RPC_URL=https://rpc.sepolia-api.lisk.com
```

### Run

```bash
npm run dev
```

**Frontend available at:** `http://localhost:3000`

---

## ✅ Verification

1. **Fact-Checker:** Visit `http://localhost:8000/docs`
2. **Blockchain:** Check contract on `https://sepolia-blockscout.lisk.com`
3. **Frontend:** Open `http://localhost:3000`

---

## 🐛 Quick Fixes

**Port already in use:**
```bash
# Kill process on port
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Playwright error:**
```bash
playwright install chromium
```