# PriceWise - E-Commerce Price Tracker

PriceWise is a full-stack application designed to help users track and compare product prices across different online stores. It utilizes a React frontend, a Node.js Express backend, and integrates with a C++ program for efficient data storage and retrieval using AVL Trees and Fibonacci Heaps.

## Features

- **Price Comparison:** View prices for a specific product from multiple stores in a clear table.
- **Lowest Price Finder:** Quickly identify the store offering the best deal for a product.
- **Product Suggestions:** Get AI-powered recommendations for related products based on your search history.
- **Add/Update/Delete Prices (Backend functionality):** The backend supports managing product price data via API calls that interact with the C++ core. (Frontend UI for this is planned).

## Tech Stack

- **Frontend:** Next.js (React Framework), TypeScript, Tailwind CSS, ShadCN UI
- **Backend:** Node.js, Express (API implementation planned - Currently mocked in frontend)
- **Data Structures & Core Logic:** C++ (AVL Tree, Fibonacci Heap - execution via backend planned)
- **AI:** Genkit (for Product Suggestions)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A C++ compiler (like g++) for the data structure implementation (details below)
- Google AI API Key (for Product Suggestions)

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd pricewise
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Google AI API key:
    ```
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Compile the C++ Program (Placeholder):**
    *(This step assumes you have a `price_tracker.cpp` file in a `cpp` directory. Adjust paths and commands as needed.)*
    Navigate to the C++ source directory and compile the executable:
    ```bash
    # Example compilation command (adjust as necessary):
    # cd cpp
    # g++ price_tracker.cpp -o price_tracker -std=c++17
    # cd ..
    ```
    *Note: The backend integration to call this executable is planned.*

### Running the Application

1.  **Start the Genkit development server (for AI features):**
    *(Run this in a separate terminal)*
    ```bash
    npm run genkit:dev
    ```
    *(Alternatively, use `npm run genkit:watch` for auto-reloading)*

2.  **Run the Next.js frontend development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

3.  **Run the Node.js Backend (Planned):**
    *(Instructions will be added here once the Express backend is implemented.)*
    ```bash
    # Example (when implemented):
    # cd backend
    # npm install
    # node server.js
    ```

## Project Structure

```
pricewise/
├── public/             # Static assets
├── src/
│   ├── ai/             # Genkit AI flow implementations
│   ├── app/            # Next.js App Router (pages, layout)
│   ├── components/     # React UI components (ShadCN UI, custom)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── ...
├── cpp/                # (Planned) C++ source code (e.g., price_tracker.cpp)
├── backend/            # (Planned) Node.js Express backend code
├── components.json     # ShadCN UI configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Future Work

- Implement the Node.js Express backend API routes.
- Integrate the backend with the compiled C++ executable (`child_process`).
- Connect the React frontend to the backend API instead of using mock data.
- Add UI elements for adding, updating, and deleting product prices.
- Implement robust error handling across all layers.
- Add unit and integration tests.
```
 
   