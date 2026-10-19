# Data Mining Course Guide: Pipeline and Projects

A unified data-mining learning studio for 23 projects across five learning tracks. Choose a track, open a project workspace, explore a sample dataset, run a quick analysis, or upload your own CSV.

## Product description

**GitHub repository description:** A unified guide and planned web platform for 23 data-mining projects across five tracks, from web scraping and APIs to automated pipelines and applied analytics.

## The application

The application brings all five course tracks together in one responsive website. Each project opens a dedicated workspace with illustrative sample data, a working-dataset preview, data completeness checks, an analysis summary, and a comparison chart when the columns allow one. Upload a CSV to run the same local analysis on your own data; uploaded files are read in the browser and are not sent to a server.

The project workspaces are interactive learning demos rather than live scrapers, API clients, deployed databases, or production prediction models. Their sample records and results are illustrative. Add and connect project-specific data sources and backends as those projects are developed.

## Run locally

No package installation or build step is needed. From the repository directory, start Python's built-in static file server:

```powershell
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. Stop the server with `Ctrl+C`.

You can also open `index.html` directly, though using the local server is recommended.

## Using the workspace

1. Choose one of the five tracks from the home page or the left sidebar.
2. Select a project to open its workspace and automatically run its sample analysis.
3. Choose **Run analysis** to rerun the workflow, or **Reset sample** to restore the built-in records.
4. Choose **Upload CSV** to use a local CSV with a header row and at least one data row.

The analysis checks record count and completeness, summarizes numeric data, and applies a small project-specific comparison or text-frequency analysis where applicable. It runs locally in your browser. It is intended for learning and exploration, not as a substitute for validating source quality or domain-specific methods.

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

- **Social Media Trend Analysis** — Collect data from social media APIs, such as Reddit, and analyze trending topics and engagement.
- **Movie Recommendation Insights** — Explore movie metadata, ratings, genres, and reviews to visualize user preferences.
- **Stock Market Data Mining** — Analyze historical stock prices, volatility, and moving averages using API data.
- **Online Review Sentiment Analysis** — Process product or service reviews and analyze their sentiment.
- **Academic Publication Mining** — Analyze scholarly publication trends by year, author, or topic.

### Project 3 — Dynamic Pages, Selenium, and Databases

**Focus:** Dynamic websites, Selenium, databases, and data pipelines.

- **Real-Time Web Data Monitoring System** — Continuously collect web data, store updates in a database, and visualize changes.
- **Dynamic Content Scraper with Selenium** — Extract data from JavaScript-heavy websites and handle pagination, login, and sessions.
- **Web-Based Price Comparison Engine** — Normalize prices from multiple vendors and identify the best deals.
- **News Article Recommendation System** — Collect articles and cluster them by topic using text analysis.
- **Fake News Detection Using Web-Mined Data** — Collect articles from multiple websites and apply basic NLP classification techniques.

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

The unified website and interactive demo workspaces are implemented. Connecting live sources, dedicated processing pipelines, databases, and production-grade models remains future project work.
