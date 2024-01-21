import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCat, setCurrentCat] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);
        let query = supabase.from("facts").select("*");
        if (currentCat !== "all") {
          query = query.eq("category", currentCat);
        }
        const { data: facts, error } = await query;
        setIsLoading(false);

        if (!error) setFacts(facts);
        else alert("Problem in loading the data");
      }
      getFacts();
    },
    [currentCat]
  );

  return (
    <>
      {" "}
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        {" "}
        <CategoryFilter setCurrentCat={setCurrentCat} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p>Loading....</p>;
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="./logo.png" alt="Today I Learned Logo" />
        <h1>Today I Learned</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((showForm) => !showForm)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function CategoryFilter({ setCurrentCat }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-category"
            onClick={() => setCurrentCat("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((category) => (
          <li className="category" key={category.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: category.color }}
              onClick={() => setCurrentCat(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (text && source && category && textLength <= 200) {
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ fact: text, source, category }])
        .select();
      if (!error) {
        setFacts((facts) => [newFact[0], ...facts]);
      }
      setIsUploading(false);

      setText("");
      setSource("");
      setCategory("");
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      {" "}
      <input
        type="text"
        placeholder="Share a fact"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return <p>No Fact</p>;
  }
  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  async function handleVote(vote) {
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [vote]: fact[vote] + 1 })
      .eq("id", fact.id)
      .select();
    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {fact.fact}
        <a className="source" href={fact.source} target="_blank">
          (source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name == fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote("votes_liked")}>
          👍 {fact.votes_liked}
        </button>
        <button onClick={() => handleVote("votes_super_liked")}>
          🤯 {fact.votes_super_liked}
        </button>
        <button onClick={() => handleVote("votes_false")}>
          ⛔ {fact.votes_false}
        </button>
      </div>
    </li>
  );
}

export default App;
