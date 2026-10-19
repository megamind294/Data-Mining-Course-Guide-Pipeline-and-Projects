const tracks = [
  { id: 1, title: "Foundations", focus: "Python, Pandas & web scraping", description: "Start with the building blocks: collect public data, shape it into a useful dataset, and learn to spot patterns.", short: "Python, Pandas & scraping", color: "moss" },
  { id: 2, title: "APIs, Cleaning & Visualization", focus: "APIs, data cleaning & visualization", description: "Bring richer sources into your workflow, make messy data analysis-ready, and turn findings into clear visuals.", short: "APIs, cleaning & visualization", color: "clay" },
  { id: 3, title: "Dynamic Pages & Databases", focus: "Selenium, databases & pipelines", description: "Work with JavaScript-heavy sites, persist the data you collect, and connect collection with analysis.", short: "Selenium, databases & pipelines", color: "blue" },
  { id: 4, title: "Data Pipeline & Integration", focus: "Automation, storage & integration", description: "Move beyond one-off scripts: connect sources, standardize records, store results, and automate repeatable work.", short: "Automation & integration", color: "gold" },
  { id: 5, title: "Applied Data Mining", focus: "Real-world data mining", description: "Apply the full toolkit to market intelligence, public services, healthcare, education, and research.", short: "Real-world applications", color: "rose" }
];

const projects = [
  { id: "job-listings", track: 1, name: "Web Scraping of Job Listings", description: "Explore hiring demand by role, location, salary, and the skills employers request.", tags: ["Web scraping", "Pandas"], sample: "jobs", objective: "Find the roles and skills appearing most often across a sample of job listings." },
  { id: "news-headlines", track: 1, name: "News Headlines Analyzer", description: "Compare headline topics across publishers and discover the words appearing most often.", tags: ["Text analysis", "Frequency"], sample: "headlines", objective: "Compare publisher coverage and surface recurring words in a sample of headlines." },
  { id: "price-tracker", track: 1, name: "Product Price Tracker", description: "Follow sample product prices across dates and see how costs change over time.", tags: ["Web scraping", "Time series"], sample: "prices", objective: "Compare current sample prices and the price movement recorded over time." },
  { id: "weather-analysis", track: 1, name: "Weather Data Collection and Analysis", description: "Explore sample weather observations to compare temperature and rainfall by city.", tags: ["Public API", "Exploratory analysis"], sample: "weather", objective: "Summarize observed temperature and rainfall across cities in the sample." },
  { id: "public-health", track: 1, name: "Public Health Data Dashboard", description: "Turn sample public health records into a clear regional and time-based overview.", tags: ["Open data", "Dashboard"], sample: "health", objective: "Compare reported cases across health topics in the illustrative dataset." },
  { id: "social-trends", track: 2, name: "Social Media Trend Analysis", description: "Compare topic mentions and engagement in an illustrative social listening dataset.", tags: ["API data", "Engagement"], sample: "social", objective: "Identify the topics attracting the most mentions and interactions in the sample." },
  { id: "movie-insights", track: 2, name: "Movie Recommendation Insights", description: "Explore ratings and genres to understand what viewers like in sample movie data.", tags: ["Ratings", "Visualization"], sample: "movies", objective: "Compare average movie ratings across genres in the sample." },
  { id: "stock-mining", track: 2, name: "Stock Market Data Mining", description: "Review illustrative daily prices, volumes, and change to understand market movement.", tags: ["Market data", "Time series"], sample: "stocks", objective: "Summarize daily price observations and trading volume in the sample dataset." },
  { id: "review-sentiment", track: 2, name: "Online Review Sentiment Analysis", description: "Inspect sample customer reviews and their sentiment labels by product.", tags: ["Text analysis", "Reviews"], sample: "reviews", objective: "Compare the provided positive, neutral, and negative review labels." },
  { id: "academic-publications", track: 2, name: "Academic Publication Mining", description: "Explore publication topics, years, authors, and citations in a sample research catalog.", tags: ["Research", "Trend analysis"], sample: "papers", objective: "Find the most frequent research topics in the illustrative publication sample." },
  { id: "realtime-monitor", track: 3, name: "Real-Time Web Data Monitoring System", description: "Inspect timestamped sample observations and identify monitored sources and changes.", tags: ["Monitoring", "Database"], sample: "monitor", objective: "Review recent metric observations by source in this static sample." },
  { id: "selenium-scraper", track: 3, name: "Dynamic Content Scraper with Selenium", description: "Explore sample records shaped like paginated dynamic content and inspect their categories.", tags: ["Selenium", "Dynamic pages"], sample: "scraped", objective: "Inspect the sample records and category distribution from a dynamic-page workflow." },
  { id: "price-comparison", track: 3, name: "Web-Based Price Comparison Engine", description: "Compare sample vendor listings and find the lowest price for each product.", tags: ["Normalization", "Comparison"], sample: "vendors", objective: "Compare each product across vendors and surface the cheapest listed option." },
  { id: "news-recommendations", track: 3, name: "News Article Recommendation System", description: "Explore sample articles grouped by topic to see how a topic-based recommender can work.", tags: ["Clustering", "Recommendations"], sample: "articles", objective: "Group the sample articles by topic to demonstrate a simple recommendation signal." },
  { id: "fake-news", track: 3, name: "Fake News Detection Using Web-Mined Data", description: "Review a labeled sample dataset and examine the distribution of its example classes.", tags: ["NLP", "Classification"], sample: "labeledNews", objective: "Inspect example class balance; labels are illustrative and are not fact checks." },
  { id: "automated-pipeline", track: 4, name: "Automated Web Data Pipeline", description: "Follow sample pipeline runs through collection, validation, and data quality checks.", tags: ["Automation", "Logging"], sample: "pipeline", objective: "Compare sample pipeline run volume and quality results." },
  { id: "web-to-sql", track: 4, name: "Web Data to SQL Database System", description: "Explore example records prepared for storage and analysis in a relational database.", tags: ["SQL", "Data integration"], sample: "sql", objective: "Summarize the sample records by data source and inspect storage-ready fields." },
  { id: "api-aggregation", track: 4, name: "API Aggregation Platform", description: "Review sample records from multiple APIs and compare their values and source coverage.", tags: ["APIs", "Integration"], sample: "aggregation", objective: "Compare contributed records by API source in this mock aggregation." },
  { id: "market-intelligence", track: 5, name: "Large-Scale Web Data Mining for Market Intelligence", description: "Explore sample products, prices, and reviews to see how market signals can be combined.", tags: ["Market intelligence", "Reviews"], sample: "market", objective: "Compare products using sample price and review signals." },
  { id: "smart-cities", track: 5, name: "Open Data Mining for Smart Cities", description: "Explore illustrative traffic, air quality, and energy indicators across city districts.", tags: ["Open data", "Smart cities"], sample: "cities", objective: "Compare sample city districts across traffic, air-quality, and energy measures." },
  { id: "healthcare-mining", track: 5, name: "Healthcare Web Data Mining System", description: "Inspect fictional healthcare indicators for careful, high-level trend exploration.", tags: ["Healthcare", "Public data"], sample: "healthcare", objective: "Compare illustrative hospital indicators; this is not medical advice or actual health data." },
  { id: "education-analytics", track: 5, name: "Education Analytics Using Web-Mined Data", description: "Explore example enrollment, completion, and course data to find education patterns.", tags: ["Education", "Analytics"], sample: "education", objective: "Compare sample enrollment by course and inspect completion outcomes." },
  { id: "research-trends", track: 5, name: "Research Trend Detection System", description: "Explore a sample publication timeline and identify topics gaining attention.", tags: ["Research", "Topic trends"], sample: "trends", objective: "Compare sample publication counts by research topic and year." }
];

const samples = {
  jobs: [["Role","Company","Location","Skills","Salary"],["Data Analyst","Northstar Labs","London","SQL, Python, Tableau","52000"],["Data Engineer","Cedar Works","Manchester","Python, Spark, SQL","68000"],["BI Analyst","Field & Co","London","Power BI, SQL, Excel","49000"],["Junior Data Scientist","Brightwave","Bristol","Python, Pandas, scikit-learn","46000"],["Analytics Engineer","Northstar Labs","Leeds","dbt, SQL, Python","61000"],["Research Analyst","Common Ground","Bristol","R, Excel, statistics","43000"]],
  headlines: [["Headline","Publisher","Topic","Date"],["City council approves new clean transit plan","The Daily Ledger","Environment","2026-06-12"],["Researchers map a path to cleaner urban air","Open Journal","Science","2026-06-12"],["Markets steady as local makers report growth","Market Brief","Business","2026-06-11"],["How neighbourhood gardens are changing city life","The Daily Ledger","Community","2026-06-10"],["New research tracks city air quality over time","Open Journal","Science","2026-06-09"]],
  prices: [["Product","Price","Vendor","Date"],["Ceramic pour-over set","32.50","North Goods","2026-06-08"],["Ceramic pour-over set","29.00","Everyday Market","2026-06-10"],["Linen market tote","18.00","North Goods","2026-06-08"],["Linen market tote","20.50","Everyday Market","2026-06-10"],["Desk light, oak","74.00","North Goods","2026-06-11"],["Desk light, oak","69.00","Everyday Market","2026-06-12"]],
  weather: [["Date","City","Temperature C","Rainfall mm"],["2026-06-10","Bristol","18","2.4"],["2026-06-10","Leeds","16","0.8"],["2026-06-11","Bristol","20","0"],["2026-06-11","Leeds","17","1.2"],["2026-06-12","Bristol","19","3.1"],["2026-06-12","Leeds","18","0.4"]],
  health: [["Date","Region","Topic","Cases"],["2026-06","North","Seasonal flu","48"],["2026-06","South","Seasonal flu","37"],["2026-06","East","Seasonal flu","42"],["2026-06","North","Respiratory health","22"],["2026-06","South","Respiratory health","29"],["2026-06","East","Respiratory health","18"]],
  social: [["Date","Topic","Mentions","Engagement"],["2026-06-10","urban gardens","184","642"],["2026-06-10","clean transit","216","804"],["2026-06-11","urban gardens","231","921"],["2026-06-11","clean transit","198","755"],["2026-06-12","local food","176","588"],["2026-06-12","clean transit","263","1012"]],
  movies: [["Title","Genre","Rating","Votes"],["The Quiet Map","Drama","8.1","1240"],["Orbit of Us","Sci-Fi","7.8","2180"],["A Sunday Table","Comedy","7.4","840"],["Small Hours","Drama","8.5","1920"],["Glass Harbor","Mystery","7.9","1350"],["Blue Hour","Sci-Fi","8.2","2670"]],
  stocks: [["Date","Symbol","Close","Volume"],["2026-06-08","NOVA","104.20","824000"],["2026-06-09","NOVA","105.80","913000"],["2026-06-10","NOVA","103.40","1050000"],["2026-06-11","NOVA","107.10","987000"],["2026-06-12","NOVA","108.60","1102000"]],
  reviews: [["Product","Rating","Sentiment","Review"],["Trail mug","5","Positive","Keeps coffee warm on the early train."],["Trail mug","4","Positive","Good build and comfortable to hold."],["Canvas pack","3","Neutral","Nice shape but smaller than I expected."],["Desk lamp","2","Negative","The switch feels flimsy after a week."],["Canvas pack","5","Positive","Lightweight and just right for day trips."],["Desk lamp","4","Positive","Warm light and simple to assemble."]],
  papers: [["Title","Year","Author","Topic","Citations"],["Mapping equitable urban mobility","2023","A. Patel","Smart cities","42"],["Efficient models for climate data","2024","J. Kim","Climate","67"],["Open datasets for public health","2024","R. Morgan","Public health","51"],["A review of urban mobility tools","2025","L. Chen","Smart cities","28"],["Forecasting with transparent methods","2025","S. Adeyemi","Machine learning","73"],["Research data stewardship in practice","2026","M. Rossi","Open science","19"]],
  monitor: [["Timestamp","Source","Metric","Value"],["2026-06-12 09:00","Catalog A","New records","128"],["2026-06-12 10:00","Catalog A","New records","134"],["2026-06-12 09:00","Portal B","Response ms","412"],["2026-06-12 10:00","Portal B","Response ms","387"],["2026-06-12 11:00","Catalog A","New records","141"]],
  scraped: [["Page","Title","Category","Price"],["/catalog/field-kit","Field notebook","Stationery","12.00"],["/catalog/field-kit","Canvas pencil case","Stationery","18.00"],["/catalog/desk-light","Oak desk lamp","Lighting","74.00"],["/catalog/desk-light","Reading light","Lighting","42.00"],["/catalog/travel-mug","Insulated travel mug","Kitchen","28.00"]],
  vendors: [["Product","Vendor","Price","Currency"],["Field notebook","North Goods","12.00","GBP"],["Field notebook","Paper House","10.50","GBP"],["Field notebook","Supply Studio","11.25","GBP"],["Oak desk lamp","North Goods","74.00","GBP"],["Oak desk lamp","Paper House","79.00","GBP"],["Oak desk lamp","Supply Studio","69.50","GBP"]],
  articles: [["Title","Topic","Publisher","Date"],["New cycle routes connect the east and west","Transport","City Journal","2026-06-12"],["A guide to growing herbs on a balcony","Gardening","Common Life","2026-06-12"],["What the new bus network means for commuters","Transport","City Journal","2026-06-11"],["Five pollinator-friendly plants for small spaces","Gardening","Common Life","2026-06-10"],["The science behind healthier city streets","Urban health","Open Review","2026-06-09"]],
  labeledNews: [["Headline","Outlet","Example label","Topic"],["Community group opens new learning centre","Local Wire","Reliable example","Community"],["Unverified post makes dramatic health claim","Viral Desk","Needs review","Health"],["Transport agency publishes annual report","Public Brief","Reliable example","Transport"],["Anonymous source alleges secret city project","Viral Desk","Needs review","Community"],["University shares peer-reviewed climate study","Research Daily","Reliable example","Science"]],
  pipeline: [["Run date","Source","Records","Quality score"],["2026-06-10","Open Catalog","1240","0.97"],["2026-06-10","City API","840","0.94"],["2026-06-11","Open Catalog","1318","0.98"],["2026-06-11","City API","902","0.91"],["2026-06-12","Open Catalog","1401","0.96"],["2026-06-12","City API","927","0.95"]],
  sql: [["Record ID","Source","Category","Value","Loaded"],["R-001","Open Catalog","Transit","82","2026-06-12"],["R-002","City API","Environment","71","2026-06-12"],["R-003","Open Catalog","Transit","91","2026-06-11"],["R-004","Research API","Health","64","2026-06-11"],["R-005","City API","Environment","78","2026-06-10"]],
  aggregation: [["Date","API source","Topic","Records"],["2026-06-10","Open Library","Climate","42"],["2026-06-10","City Open Data","Transport","76"],["2026-06-11","Open Library","Health","51"],["2026-06-11","Research Index","Climate","38"],["2026-06-12","City Open Data","Transport","88"],["2026-06-12","Research Index","Education","29"]],
  market: [["Product","Category","Price","Rating"],["Field notebook","Stationery","12.00","4.7"],["Canvas tote","Accessories","22.50","4.5"],["Insulated mug","Kitchen","28.00","4.8"],["Desk lamp","Home","69.50","4.2"],["Canvas tote","Accessories","19.00","4.3"],["Insulated mug","Kitchen","31.00","4.6"]],
  cities: [["District","Date","Traffic index","Air quality PM2.5","Energy MWh"],["Riverside","2026-06","42","8.2","124"],["Old Town","2026-06","67","11.4","183"],["Parkside","2026-06","28","6.7","98"],["East Quarter","2026-06","74","13.1","211"],["Riverside","2026-05","46","9.1","130"],["Old Town","2026-05","63","10.8","177"]],
  healthcare: [["Hospital","Month","Admissions","Wait days"],["Riverside General","2026-04","1280","6.2"],["North Clinic","2026-04","840","4.1"],["Riverside General","2026-05","1334","5.8"],["North Clinic","2026-05","891","3.9"],["West Community","2026-05","672","4.8"],["West Community","2026-06","701","4.5"]],
  education: [["Course","Term","Enrollments","Completion rate"],["Intro to Data","Spring 2026","184","0.84"],["Urban Ecology","Spring 2026","126","0.91"],["Intro to Data","Autumn 2025","162","0.82"],["Public Policy Lab","Spring 2026","98","0.88"],["Urban Ecology","Autumn 2025","114","0.89"],["Public Policy Lab","Autumn 2025","87","0.86"]],
  trends: [["Year","Topic","Publications","Example keyword"],["2022","Responsible AI","84","transparency"],["2023","Responsible AI","113","governance"],["2024","Responsible AI","157","evaluation"],["2022","Climate adaptation","72","resilience"],["2023","Climate adaptation","96","cities"],["2024","Climate adaptation","131","planning"],["2024","Open science","105","reproducibility"]]
};

const app = document.querySelector("#app");
const trackNav = document.querySelector("#track-nav");
const breadcrumb = document.querySelector("#breadcrumbs");
const toastElement = document.querySelector("#toast");
const state = { page: "home", track: null, project: null, rows: [], headers: [], result: null, search: "" };
let toastTimeout;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function currentTrack(id) {
  return tracks.find((track) => track.id === id);
}

function renderTrackNav() {
  trackNav.innerHTML = tracks.map((track) => `
    <button class="track-link ${state.track === track.id ? "is-selected" : ""}" data-track="${track.id}" type="button" aria-label="Open track ${track.id}: ${escapeHtml(track.title)}">
      <span class="track-number">0${track.id}</span><span class="track-name">${escapeHtml(track.title)}</span><span class="track-size">${projects.filter((p) => p.track === track.id).length}</span>
    </button>`).join("");
}

function updateBreadcrumb() {
  const track = state.track ? currentTrack(state.track) : null;
  const project = state.project;
  breadcrumb.innerHTML = project
    ? `<span>Projects</span><b>/</b><span>${escapeHtml(track.title)}</span><b>/</b><strong>${escapeHtml(project.name)}</strong>`
    : track
      ? `<span>Projects</span><b>/</b><strong>${escapeHtml(track.title)}</strong>`
      : `<span>Workspace</span><b>/</b><strong>${state.page === "overview" ? "Overview" : "Project library"}</strong>`;
}

function navigateTrack(trackId) {
  state.page = "track";
  state.track = trackId;
  state.project = null;
  state.search = "";
  render();
  window.scrollTo(0, 0);
}

function openProject(projectId) {
  const project = projects.find((candidate) => candidate.id === projectId);
  if (!project) return;
  state.page = "workspace";
  state.track = project.track;
  state.project = project;
  state.headers = samples[project.sample][0];
  state.rows = samples[project.sample].slice(1).map((row) => [...row]);
  state.result = null;
  render();
  window.scrollTo(0, 0);
  runAnalysis();
}

function renderHome() {
  const totalProjects = projects.length;
  const selectedProjects = state.search.trim()
    ? projects.filter((project) => `${project.name} ${project.description} ${project.tags.join(" ")}`.toLowerCase().includes(state.search.trim().toLowerCase()))
    : projects;
  app.innerHTML = `
    <div class="hero-row">
      <div><div class="eyebrow">THE FIELD GUIDE · 2026 EDITION</div><h1 class="page-title">Good questions start<br>with good data.</h1><p class="page-description">A hands-on guide to finding, shaping, and understanding data from the open web. Choose a learning track, then open any project to explore its workflow.</p></div>
      <div class="hero-stats"><div class="hero-stat"><strong>05</strong><span>Learning tracks</span></div><i class="stat-divider"></i><div class="hero-stat"><strong>${totalProjects}</strong><span>Project ideas</span></div><i class="stat-divider"></i><div class="hero-stat"><strong>01</strong><span>Workspace</span></div></div>
    </div>
    <div class="section-heading"><h2>Choose your learning track</h2><span>01 — 05</span></div>
    <div class="tracks-grid">${tracks.map((track) => `
      <button class="track-card ${track.color}" data-track="${track.id}" type="button">
        <span class="card-topline"><span class="card-number">TRACK 0${track.id}</span><span class="card-arrow">↗</span></span>
        <h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(track.short)}</p>
        <span class="card-count">${projects.filter((project) => project.track === track.id).length} projects&nbsp; →</span>
      </button>`).join("")}</div>
    <div class="section-heading"><h2>Project library</h2><span>ALL ${String(totalProjects).padStart(2, "0")} PROJECTS</span></div>
    <section class="library-panel" aria-label="All projects">
      <div class="library-panel-head"><h2>Browse projects</h2><label class="search-control"><span aria-hidden="true">⌕</span><input id="project-search" type="search" aria-label="Search projects" placeholder="Search projects" value="${escapeHtml(state.search)}"></label></div>
      <div class="project-list">${selectedProjects.length ? selectedProjects.map((project, index) => `
        <button class="project-row" data-project="${project.id}" type="button">
          <span class="project-index">${String(index + 1).padStart(2,"0")}</span><span class="project-row-copy"><strong>${escapeHtml(project.name)}</strong><small>Track 0${project.track} · ${escapeHtml(project.tags.join(" / "))}</small></span><span class="row-arrow">↗</span>
        </button>`).join("") : `<div class="empty-dataset">No projects match that search.</div>`}</div>
    </section>`;
}

function renderTrack() {
  const track = currentTrack(state.track);
  const trackProjects = projects.filter((project) => project.track === track.id);
  app.innerHTML = `
    <div class="track-page-head"><div><div class="eyebrow">LEARNING TRACK · 0${track.id}</div><h1 class="page-title">${escapeHtml(track.title)}</h1><p class="page-description">${escapeHtml(track.description)}</p><span class="track-focus">${escapeHtml(track.focus)}</span></div><button class="back-button" data-action="home" type="button">← &nbsp; All tracks</button></div>
    <div class="section-heading"><h2>Projects in this track</h2><span>${String(trackProjects.length).padStart(2,"0")} PROJECTS</span></div>
    <div class="track-project-grid">${trackProjects.map((project, index) => `
      <button class="track-project-card" data-project="${project.id}" type="button">
        <span class="project-index">${String(index + 1).padStart(2,"0")} &nbsp; / &nbsp; TRACK 0${track.id}</span>
        <h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.description)}</p><span class="open-label">OPEN WORKSPACE &nbsp; ↗</span>
      </button>`).join("")}</div>`;
}

function renderWorkspace() {
  const project = state.project;
  const track = currentTrack(project.track);
  const fileInputId = "csv-upload";
  app.innerHTML = `
    <div class="workspace-top">
      <div><div class="eyebrow">PROJECT WORKSPACE · TRACK 0${track.id}</div><h1 class="page-title">${escapeHtml(project.name)}</h1><p class="page-description">${escapeHtml(project.description)}</p>
        <div class="workspace-meta"><span class="tag green">SAMPLE WORKFLOW</span>${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
      <button class="launch-button" id="run-analysis" type="button"><span aria-hidden="true">▶</span> Run analysis</button>
    </div>
    <div class="workspace-grid">
      <section class="panel data-panel" aria-label="Project data">
        <div class="panel-heading"><h2>Working dataset</h2><span>LOCAL DEMO DATA</span></div>
        <div class="data-toolbar"><span class="data-count" id="data-count"></span><div class="toolbar-actions"><label class="subtle-button" for="${fileInputId}">↑ &nbsp; Upload CSV<input id="${fileInputId}" type="file" accept=".csv,text/csv"></label><button class="subtle-button" data-action="sample" type="button">Reset sample</button></div></div>
        <div class="table-scroll" id="table-container"></div>
        <div class="drop-hint">Your file stays in this browser tab. Upload a CSV with a header row to analyze your own data.</div>
      </section>
      <section class="panel insight-panel" aria-label="Analysis metrics">
        <div class="panel-heading"><h2>At a glance</h2><span>DATA CHECK</span></div>
        <div class="insight-intro">An initial read of the active dataset. Upload your own CSV or run the project to refresh the analysis.</div>
        <div class="metric-stack" id="metrics"><div class="empty-dataset">Run an analysis to see the data checks.</div></div>
        <div class="insight-callout">${escapeHtml(project.objective)}</div>
      </section>
    </div>
    <div class="results-grid">
      <section class="panel"><div class="panel-heading"><h2>Explore a relationship</h2><span id="chart-caption">RUN ANALYSIS TO BUILD A VIEW</span></div><div class="chart-wrap" id="chart"><div class="chart-empty">Run the analysis to build a quick comparison from this dataset.</div></div></section>
      <section class="panel"><div class="panel-heading"><h2>Project notes</h2><span>READ THE SIGNAL</span></div><div class="summary-body" id="summary"><p>Run the project to create a summary of this sample dataset.</p><p>Sample records are illustrative; connect a real public data source in your own implementation for research use.</p></div></section>
    </div>`;
  renderTable();
}

function renderOverview() {
  app.innerHTML = `
    <div class="eyebrow">YOUR FIELD GUIDE</div><h1 class="page-title">Overview</h1><p class="page-description">A single studio for learning how data moves from a source to a useful insight.</p>
    <section class="overview-banner"><div class="eyebrow">FROM FIRST SCRAPE TO REAL-WORLD INSIGHT</div><h2>Five tracks. Twenty-three ways to get curious.</h2><p>Pick a track to see its projects. Every project opens in a shared workspace with an example dataset, a quick analysis, and the option to upload your own CSV.</p></section>
    <div class="overview-metrics"><div class="overview-metric"><strong>05</strong><span>CONNECTED LEARNING TRACKS</span></div><div class="overview-metric"><strong>23</strong><span>PROJECT WORKSPACES</span></div><div class="overview-metric"><strong>CSV</strong><span>BRING YOUR OWN DATA</span></div></div>
    <div class="section-heading"><h2>Learning tracks</h2><span>SELECT A TRACK TO BEGIN</span></div><div class="tracks-grid">${tracks.map((track) => `<button class="track-card" data-track="${track.id}" type="button"><span class="card-topline"><span class="card-number">TRACK 0${track.id}</span><span class="card-arrow">↗</span></span><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(track.short)}</p><span class="card-count">${projects.filter((project) => project.track === track.id).length} projects&nbsp; →</span></button>`).join("")}</div>`;
}

function renderTable() {
  const container = document.querySelector("#table-container");
  const count = document.querySelector("#data-count");
  if (!container || !count) return;
  count.textContent = `${state.rows.length} ROWS · ${state.headers.length} COLUMNS`;
  if (!state.headers.length) {
    container.innerHTML = '<div class="empty-dataset">This CSV has no columns to display.</div>';
    return;
  }
  const visibleRows = state.rows.slice(0, 9);
  container.innerHTML = `<table class="data-table"><thead><tr>${state.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${visibleRows.map((row) => `<tr>${state.headers.map((_, column) => `<td title="${escapeHtml(row[column] ?? "")}">${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table>${state.rows.length > visibleRows.length ? `<div class="drop-hint">Showing 9 of ${state.rows.length} records.</div>` : ""}`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  if (quoted) throw new Error("The CSV contains an unclosed quoted field.");
  if (rows.length < 2) throw new Error("The CSV needs a header row and at least one data row.");
  const headers = rows[0].map((header, index) => header.trim() || `Column ${index + 1}`);
  const data = rows.slice(1).map((values) => headers.map((_, index) => (values[index] ?? "").trim()));
  return { headers, rows: data };
}

function calculateMetrics(headers, rows) {
  const totalCells = headers.length * rows.length;
  const filledCells = rows.reduce((total, row) => total + headers.reduce((filled, _, index) => filled + (String(row[index] ?? "").trim() ? 1 : 0), 0), 0);
  const numericColumn = headers.findIndex((_, index) => rows.filter((row) => row[index] !== "" && Number.isFinite(Number(row[index]))).length > Math.max(1, rows.length * .55));
  const categoryColumn = headers.findIndex((_, index) => index !== numericColumn && rows.some((row) => row[index] && !Number.isFinite(Number(row[index])) && !/^\d{4}[-/]\d{1,2}/.test(row[index])) && new Set(rows.map((row) => row[index]).filter(Boolean)).size <= Math.max(12, rows.length * .7));
  const numbers = numericColumn < 0 ? [] : rows.map((row) => Number(row[numericColumn])).filter(Number.isFinite);
  const categories = categoryColumn < 0 ? [] : [...new Set(rows.map((row) => row[categoryColumn]).filter(Boolean))];
  return {
    completeness: totalCells ? Math.round(filledCells / totalCells * 100) : 0,
    numericColumn,
    categoryColumn,
    numbers,
    categories,
    mean: numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null,
    sum: numbers.length ? numbers.reduce((sum, value) => sum + value, 0) : null
  };
}

function summarizeDomain(project, headers, rows, metrics) {
  const text = (value) => String(value ?? "").trim();
  const findHeader = (pattern) => headers.findIndex((header) => pattern.test(header));
  const findNumeric = (pattern) => {
    const column = findHeader(pattern);
    if (column < 0) return [];
    return rows.map((row) => Number(text(row[column]).replace(/[^0-9.-]/g, ""))).filter(Number.isFinite);
  };
  const bullets = [];
  let chartValues = [];
  let chartTitle = "Most common values";
  const projectId = project.id;
  if (["review-sentiment","fake-news"].includes(projectId)) {
    const labelColumn = findHeader(/sentiment|example label|label|class/i);
    if (labelColumn >= 0) {
      const labels = new Map();
      rows.forEach((row) => {
        const label = text(row[labelColumn]);
        if (label) labels.set(label, (labels.get(label) ?? 0) + 1);
      });
      chartValues = [...labels.entries()].sort((left, right) => right[1] - left[1]).slice(0, 7);
      chartTitle = `Records by ${headers[labelColumn]}`;
      if (chartValues.length) bullets.push(`“${chartValues[0][0]}” is the most common label in the supplied sample.`);
    }
  } else if (["job-listings","news-headlines"].includes(projectId)) {
    const textColumn = findHeader(/skill|headline|review|title/i);
    if (textColumn >= 0) {
      const frequencies = new Map();
      rows.forEach((row) => text(row[textColumn]).toLowerCase().match(/[a-z][a-z+#.-]{2,}/g)?.forEach((word) => {
        if (!["with","from","that","this","your","into","over","most","have","will","their","after","about"].includes(word)) frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
      }));
      chartValues = [...frequencies.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
      chartTitle = "Most frequent terms";
      if (chartValues.length) bullets.push(`“${chartValues.slice(0, 3).map(([word]) => word).join("”, “")}” are the most repeated terms in the selected text.`);
    }
  }
  if (["price-tracker","price-comparison","market-intelligence"].includes(projectId)) {
    const productCol = findHeader(/product|item/i);
    const priceCol = findHeader(/price|cost/i);
    const dateCol = findHeader(/date|time/i);
    if (projectId === "price-tracker" && dateCol >= 0 && priceCol >= 0) {
      const prices = new Map();
      rows.forEach((row) => {
        const date = text(row[dateCol]);
        const price = Number(text(row[priceCol]).replace(/[^0-9.-]/g, ""));
        if (date && Number.isFinite(price)) {
          const values = prices.get(date) ?? [];
          values.push(price);
          prices.set(date, values);
        }
      });
      chartValues = [...prices.entries()].map(([date, values]) => [date, values.reduce((sum, value) => sum + value, 0) / values.length]).sort((left, right) => left[0].localeCompare(right[0])).slice(0, 7);
      chartTitle = `Average ${headers[priceCol]} by ${headers[dateCol]}`;
      if (chartValues.length) bullets.push(`The sample contains price observations across ${chartValues.length} dates.`);
    } else if (productCol >= 0 && priceCol >= 0) {
      const prices = new Map();
      rows.forEach((row) => {
        const value = Number(text(row[priceCol]).replace(/[^0-9.-]/g, ""));
        if (text(row[productCol]) && Number.isFinite(value)) {
          const list = prices.get(text(row[productCol])) ?? [];
          list.push(value);
          prices.set(text(row[productCol]), list);
        }
      });
      chartValues = [...prices.entries()].map(([name, values]) => [name, projectId === "price-comparison" ? Math.min(...values) : values.reduce((a, b) => a + b, 0) / values.length]).sort((a, b) => projectId === "price-comparison" ? a[1] - b[1] : b[1] - a[1]).slice(0, 7);
      chartTitle = projectId === "price-comparison" ? "Lowest listed price by product" : "Average price by product";
      if (chartValues.length) bullets.push(`${chartValues[0][0]} has the ${projectId === "price-comparison" ? "lowest listed" : "highest average"} price in this sample.`);
    }
  }
  if (["weather-analysis","public-health","healthcare-mining","smart-cities","education-analytics","movie-insights","social-trends","academic-publications","research-trends","news-recommendations","selenium-scraper","api-aggregation","automated-pipeline","web-to-sql","realtime-monitor","stock-mining"].includes(projectId)) {
    const preferred = {
      "weather-analysis": /city/i, "public-health": /topic|disease/i, "healthcare-mining": /hospital/i,
      "smart-cities": /district/i, "education-analytics": /course/i, "movie-insights": /genre/i,
      "social-trends": /topic/i, "academic-publications": /topic/i, "research-trends": /topic/i,
      "news-recommendations": /topic/i, "selenium-scraper": /category/i, "api-aggregation": /api source/i,
      "automated-pipeline": /source/i, "web-to-sql": /source/i, "realtime-monitor": /source/i,
      "stock-mining": /date/i
    }[projectId];
    const chosen = findHeader(preferred);
    const numberPattern = {
      "weather-analysis": /temperature/i, "public-health": /cases/i, "healthcare-mining": /admissions/i,
      "smart-cities": /traffic/i, "education-analytics": /enrollments/i, "movie-insights": /rating/i,
      "social-trends": /mentions/i, "academic-publications": /citations/i, "research-trends": /publications/i,
      "news-recommendations": null, "selenium-scraper": /price/i, "api-aggregation": /records/i,
      "automated-pipeline": /records/i, "web-to-sql": /value/i, "realtime-monitor": /value/i,
      "stock-mining": /close/i
    }[projectId];
    const numCol = numberPattern ? findHeader(numberPattern) : -1;
    if (chosen >= 0) {
      const aggregations = new Map();
      rows.forEach((row) => {
        const label = text(row[chosen]);
        if (!label) return;
        const numeric = numCol >= 0 ? Number(text(row[numCol]).replace(/[^0-9.-]/g, "")) : 1;
        if (!Number.isFinite(numeric)) return;
        const item = aggregations.get(label) ?? { total: 0, count: 0 };
        item.total += numeric;
        item.count += 1;
        aggregations.set(label, item);
      });
      chartValues = [...aggregations.entries()].map(([label, value]) => [label, numCol >= 0 ? value.total / value.count : value.count]).sort((a, b) => b[1] - a[1]).slice(0, 7);
      chartTitle = numCol >= 0 ? `Average ${headers[numCol]} by ${headers[chosen]}` : `Records by ${headers[chosen]}`;
      if (chartValues.length) bullets.push(`${chartValues[0][0]} ranks highest in this sample by ${numCol >= 0 ? `average ${headers[numCol].toLowerCase()}` : "record count"}.`);
    }
  }
  if (!chartValues.length && metrics.categoryColumn >= 0) {
    const counts = new Map();
    rows.forEach((row) => {
      const label = text(row[metrics.categoryColumn]);
      if (label) counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    chartValues = [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 7);
    chartTitle = `Records by ${headers[metrics.categoryColumn]}`;
  }
  const currencyColumn = findHeader(/price|cost|salary/i);
  const currencyValues = currencyColumn < 0 ? [] : findNumeric(/price|cost|salary/i);
  const average = currencyValues.length ? currencyValues.reduce((sum, value) => sum + value, 0) / currencyValues.length : metrics.mean;
  if (average !== null && !chartValues.length) bullets.push(`The average of the first numeric field, ${headers[metrics.numericColumn]}, is ${average.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`);
  if (projectId === "fake-news") bullets.push("Example labels show a dataset category, not a verified judgement about whether a story is true.");
  if (projectId === "healthcare-mining") bullets.push("These fictional demo values are for data-practice only and should not inform healthcare decisions.");
  if (!bullets.length) bullets.push("Review the displayed records and field completeness before drawing conclusions from the dataset.");
  return { chartValues, chartTitle, bullets, average };
}

function runAnalysis() {
  if (!state.project || !state.headers.length) {
    showToast("Add a CSV with a header and at least one data row before analyzing.");
    return;
  }
  const metrics = calculateMetrics(state.headers, state.rows);
  const domain = summarizeDomain(state.project, state.headers, state.rows, metrics);
  state.result = { metrics, domain };
  const metricRows = [
    ["Records", state.rows.length.toLocaleString()],
    ["Fields", state.headers.length.toLocaleString()],
    ["Complete cells", `${metrics.completeness}%`]
  ];
  if (metrics.mean !== null) metricRows.push([`Avg. ${state.headers[metrics.numericColumn]}`, metrics.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })]);
  const metricsElement = document.querySelector("#metrics");
  if (metricsElement) metricsElement.innerHTML = metricRows.map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  const caption = document.querySelector("#chart-caption");
  const chart = document.querySelector("#chart");
  if (caption) caption.textContent = domain.chartTitle.toUpperCase();
  if (chart) {
    if (!domain.chartValues.length) {
      chart.innerHTML = '<div class="chart-empty">No clear category or numeric field was found for a quick comparison. Try a CSV with a category column and numeric values.</div>';
    } else {
      const max = Math.max(...domain.chartValues.map(([, value]) => Number(value) || 0), 1);
      chart.innerHTML = `<div class="chart">${domain.chartValues.map(([label, value]) => `<div class="chart-row"><span class="chart-label" title="${escapeHtml(label)}">${escapeHtml(label)}</span><div class="chart-track"><div class="chart-bar" style="width:${Math.max(2, (Number(value) || 0) / max * 100)}%"></div></div><span class="chart-value">${Number(value).toLocaleString(undefined,{maximumFractionDigits:2})}</span></div>`).join("")}</div>`;
    }
  }
  const summary = document.querySelector("#summary");
  if (summary) summary.innerHTML = `<p>${escapeHtml(state.project.objective)}</p><p><strong>${state.rows.length} sample records</strong> across ${state.headers.length} fields; ${metrics.completeness}% of cells are populated.</p>${domain.bullets.map((bullet) => `<p>${escapeHtml(bullet)}</p>`).join("")}<p>Sample data is illustrative, not live or authoritative. Validate data sources, definitions, and context before using findings in a report.</p>`;
  showToast(`Analysis complete · ${state.rows.length} records checked`);
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastElement.classList.remove("is-visible"), 3200);
}

function render() {
  renderTrackNav();
  updateBreadcrumb();
  if (state.page === "workspace" && state.project) renderWorkspace();
  else if (state.page === "track" && state.track) renderTrack();
  else if (state.page === "overview") renderOverview();
  else renderHome();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-track], [data-project], [data-action], #nav-overview, #nav-projects, #home-link, #help-button, #run-analysis");
  if (!target) return;
  if (target.matches("[data-track]")) navigateTrack(Number(target.dataset.track));
  else if (target.matches("[data-project]")) openProject(target.dataset.project);
  else if (target.matches("[data-action='home'], #home-link, #nav-projects")) {
    event.preventDefault();
    state.page = "home"; state.track = null; state.project = null; state.search = ""; render();
    window.scrollTo(0, 0);
  } else if (target.matches("#nav-overview")) {
    state.page = "overview"; state.track = null; state.project = null; render();
    window.scrollTo(0, 0);
  } else if (target.matches("[data-action='sample']")) {
    if (!state.project) return;
    state.headers = samples[state.project.sample][0];
    state.rows = samples[state.project.sample].slice(1).map((row) => [...row]);
    state.result = null;
    render();
    runAnalysis();
    showToast("Sample dataset restored.");
  } else if (target.matches("#run-analysis")) runAnalysis();
  else if (target.matches("#help-button")) showToast("Demo data is illustrative. Upload a CSV to explore your own data locally.");
});

document.addEventListener("input", (event) => {
  if (event.target.matches("#project-search")) {
    const selectionStart = event.target.selectionStart;
    state.search = event.target.value;
    renderHome();
    const input = document.querySelector("#project-search");
    input.focus();
    input.setSelectionRange(selectionStart, selectionStart);
  }
});

document.addEventListener("change", async (event) => {
  if (!event.target.matches("#csv-upload")) return;
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = parseCsv(await file.text());
    state.headers = parsed.headers;
    state.rows = parsed.rows;
    state.result = null;
    render();
    runAnalysis();
    showToast(`Loaded ${state.rows.length} records from ${file.name}`);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Could not read this CSV file.");
  }
  event.target.value = "";
});

document.querySelector("#home-link").addEventListener("click", (event) => event.preventDefault());
document.querySelector("#nav-projects").classList.add("is-active");
render();
