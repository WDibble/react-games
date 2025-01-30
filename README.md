# 🎮 React Games Collection

<div align="center">

![Preview](public/preview.png)

A collection of classic games rebuilt with modern web technologies - React, TypeScript, and Tailwind CSS.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

</div>

## 🎯 Overview

Four classic games reimagined using modern web technologies. Perfect for learning React patterns and game development concepts. Features responsive design, touch support, and keyboard controls.

## 🎲 Games Included

- **2048**: Slide and combine tiles to reach 2048
- **Bird Flapper**: A flappy bird inspired game
- **Word Guesser**: A Wordle-like word guessing game
- **Higher or Lower**: A card guessing game

## ✨ Features

- **Modern Tech Stack**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Playable on both desktop and mobile devices
- **Multiple Control Methods**: Keyboard, touch, and click controls
- **Clean Architecture**: Well-organized component structure
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Built with Vite for fast development and production builds

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/WDibble/react-games
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 🛠 Tech Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Hooks

## 📁 Project Structure
```
├── src/
│   ├── pages/         # Game components
│   │   ├── BirdFlapper.tsx
│   │   ├── HigherOrLower.tsx
│   │   ├── TwentyFourtyEight.tsx
│   │   └── WordGuesser.tsx
│   ├── App.tsx       # Main app component
│   └── main.tsx      # Entry point
```

## 🎮 Game Controls

### 2048
- Arrow Keys: Move tiles
- Touch: Swipe in any direction
- On-screen Buttons: Click arrows to move

### Bird Flapper
- Space: Flap/Jump
- Touch/Click: Tap to flap

### Word Guesser
- Keyboard: Type letters
- Enter: Submit guess
- Backspace: Delete letter

### Higher or Lower
- Buttons: Click Higher/Lower
- Touch: Tap buttons to guess