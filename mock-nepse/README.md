# Mock NEPSE API

Simple mock server for local development to provide `/symbols` and `/price` endpoints.

Run:

```bash
cd mock-nepse
npm install
npm start
```

Then set `VITE_NEPSE_API` in `frontend/.env` to `http://localhost:3000` and start the frontend.
