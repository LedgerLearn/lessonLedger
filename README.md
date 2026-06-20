# Decentralized Academic Accountability Platform

A web application that helps learners organize, track, and stay accountable to their academic and career learning goals using structured roadmaps, task tracking, progress analytics, and blockchain-verified achievements.

##  Project Overview

This platform is **NOT** a teaching platform. Instead, it focuses on:

- **Structuring learning paths** - Hierarchical, expandable roadmaps for any skill
- **Breaking skills into step-by-step roadmaps** - Granular learning progression
- **Tracking study consistency** - Daily and weekly accountability
- **Managing daily and weekly tasks** - Organized task management
- **Monitoring progress and streaks** - Visual progress tracking and streak counters
- **Rewarding discipline and completion** - NFT-based achievement system

The app combines the best of:
- **Roadmap.sh** (learning paths)
- **Notion** (task tracking)
- **Duolingo** (streaks and gamification)
- **GitHub** (contribution tracking)

##  Core Features

### 1. **Learning Roadmaps**
- Pre-built learning paths for various domains (Frontend, Backend, Data Science, etc.)
- Hierarchical, expandable structure
- Community-contributed roadmaps
- Progress indicators for each topic

### 2. **Task & Study Tracking**
- Daily and weekly study goals
- Task management with reminders
- Calendar integration
- Study duration tracking

### 3. **Progress Dashboard**
- Progress bars and visual indicators
- Streak counter and consistency tracking
- Study analytics and heatmap (GitHub-style)
- Learning milestones

### 4. **NFT Achievement System**
- **Achievement NFTs** - Awarded for completing milestones
- **Reputation NFTs** - For contributors and active members
- **Dynamic NFTs** - Evolve as learners progress
- Gasless experience powered by Stellar

### 5. **Community System**
- Contributor profiles
- Community roadmap submissions
- Reputation tracking
- Open-source contribution rewards

### 6. **Authentication**
- Email/password authentication
- Google OAuth integration
- Optional wallet linking

##  Project Structure

```
decentralized-academic-accountability/
├── frontend/                 # React/Next.js frontend application
├── backend/                  # Node.js/Express backend API
├── contract/                 # Stellar smart contracts (Soroban)
├── README.md                 # Main project documentation
└── .gitignore
```

##  Tech Stack

### Frontend
- **React** / **Next.js** - UI framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Zustand/Redux** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - API framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication

### Blockchain
- **Stellar SDK** - Blockchain integration
- **Soroban** - Smart contracts (Phase 2+)

### Authentication
- **Clerk** or **NextAuth.js** - Auth provider

##  MVP Scope (Phase 1)

Build FIRST (without advanced blockchain complexity):
- ✅ User authentication (email/password, Google OAuth)
- ✅ Learning roadmap system
- ✅ Daily/weekly task tracking
- ✅ Progress dashboard
- ✅ Streak tracking

##  Phase 2

Add:
- Stellar wallet integration
- Achievement NFTs
- Gas sponsorship (gasless transactions)

##  Phase 3

Add:
- Dynamic NFTs
- Community contribution rewards
- Public learner profiles
- Social/community features

##  Design Direction

UI should feel:
- Clean and minimal
- Modern and productivity-focused
- Intuitive and user-friendly

Inspiration: Notion, Linear, GitHub, Duolingo, Roadmap.sh

##  Web3 / Stellar Integration

The blockchain aspect is **invisible and stress-free** for users:
- ✅ No crypto knowledge required
- ✅ No manual wallet setup
- ✅ No gas fees (sponsored transactions)
- ✅ One-click NFT claiming
- ✅ Feels like a normal Web2 application

##  Open Source Features

Community members can contribute:
- Learning roadmaps
- Academic tracks
- Skill trees
- Productivity templates
- Platform improvements

Contributors earn:
- Reputation badges
- Contributor NFTs
- Platform recognition

##  Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/decentralized-academic-accountability.git
cd decentralized-academic-accountability
```

2. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Contracts
cd ../contract
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
```

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

##  Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Smart Contracts Documentation](./contract/README.md)

##  Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

##  License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

##  Vision Statement

A decentralized academic accountability platform that transforms learning progress, consistency, and contributions into verifiable on-chain achievements powered by Stellar.

##  Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---


