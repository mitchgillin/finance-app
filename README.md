# Finance Calculator App

A comprehensive financial calculator application built with Next.js 15, featuring compound interest calculations, retirement planning, risk profiling, and investment simulations.

## ⚠️ Disclaimer

**This is not a professional financial tool and is very much a work in progress.** This application is for educational and experimental purposes only. Do not use this for actual financial planning or investment decisions. Always consult with qualified financial advisors for real financial guidance.

## Features

- **Compound Interest Calculator** - Calculate growth of investments over time
- **Retirement Simulator** - Plan for retirement with various scenarios
- **Risk Profile Quiz** - Assess your investment risk tolerance
- **Investment Fee Calculator** - Calculate impact of fees on returns
- **Customizable Settings** - Adjust interest rate presets and preferences

## Quick Setup

### Prerequisites

- Node.js 18+ installed
- Yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finance
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Visx** for data visualization
- **Lucide React** for icons

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # Reusable UI
├── contexts/         # React Context
└── utils/             # Utility functions
```

## Development Notes

- Uses App Router with pages in `src/app/`
- Global settings stored in localStorage via Settings Context
- Custom components like NumericInput support shorthand notation (2.5k, 15M, 1B)
- TypeScript interfaces for all component props
- Consistent styling with Tailwind CSS

## Contributing

This is a personal project and contributions may or may not be accepted.

## License

This project is licensed under the GNU GPLv3 License which can be found here: https://www.gnu.org/licenses/gpl-3.0.en.html
