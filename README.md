# Data Mining Course Guide: Pipeline and Projects

A locally runnable data-mining studio for 23 projects across five learning tracks. Collect data from public APIs and feeds, run a project workflow, persist selected results in SQLite, analyze records, or upload a CSV for browser-local analysis.

## Product description

**GitHub repository description:** A locally runnable data-mining platform with live public-source collectors and workflows for 23 projects across five learning tracks.

## The application

The application brings all five course tracks together in one responsive website. Each workspace has a project-specific data collector, a dataset preview, completeness checks, analysis summaries, and comparison charts. The Python standard-library server connects the browser to public data sources and stores selected snapshots in a local SQLite database. CSV uploads are analyzed in the browser and are not sent to the server.


Some projects have real-world constraints: the price projects use a clearly labeled demo product catalog rather than retailer listings; the review analyzer is a transparent word-list baseline; and the claim-check workspace searches published fact checks instead of declaring whether a claim is true. All 23 default workflows run without API keys; movie coverage is limited to Studio Ghibli and fact-check filtering covers recent publisher feeds. The Selenium workspace needs Chrome/Chromium.

## Run locally

Use Python 3.9 or newer. Install the Selenium dependency, then run the combined web and API server from the repository directory:

cd "C:\Users\sirri\Desktop\project\Data-Mining\Data-Mining-Course-Guide-Pipeline-and-Projects"
```


```

```powershell
python -m pip install -r requirements.txt
python server.py
```

Open [http://localhost:8000](http://localhost:8000) in your browser. Stop the server with `Ctrl+C`. Do not open `index.html` directly or use `python -m http.server`; live collection requires the API server.

The server binds only to `127.0.0.1` so its local API credentials and collection routes are not exposed to the network. Override `PORT` if port 8000 is already in use.

## Using the workspace

1. Choose one of the five tracks and open a project.
2. Enter a search term, location, ticker, country code, or text where prompted, then choose **Run workflow**. Monitoring and pipeline workspaces can refresh every 60 seconds while open; **View saved runs** loads the most recent 100 snapshots per project from SQLite.
3. Choose **Run analysis** to rerun the analysis, or **Reset sample** to restore illustrative records.
4. Choose **Upload CSV** to analyze a local CSV with a header row and at least one data row. Uploaded files are not sent to the server.

The API reports sources and collection failures in the workspace. Inputs for external search APIs are sent to the listed providers; movie and fact-check filters run on the server after fetching the public catalog or feeds. CSV uploads remain in the browser and are not sent to the server. All collected datasets are previewed and analyzed in the browser. Validate source definitions, terms, coverage, and domain-specific limitations before using results.

## Data sources and project workflows

| Projects | Data source and behavior |
| --- | --- |
| Job listings | Remotive public jobs API; enter a role or skill search. Job records include direct source links and Remotive attribution. |
| News headlines | BBC News and The Guardian RSS feeds, with partial-source errors shown if one feed is unavailable. |
| Monitoring, pipeline, web-to-SQL, news recommendations | BBC News RSS feed. Monitoring and pipeline workspaces can collect every 60 seconds while open. Monitoring, pipeline, web-to-SQL, and price-tracker runs are recorded in local SQLite and can be loaded in the workspace. News recommendations rank current headlines against the entered topic. |
| Product price tracker, price comparison, market intelligence | DummyJSON public demo product API. The tracker stores timestamped snapshots in SQLite. The catalog is synthetic and is not retailer pricing. |
| Weather, API aggregation, smart cities | Open-Meteo weather and air-quality APIs; enter a city. API aggregation combines both sets of observations. Smart Cities currently analyzes air-quality observations, not traffic or energy consumption. |
| Public health, healthcare mining | World Bank Open Data life-expectancy indicator; enter a three-letter ISO country code such as `GBR` or `USA`. It is country-level context, not clinical or hospital data. |
| Education analytics | World Bank secondary-school enrollment indicator; enter a three-letter ISO country code. |
| Social media trends | [Hacker News search API (Algolia)](https://hn.algolia.com/api); enter a topic to find recent stories with community points and comment counts. No key; covers Hacker News rather than Reddit. |
| Movie insights | [Studio Ghibli API](https://ghibliapi.vercel.app/); search a film title or director, or leave blank for the catalog. No key; 22 films at verification time. Catalog RT scores use a 0–100 scale and may be outdated. |
| Stock market mining | Yahoo Finance chart endpoint; enter a ticker. Data may be delayed and the unofficial endpoint can change; this is not investment advice. |
| Review sentiment | An explainable local word-list score for text entered in the source field. This is not a trained sentiment model. |
| Academic publications, research trends | OpenAlex works search; enter a search phrase. No-key requests use a shared free quota; set `OPENALEX_API_KEY` for an account-specific quota. |
| Selenium scraper | Selenium loads up to three paginated pages of the JavaScript-rendered Quotes to Scrape practice site; requires Chrome/Chromium. Enter an optional phrase to filter results. |
| Fake-news project | [Full Fact](https://fullfact.org/feed/) and [FactCheck.org](https://www.factcheck.org/feed/) public RSS feeds. Optional keyword filter over recent article titles and summaries. No key; this is not a full archive search or an automated truth verdict. Partial feed failures are reported. |

No registration or API key is needed for the default workflows. OpenAlex can optionally use an account-specific `OPENALEX_API_KEY`; no key was needed in the live checks. Credentials are read only on the server, never embedded in browser code.

The SQLite database is created at `data/fieldnotes.sqlite3`; collected snapshots stay on this machine.

## Run tests

```powershell
python -m unittest discover -s tests -v
```

## Project tracks

### Project 1 — Foundations

**Focus:** Python basics, Pandas, and introductory web scraping.

- **Web Scraping of Job Listings** — Collect job titles, companies, locations, and required skills; clean the results and analyze in-demand skills with Pandas.
- **News Headlines Analyzer** — Gather headlines from multiple news websites and perform text preprocessing and frequency analysis.
- **Product Price Tracker** — Collect e-commerce prices over time and visualize price trends.
- **Weather Data Collection and Analysis** — Retrieve weather data from public APIs and analyze temperature and rainfall trends.
- **Public Health Data Dashboard** — Explore and visualize public health data from open data portals.

### Project 2 — APIs, Data Cleaning, and Visualization

**Focus:** APIs, advanced data cleaning, visualization, and databases.

- **Social Media Trend Analysis** — Collect Hacker News stories through the key-free Algolia search API and analyze topics, points, and comments.
- **Movie Recommendation Insights** — Explore Studio Ghibli film metadata, catalog RT scores, directors, and release years.
- **Stock Market Data Mining** — Analyze historical stock prices, volatility, and moving averages using API data.
- **Online Review Sentiment Analysis** — Process product or service reviews and analyze their sentiment.
- **Academic Publication Mining** — Analyze scholarly publication trends by year, author, or topic.

### Project 3 — Dynamic Pages, Selenium, and Databases

**Focus:** Dynamic websites, Selenium, databases, and data pipelines.

- **Real-Time Web Data Monitoring System** — Continuously collect web data, store updates in a database, and visualize changes.
- **Dynamic Content Scraper with Selenium** — Extract data from JavaScript-heavy websites and handle pagination, login, and sessions.
- **Web-Based Price Comparison Engine** — Normalize prices from multiple vendors and identify the best deals.
- **News Article Recommendation System** — Collect articles and cluster them by topic using text analysis.
- **Fake News Detection Using Web-Mined Data** — Filter recent Full Fact and FactCheck.org articles by topic and read the original reviews; no automated truth classification is performed.

### Project 4 — Data Pipeline and Integration

**Focus:** End-to-end workflows, storage, and automation.

- **Automated Web Data Pipeline** — Scrape, clean, store, and visualize data with scheduling and logging.
- **Web Data to SQL Database System** — Extract web data, store it in SQLite or MySQL, and perform SQL-based analytics.
- **API Aggregation Platform** — Collect data from multiple APIs and merge and normalize the resulting datasets.

### Project 5 — Applied Data Mining

**Focus:** Real-world applications of data mining.

- **Large-Scale Web Data Mining for Market Intelligence** — Analyze product, price, and review data to support business decisions.
- **Open Data Mining for Smart Cities** — Analyze government data on topics such as traffic, pollution, or energy use.
- **Healthcare Web Data Mining System** — Explore healthcare datasets and reports to analyze disease or hospital-performance trends.
- **Education Analytics Using Web-Mined Data** — Analyze course, ranking, or enrollment data for trends.
- **Research Trend Detection System** — Mine research articles over time to identify emerging topics.

## Current status

All 23 workspaces now have project-specific collection or analysis routes. External services may impose rate limits, change their APIs, or require credentials; these conditions are reported in the app rather than replaced with sample results.
