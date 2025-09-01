# casquetterouge-hub

Welcome to the CasqueTerrouge Hub project! This project serves as a central hub for generating sessions with a fun casino roulette animation. Below is an overview of the project structure and its components.

## Project Structure

```
casquetterouge-hub
├── src
│   ├── app
│   │   ├── globals.css          # Global styles for the application.
│   │   ├── layout.tsx           # Main layout component that wraps around pages.
│   │   ├── hub
│   │   │   └── page.tsx         # The hub page that serves as the landing page with the "session generator" button.
│   │   ├── session
│   │   │   └── page.tsx         # Page for session-related content.
│   │   └── api
│   │       └── sessions
│   │           └── route.ts     # API route for handling session-related requests.
│   ├── components
│   │   ├── features
│   │   │   └── session-generator
│   │   │       ├── RouletteWheel.tsx        # Component that renders the roulette wheel animation.
│   │   │       ├── RouletteSegment.tsx      # Component representing a segment of the roulette wheel.
│   │   │       └── SessionGeneratorButton.tsx # Button component that triggers the roulette animation.
│   │   ├── layout
│   │   │   ├── Header.tsx        # Header component for the application layout.
│   │   │   └── Footer.tsx        # Footer component for the application layout.
│   │   └── ui
│   │       ├── Button.tsx        # Reusable button component.
│   │       ├── Card.tsx          # Card component for displaying content.
│   │       └── OptimizedImage.tsx # Component for optimized image rendering.
│   ├── lib
│   │   ├── session
│   │   │   ├── catalog.ts        # Contains session catalog data.
│   │   │   ├── randomizer.ts     # Logic for randomizing session selections.
│   │   │   └── types.ts          # Type definitions related to sessions.
│   │   └── utils.ts              # Utility functions used throughout the application.
│   └── styles
│       └── variables.css         # CSS variables for consistent styling.
├── public
│   ├── sessions
│   │   ├── catalog.json          # JSON file containing session data.
│   │   └── images
│   │       └── README.txt        # Documentation for session images.
│   ├── character
│   │   └── README.txt            # Documentation for character assets.
│   └── fonts
│       └── README.txt            # Documentation for font assets.
├── tests
│   └── unit
│       └── session
│           └── randomizer.test.ts # Unit tests for the session randomizer functionality.
├── .env.example                   # Example environment variables for configuration.
├── .eslintrc.json                # ESLint configuration file.
├── .prettierrc                   # Prettier configuration file.
├── next.config.js                # Configuration file for Next.js.
├── package.json                  # Lists dependencies and scripts for the project.
├── tsconfig.json                 # TypeScript configuration file.
└── README.md                     # Documentation for the project.
```

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd casquetterouge-hub
npm install
```

## Running the Project

To run the project in development mode, use:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.