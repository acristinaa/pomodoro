## Pomodoro

A minimal Pomodoro timer built with Next.js and React.

### Features

- **Three timer modes** — Focus Time (25 min), Short Break (5 min), and Long Break (15 min)
- **Automatic mode switching** — after each focus session the timer switches to a short break; every 4 sessions triggers a long break
- **Session tracking** — dot indicators show progress within the current set of 4 sessions, plus a running total
- **Circular progress ring** — SVG arc that fills as the timer counts down
- **Confetti + audio** on session completion
- Play/pause and reset controls

### Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- Tailwind CSS v4
- `lucide-react` for icons
- `canvas-confetti` for completion celebration

### Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
