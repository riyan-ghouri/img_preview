// Array of facts about you
const myFacts = [
  "My name is Riyan.",
  "I am 17 years old.",
  "I love coding in React and Next.js.",
  "I enjoy building AI tools.",
  "My favorite language is JavaScript."
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
