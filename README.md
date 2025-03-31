# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

# AI Chat Window

## Features

-   Chat interface with user and AI assistant message bubbles.
-   Utilizes OpenRouter API for generating AI responses.
-   Provides "Fix" and "Simplify" buttons to modify user input before sending to the AI.
-   Loading and error handling indicators.
-   Clear button to clear the message thread.

## Technologies

-   Tauri
-   React
-   TypeScript
-   Tailwind CSS v3
-   OpenRouter API

## Environment Variables

-   `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key.  You must obtain this from [OpenRouter](https://openrouter.ai/).

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set the `VITE_OPENROUTER_API_KEY` environment variable in the `.env` file.
4.  Run the development server: `npm run tauri dev`

## Building for Production

Run `npm run tauri build` to create the distributable application bundle for your target platform(s). The output will be located in the `src-tauri/target/release/bundle/` directory.
