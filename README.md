# Personal-Tracker

A personal NEPSE trading dashboard built as a focused 1-day MVP sprint.
Tracks portfolio holdings, logs trades with real broker fee calculations,
and fires rule-based price alerts.

## Features
- Portfolio management with real P/L (fee-adjusted cost basis)
- Trade journal with BUY/SELL logging and thesis notes
- NEPSE fee engine — commission tiers, SEBON (0.015%), DP charge (NPR 25), CGT (7.5% / 5%)
- Rule-based alert system (price above/below threshold)
- Watchlist for tracking stocks

## Tech Stack
- **Frontend:** React (Vite), React Router, Context API + useReducer
- **Backend:** Node.js, Express, MongoDB, JWT auth
- **Fee Engine:** Pure JS utility — SEBON revised rates Jestha 2081 (May 2024)

## Setup
cd frontend && npm install && npm run dev
cd backend  && npm install && npm run dev

## Status
MVP in progress — frontend complete, backend wiring in progress.
