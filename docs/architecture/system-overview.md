# Adhyayana System Architecture & Topology

> **Status**: Approved System Architecture  
> **Applies to**: Full Monorepo Topology  
> **Version**: 1.0.0  

---

## 1. High-Level Architectural Topology

Adhyayana is designed around a decoupled, three-tier architecture:

1. **Client Tier (`frontend/`)**: React 18 single-page application built with Vite, TypeScript (Strict), and Tailwind CSS.
2. **Algorithmic Evaluation Tier (`backend/`)**: High-performance Python 3.11+ FastAPI service responsible for vector arithmetic, semantic distance scoring, morphological decomposition, and validation.
3. **Identity & Storage Tier (Firebase)**: Firebase Authentication for identity management and Cloud Firestore for document persistence and real-time state synchronization.

```mermaid
graph TD
    User([Learner Browser]) -->|HTTPS / UI Events| FE[Frontend: React + Vite Client]
    
    subgraph Client Architecture
        FE --> AuthCtx[Auth Context & State]
        FE --> EngineHost[Puzzle Engine Host Container]
        EngineHost --> EnginePluggable[Pluggable Puzzle Engine e.g. Contexto]
    end
    
    subgraph Persistence & Identity Layer
        AuthCtx -->|Firebase Auth SDK| FBAuth[(Firebase Auth)]
        EngineHost -->|Firestore SDK Read/Write| Firestore[(Cloud Firestore)]
    end
    
    subgraph Algorithmic API Layer
        EnginePluggable -->|POST /api/v1/puzzles/.../guess Bearer Token| FastAPI[FastAPI Backend Service]
        FastAPI --> AuthMiddleware[Firebase Admin Auth Middleware]
        AuthMiddleware -->|Verify Token ID| FBAuth
        AuthMiddleware --> Router[Route Controllers]
        Router --> EngineRegistry[Engine Registry]
        EngineRegistry --> SpecificEngine[Engine Handler e.g. ContextoEngine]
        SpecificEngine --> Embeddings[(In-Memory Embeddings Cache)]
    end
```

---

## 2. Client-Server Boundaries & Responsibilities

| Responsibility Area | Client (`frontend/`) | Server (`backend/`) | Database (`Firestore`) |
| :--- | :--- | :--- | :--- |
| **Authentication UI** | Renders login/guest state, triggers popup/redirect | None (stateless JWT verification) | Stores user profiles |
| **Interactive Gameplay** | State machine (`IDLE` $\rightarrow$ `PLAYING` $\rightarrow$ `WON`), local inputs | None (pure evaluation response) | Persists completed results |
| **Similarity & Distance** | Displays rank progress bar & feedback | Computes cosine similarity, rank index | None |
| **Lexical Validation** | Immediate client format checking | Rigorous dictionary lookup, lemmatization | None |
| **Anti-Cheat Validation** | Obfuscates answer, never knows target | Holds secret solution / embedding target | Holds daily puzzle metadata |
| **Session Tracking** | Optimistic local updates | Validates session token & attempts | Atomic writes to `sessions` |

---

## 3. Authentication & Security Flow

Every request to protected backend endpoints enforces token verification via custom FastAPI dependency injection.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Frontend (Client)
    participant FBAuth as Firebase Authentication
    participant FastAPI as FastAPI Backend
    participant Firestore as Cloud Firestore

    User->>Frontend: Initiates login (Google OAuth or Guest)
    Frontend->>FBAuth: signInWithPopup() or signInAnonymously()
    FBAuth-->>Frontend: Returns UserCredential & ID Token (JWT)
    
    User->>Frontend: Submits Guess (e.g. "astronomy")
    Frontend->>FastAPI: POST /api/v1/puzzles/{id}/guess [Authorization: Bearer <ID_Token>]
    
    FastAPI->>FastAPI: AuthMiddleware extracts Bearer Token
    FastAPI->>FBAuth: firebase_admin.auth.verify_id_token(token)
    FBAuth-->>FastAPI: Decoded claims (uid, email, is_anonymous)
    
    FastAPI->>FastAPI: Look up puzzle target & calculate semantic distance
    FastAPI-->>Frontend: 200 OK: { rank: 42, similarity: 0.781, status: "PLAYING" }
    
    Frontend->>Firestore: updateDoc(sessionRef, { attempts: arrayUnion(...) })
    Frontend->>User: Renders animated proximity telemetry
```

### 3.1 Firebase Admin Verification Middleware
In `backend/app/core/auth.py`, FastAPI exposes a reusable dependency:
- Validates token expiration, issuer (`https://securetoken.google.com/<PROJECT_ID>`), and audience.
- Attaches the decoded `FirebaseUser` payload to `request.state.user`.
- Rejects missing, malformed, or expired tokens with standard 401 `StandardErrorResponse`.

---

## 4. Algorithmic vs Storage Separation

To ensure high responsiveness and horizontal scalability:
1. **The Backend is Stateless**:
   - The FastAPI backend does not store session state in a SQL database. It computes distances and verifies guesses against preloaded memory structures (e.g., semantic vectors, morphological trees).
2. **Firestore Handles Consistency**:
   - Game session checkpoints and user progress are synchronized directly from the client (or via webhook if server-side validation of full session history is mandated).
3. **Zero Secrets in Client**:
   - Target solutions and vector embeddings of upcoming daily puzzles are never transmitted to the client. The client sends a candidate word; the backend returns the rank and relative distance.
