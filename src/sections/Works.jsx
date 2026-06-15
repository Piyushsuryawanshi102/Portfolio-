import { Icon } from "@iconify/react/dist/iconify.js";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// GitHub language color mapping
const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

// Format date to relative time
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Format repo name for display
const formatRepoName = (name) => {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const GITHUB_USERNAME = "Piyushsuryawanshi102";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`;

const Works = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsContainerRef = useRef(null);

  const text = `GitHub Repositories`;

  // Fetch repos from GitHub API
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error("Failed to fetch repositories");
        const data = await response.json();

        // Filter out forks, sort by updated date
        const filtered = data
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        setRepos(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Animate cards on load
  useGSAP(() => {
    if (loading || repos.length === 0) return;

    const cards = document.querySelectorAll(".repo-card");
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 1 });

    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2,
    });
  }, [loading, repos]);

  return (
    <section id="work" className="flex flex-col min-h-screen">
      <AnimatedHeaderSection
        subTitle={"Open Source & Projects"}
        title={"Works"}
        text={text}
        textColor={"text-black"}
        withScrollTrigger={true}
      />

      <div className="px-6 sm:px-10 pb-24 mt-4">
        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Icon icon="lucide:alert-circle" className="size-10 text-DarkLava/50" />
            <p className="text-DarkLava/70 text-sm tracking-wide uppercase">
              Unable to load repositories
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs uppercase tracking-[0.2em] text-gold hover:text-black transition-colors duration-300 border-b border-gold hover:border-black pb-0.5"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              marginTop: "32px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(0,0,0,0.03)",
                  padding: "32px",
                  height: "240px",
                }}
              >
                <div style={{ height: "20px", width: "75%", background: "rgba(0,0,0,0.1)", borderRadius: "4px", marginBottom: "16px" }} />
                <div style={{ height: "12px", width: "100%", background: "rgba(0,0,0,0.05)", borderRadius: "4px", marginBottom: "8px" }} />
                <div style={{ height: "12px", width: "83%", background: "rgba(0,0,0,0.05)", borderRadius: "4px", marginBottom: "8px" }} />
                <div style={{ height: "12px", width: "66%", background: "rgba(0,0,0,0.05)", borderRadius: "4px" }} />
              </div>
            ))}
          </div>
        )}

        {/* Repos Grid */}
        {!loading && !error && (
          <div
            ref={cardsContainerRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
              marginTop: "32px",
            }}
          >
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="repo-card group"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(0,0,0,0.03)",
                  padding: "28px 32px",
                  cursor: "pointer",
                  transition: "all 0.5s ease",
                  overflow: "hidden",
                  position: "relative",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon
                      icon="lucide:folder-git-2"
                      style={{ width: "20px", height: "20px", color: "#cfa355", flexShrink: 0 }}
                    />
                    <h3 style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.3, margin: 0 }}>
                      {formatRepoName(repo.name)}
                    </h3>
                  </div>
                  <Icon
                    icon="lucide:arrow-up-right"
                    style={{ width: "18px", height: "18px", color: "#8b8b73", flexShrink: 0, marginTop: "2px" }}
                  />
                </div>

                {/* Description - fixed height */}
                <p style={{
                  fontSize: "13px",
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  margin: 0,
                  height: "66px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}>
                  {repo.description || "No description provided."}
                </p>

                {/* Spacer to push footer down */}
                <div style={{ flex: 1 }} />

                {/* Footer */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  marginTop: "20px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Language */}
                    {repo.language && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: languageColors[repo.language] || "#8b8b73",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: "11px", color: "rgba(57,54,50,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          {repo.language}
                        </span>
                      </div>
                    )}

                    {/* Stars */}
                    {repo.stargazers_count > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Icon icon="lucide:star" style={{ width: "14px", height: "14px", color: "#8b8b73" }} />
                        <span style={{ fontSize: "11px", color: "rgba(57,54,50,0.7)" }}>
                          {repo.stargazers_count}
                        </span>
                      </div>
                    )}

                    {/* Forks */}
                    {repo.forks_count > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Icon icon="lucide:git-fork" style={{ width: "14px", height: "14px", color: "#8b8b73" }} />
                        <span style={{ fontSize: "11px", color: "rgba(57,54,50,0.7)" }}>
                          {repo.forks_count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Updated date */}
                  <span style={{ fontSize: "10px", color: "#8b8b73", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {formatDate(repo.updated_at)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* View All on GitHub Link */}
        {!loading && !error && repos.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "56px" }}>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 32px",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.2)",
                background: "transparent",
                color: "black",
                textDecoration: "none",
                transition: "all 0.5s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "black";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "black";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
              }}
            >
              <Icon icon="mdi:github" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                View All on GitHub
              </span>
              <Icon icon="lucide:arrow-up-right" style={{ width: "16px", height: "16px" }} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Works;
