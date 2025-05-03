# PriceWise - E-Commerce Price Tracker

PriceWise is a full-stack application designed to help users track and compare product prices across different online stores. It utilizes a React frontend (Next.js) and currently uses mock data to simulate backend operations. The future plan involves a Node.js Express backend integrating with a C++ program for efficient data storage and retrieval using AVL Trees.

## Features

- **Price Comparison:** View prices for a specific product from multiple stores in a clear table.
- **Lowest Price Finder:** Quickly identify the store offering the best deal for a product.
- **Add/Update/Delete Prices:** Add new price entries, edit existing ones, or delete specific entries or all entries for a product. (Currently implemented with mock data in the frontend).
- **Product Suggestions:** (Removed - Was previously AI-powered)

## Tech Stack

- **Frontend:** Next.js (React Framework), TypeScript, Tailwind CSS, ShadCN UI
- **Backend (Planned):** Node.js, Express (API implementation planned)
- **Data Structures & Core Logic (Planned):** C++ (AVL Tree implementation planned for backend integration)
- **Data (Current):** Mock data managed in React component state (`src/app/page.tsx`)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- (Optional for future backend) A C++ compiler (like g++)
- (Optional for future backend) Google AI API Key (if AI features are reintroduced)

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

3.  **Set up Environment Variables (Optional - for future use):**
    Create a `.env.local` file in the root directory if you plan to add API keys later:
    ```
    # GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE (Example if Genkit is used again)
    ```

4.  **Compile the C++ Program (Placeholder for future backend):**
    *(This step assumes you will have a `price_tracker.cpp` file implementing AVL trees. Adjust paths and commands as needed when implemented.)*
    ```bash
    # Example compilation command (adjust as necessary):
    # cd cpp
    # g++ price_tracker.cpp -o price_tracker -std=c++17
    # cd ..
    ```
    *Note: The backend integration to call this executable is planned.*

### Running the Application

1.  **Run the Next.js frontend development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`. The application currently operates solely on mock data within the frontend.

2.  **Run the Genkit Development Server (Not currently needed):**
    *(Genkit is not used in the current version. Run this only if AI features are re-added.)*
    ```bash
    # npm run genkit:dev
    ```

3.  **Run the Node.js Backend (Planned):**
    *(Instructions will be added here once the Express backend and C++ integration are implemented.)*
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
│   ├── ai/             # (Currently unused) Genkit AI flows
│   ├── app/            # Next.js App Router (pages, layout)
│   ├── components/     # React UI components (ShadCN UI, custom)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── ...
├── cpp/                # (Planned) C++ source code (e.g., price_tracker.cpp with AVL Tree)
├── backend/            # (Planned) Node.js Express backend code
├── components.json     # ShadCN UI configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Data Structures (Current Mock vs Planned AVL)

Currently, the application uses simple JavaScript arrays and objects within the `src/app/page.tsx` component state to manage product and price data:

```typescript
// Mock Data Structures in src/app/page.tsx
interface PriceEntry {
  id: string;
  productName: string;
  store: string;
  price: number;
}

interface LowestPriceInfo {
  store: string;
  price: number;
}

// Mock "Database" in src/app/page.tsx
const [allProducts, setAllProducts] = useState<PriceEntry[]>([]);
```

**Planned AVL Tree Implementation (Backend):**

The intention is to replace the mock data handling with a more efficient backend solution using C++.

- **AVL Tree:** A self-balancing binary search tree.
    - **Nodes:** Each node in the tree would likely represent a unique `productName`.
    - **Node Data:** Each node would store the `productName` as its key and potentially contain a list or other structure holding all `PriceEntry` objects for that product.
    - **Height Balancing Property:** The key feature of an AVL tree is that for every node, the height difference between its left and right subtrees is at most 1. This ensures the tree remains balanced.
    - **Rotations:** Insertions and deletions that violate the height property trigger rotations (single or double) to rebalance the tree, maintaining O(log N) height and thus O(log N) time complexity for search, insertion, and deletion operations (where N is the number of unique products).

**Operations (Mapped to Planned AVL):**

- **Add Product (`handleAddProduct`):**
    - Search for product node (O(log N)).
    - If exists, add `PriceEntry` to node's list.
    - If not exists, insert new node (O(log N)), which includes checking balance factors and performing rotations if necessary.
- **Search (`fetchSearchResults`):**
    - Search AVL tree for the node by `productName` (O(log N)).
    - Retrieve the list of `PriceEntry` from the node.
- **Delete Product by Name (`handleDeleteProductByName`):**
    - Search for the product node (O(log N)).
    - If found, perform AVL node deletion (O(log N)), including potential rotations for rebalancing.
- **Delete Single Entry (`handleDeleteSingleEntry`):**
    - Search for product node (O(log N)).
    - Remove entry from the node's list (O(K), K=entries for that product).
    - If the list becomes empty, potentially delete the node itself, triggering rebalancing (O(log N)).
- **Edit/Save (`handleSaveEdit`):**
    - If `productName` changes, involves deleting the old entry (potentially triggering rebalancing) and adding the new one (potentially triggering rebalancing).
    - If `productName` is unchanged, search for the node (O(log N)) and update the entry in the list (O(K)).

## Future Work

- Implement the Node.js Express backend API routes.
- Implement the AVL Tree data structure and associated logic in C++ (`cpp/price_tracker.cpp`).
- Integrate the Node.js backend with the compiled C++ executable (`child_process` or similar).
- Connect the React frontend to the backend API instead of using mock data.
- Implement robust error handling across all layers.
- Add unit and integration tests.
