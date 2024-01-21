const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".fact-list");

factsList.innerHTML = "";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function createFactsList(facts) {
  const htmlArr = facts.map(
    (fact) => `<li class="fact">
      <p>
      ${fact.fact}
        <a
          class="source"
          href=${fact.source}
          target="_blank"
          >(source)</a
        >
      </p>
      <span class="tag" style="background-color: ${
        CATEGORIES.find((cat) => cat.name == fact.category).color
      }"
        >${fact.category}</span
      >
      <div class="vote-buttons">
        <button>👍 ${fact.votes_liked}</button>
        <button>🤯 ${fact.votes_super_liked}</button>
        <button>⛔ ${fact.votes_false}</button>
      </div>
      </li>`
  );

  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

async function loadFacts() {
  const res = await fetch(
    "https://sbdmcssskjopdzodebej.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZG1jc3Nza2pvcGR6b2RlYmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzOTM4MTQsImV4cCI6MjAxOTk2OTgxNH0.ES5-LWAmQUAYqiP-sSfAdeHEhuh2ZI1Lk4ueR955ltk",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZG1jc3Nza2pvcGR6b2RlYmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzOTM4MTQsImV4cCI6MjAxOTk2OTgxNH0.ES5-LWAmQUAYqiP-sSfAdeHEhuh2ZI1Lk4ueR955ltk",
      },
    }
  );
  const data = await res.json();
  //   const filteredData = data.filter((fact) => fact.category == "history");
  createFactsList(data);
}

facts = loadFacts();
