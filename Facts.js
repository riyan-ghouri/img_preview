import fetch from "node-fetch";


// Array of facts about you
const myFacts = [
  "My name is Riyan.",
  "I am a developer who focuses on building modern web applications.",
  "I primarily work with JavaScript as my main programming language.",
  "I am experienced in React for building interactive user interfaces.",
  "I use Next.js to build full-stack web applications.",
  "I prefer JavaScript-only setups instead of TypeScript in most projects.",
  "I build backend APIs using Next.js App Router.",
  "I work with MongoDB as my primary database.",
  "I use Mongoose for data modeling and schema management.",
  "I am building AI-powered tools and applications.",
  "I am interested in vector databases and semantic search.",
  "I use embeddings to store and search information semantically.",
  "I work with Google Gemini for generating embeddings.",
  "I understand how cosine similarity works in vector search.",
  "I recently migrated from manual cosine search to MongoDB Atlas Vector Search.",
  "I care a lot about performance and API response times.",
  "I debug slow APIs by analyzing database queries and computation bottlenecks.",
  "I prefer doing heavy computation inside the database instead of JavaScript.",
  "I am building my own AI chatbot system.",
  "My chatbot learns from stored facts instead of hardcoded answers.",
  "I store knowledge sentence by sentence in a database.",
  "I understand the difference between training and retrieval-based AI.",
  "I use Retrieval-Augmented Generation (RAG) concepts in my projects.",
  "I am building an AI memory system for personal knowledge.",
  "I want my AI to answer questions based on my own data.",
  "I design APIs that accept natural language queries.",
  "I work with REST APIs using POST requests for search.",
  "I am familiar with server-side rendering and API routes in Next.js.",
  "I understand cold starts and performance issues in serverless environments.",
  "I aim to reduce API response time below 2 seconds.",
  "I plan to add caching to improve AI query speed.",
  "I prefer clean, readable, and maintainable code.",
  "I remove unnecessary logic when optimizing performance.",
  "I believe databases should do database work, not JavaScript loops.",
  "I test my APIs using real-world queries.",
  "I build projects to learn by doing, not just tutorials.",
  "I am interested in AI, automation, and developer tooling.",
  "I enjoy building systems from scratch.",
  "I value understanding how things work internally.",
  "I am building a project that combines AI and full-stack development.",
  "I am focused on learning production-level architecture.",
  "I care about scalability even in small projects.",
  "I prefer practical solutions over theoretical ones.",
  "I am building tools that feel fast and responsive.",
  "I am learning how vector search works under the hood.",
  "I use MongoDB Atlas for cloud-hosted databases.",
  "I understand how search indexes improve performance.",
  "I aim to build professional-grade software.",
  "I want my projects to stand out in a portfolio.",
  "I believe strong fundamentals matter more than frameworks.",
  "I enjoy solving hard technical problems.",
  "I am continuously improving my backend skills.",
  "I am working toward becoming a high-level full-stack developer."
];





async function saveFacts(facts) {
  for (const fact of facts) {
    try {
      const res = await fetch("http://localhost:3000/api/search/addDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fact })
      });
      const data = await res.json();
      console.log("Saved:", data);
    } catch (err) {
      console.error("Error saving fact:", fact, err);
    }
  }
}

// Call it
saveFacts(myFacts);
