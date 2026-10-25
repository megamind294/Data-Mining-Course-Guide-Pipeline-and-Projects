from contextlib import closing
import json
import os
import re
import sqlite3
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "data" / "fieldnotes.sqlite3"
USER_AGENT = "FieldnotesDataStudio/1.0 (learning project)"
MAX_RESPONSE_BYTES = 5_000_000
STOP_WORDS = {
    "about", "after", "again", "also", "and", "are", "been", "before", "between",
    "but", "can", "could", "for", "from", "have", "into", "its", "just", "more",
    "most", "not", "our", "out", "over", "said", "should", "some", "than", "that",
    "the", "their", "them", "then", "there", "these", "they", "this", "through",
    "was", "were", "what", "when", "where", "which", "while", "with", "would",
}


class CollectionError(Exception):
    pass


def request_bytes(url, *, accept="*/*", headers=None, data=None):
    request_headers = {"User-Agent": USER_AGENT, "Accept": accept}
    request_headers.update(headers or {})
    request = urllib.request.Request(
        url,
        data=data,
        headers=request_headers,
    )
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            payload = response.read(MAX_RESPONSE_BYTES + 1)
            if len(payload) > MAX_RESPONSE_BYTES:
                raise CollectionError("The source response exceeded the 5 MB limit.")
            return payload
    except urllib.error.HTTPError as error:
        raise CollectionError(f"Source returned HTTP {error.code}.") from error
    except urllib.error.URLError as error:
        raise CollectionError(f"Could not reach the data source: {error.reason}.") from error
    except TimeoutError as error:
        raise CollectionError("The data source timed out.") from error


def fetch_json(url, *, headers=None, data=None):
    try:
        return json.loads(request_bytes(url, accept="application/json", headers=headers, data=data).decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise CollectionError("The data source returned invalid JSON.") from error


def result(headers, rows, source, message=None):
    if not rows:
        raise CollectionError("The source returned no records. Try a different search or source.")
    return {
        "headers": headers,
        "rows": [[str(value) if value is not None else "" for value in row] for row in rows],
        "source": source,
        "message": message or f"Collected {len(rows)} records from {source}.",
    }


def persist(project_id, records):
    DATABASE.parent.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(DATABASE)) as connection:
        with connection:
            connection.execute(
                """CREATE TABLE IF NOT EXISTS collections (
                    id INTEGER PRIMARY KEY,
                    project_id TEXT NOT NULL,
                    collected_at TEXT NOT NULL,
                    payload TEXT NOT NULL
                )"""
            )
            connection.execute(
                "INSERT INTO collections (project_id, collected_at, payload) VALUES (?, ?, ?)",
                (
                    project_id,
                    datetime.now(timezone.utc).isoformat(timespec="seconds"),
                    json.dumps(records, ensure_ascii=False),
                ),
            )


def load_history(project_id):
    if not DATABASE.exists():
        return []
    with closing(sqlite3.connect(DATABASE)) as connection:
        rows = connection.execute(
            "SELECT payload FROM collections WHERE project_id = ? ORDER BY id DESC LIMIT 100",
            (project_id,),
        ).fetchall()
    rows.reverse()
    records = []
    for (payload,) in rows:
        records.extend(json.loads(payload))
    return records


def load_saved_records(project_id):
    if not DATABASE.exists():
        return []
    with closing(sqlite3.connect(DATABASE)) as connection:
        rows = connection.execute(
            "SELECT collected_at, payload FROM collections WHERE project_id = ? ORDER BY id DESC LIMIT 100",
            (project_id,),
        ).fetchall()
    rows.reverse()
    records = []
    for collected_at, payload in rows:
        for record in json.loads(payload):
            records.append({**record, "Snapshot time": collected_at})
    return records


def records_from_rows(headers, rows):
    return [dict(zip(headers, row)) for row in rows]


def collect_jobs(query):
    data = fetch_json(
        "https://remotive.com/api/remote-jobs?"
        + urllib.parse.urlencode({"search": query or "data analyst", "limit": 50})
    )
    jobs = data.get("jobs", [])
    headers = ["Title", "Company", "Location", "Skills", "Published", "Job URL"]
    rows = [
        [
            job.get("title", ""),
            job.get("company_name", ""),
            job.get("candidate_required_location", ""),
            ", ".join(job.get("tags", [])),
            job.get("publication_date", ""),
            job.get("url", ""),
        ]
        for job in jobs
    ]
    return result(headers, rows, "Remotive public jobs API")


def collect_rss(query, project_id):
    feeds = {
        "news-headlines": [
            ("https://feeds.bbci.co.uk/news/rss.xml", "BBC News"),
            ("https://www.theguardian.com/world/rss", "The Guardian"),
        ],
        "realtime-monitor": [("https://feeds.bbci.co.uk/news/rss.xml", "BBC News")],
        "automated-pipeline": [("https://feeds.bbci.co.uk/news/rss.xml", "BBC News")],
        "web-to-sql": [("https://feeds.bbci.co.uk/news/rss.xml", "BBC News")],
        "news-recommendations": [("https://feeds.bbci.co.uk/news/rss.xml", "BBC News")],
    }
    headers = ["Headline", "Publisher", "Topic", "Published", "Link"]
    rows = []
    sources = []
    failures = []
    for url, publisher in feeds[project_id]:
        try:
            root = ET.fromstring(request_bytes(url, accept="application/rss+xml, application/xml"))
        except CollectionError as error:
            failures.append(f"{publisher}: {error}")
            continue
        except ET.ParseError:
            failures.append(f"{publisher}: invalid RSS feed")
            continue
        sources.append(publisher)
        for item in root.findall(".//item")[:50]:
            title = item.findtext("title", default="").strip()
            category = item.findtext("category", default="News").strip() or "News"
            rows.append([
                title,
                publisher,
                category,
                item.findtext("pubDate", default=""),
                item.findtext("link", default=""),
            ])
    if not rows and failures:
        raise CollectionError("Could not collect any RSS records. " + "; ".join(failures))
    words = {word.lower() for word in re.findall(r"[a-zA-Z]{3,}", query)} - STOP_WORDS
    if words and project_id == "news-recommendations":
        rows.sort(key=lambda row: sum(word in (row[0] + " " + row[2]).lower() for word in words), reverse=True)
    elif words and project_id in {"news-headlines", "realtime-monitor", "automated-pipeline", "web-to-sql"}:
        rows = [row for row in rows if any(word in " ".join(row[:3]).lower() for word in words)]
    records = records_from_rows(headers, rows)
    if project_id in {"realtime-monitor", "automated-pipeline", "web-to-sql"}:
        persist(project_id, records)
    message = f"Collected {len(rows)} records from {', '.join(sources)}."
    if failures:
        message += " Some feeds were unavailable: " + "; ".join(failures)
    return result(headers, rows, " + ".join(sources) + " RSS", message)


def collect_products(query, project_id):
    params = {"limit": 50}
    if query:
        params["q"] = query
    data = fetch_json("https://dummyjson.com/products/search?" + urllib.parse.urlencode(params))
    products = data.get("products", [])
    headers = ["Product", "Price", "Vendor", "Rating", "Category", "Reviews"]
    rows = [
        [
            product.get("title", ""),
            product.get("price", ""),
            "DummyJSON catalog",
            product.get("rating", ""),
            product.get("category", ""),
            len(product.get("reviews", [])),
        ]
        for product in products
    ]
    if project_id == "price-tracker":
        collected_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
        headers.append("Collected Date")
        rows = [row + [collected_at] for row in rows]
        records = records_from_rows(headers, rows)
        persist(project_id, records)
        history = load_history(project_id)
        rows = [[record.get(header, "") for header in headers] for record in history]
        message = "Collected catalog prices and saved a timestamped snapshot to the local SQLite database. DummyJSON is a demo catalog, not a live retailer."
    else:
        message = "Collected records from the DummyJSON demo catalog; these are not live retailer offers."
    return result(headers, rows, "DummyJSON public demo API", message)


def geocode(query):
    location = query or "London"
    data = fetch_json(
        "https://geocoding-api.open-meteo.com/v1/search?"
        + urllib.parse.urlencode({"name": location, "count": 1, "language": "en", "format": "json"})
    )
    locations = data.get("results", [])
    if not locations:
        raise CollectionError(f"No location found for “{location}”.")
    return locations[0]


def open_meteo(query, include_air=False):
    place = geocode(query)
    latitude, longitude = place["latitude"], place["longitude"]
    if include_air:
        data = fetch_json(
            "https://air-quality-api.open-meteo.com/v1/air-quality?"
            + urllib.parse.urlencode({
                "latitude": latitude,
                "longitude": longitude,
                "hourly": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide",
                "forecast_days": 3,
                "timezone": "auto",
            })
        )
        hourly = data.get("hourly", {})
        headers = ["Timestamp", "City", "PM2.5", "PM10", "Carbon monoxide", "Nitrogen dioxide"]
        rows = [
            [hourly["time"][index], place.get("name", query), hourly.get("pm2_5", [""] * len(hourly["time"]))[index],
             hourly.get("pm10", [""] * len(hourly["time"]))[index],
             hourly.get("carbon_monoxide", [""] * len(hourly["time"]))[index],
             hourly.get("nitrogen_dioxide", [""] * len(hourly["time"]))[index]]
            for index in range(min(48, len(hourly.get("time", []))))
        ]
        return headers, rows, f"Open-Meteo air quality · {place.get('name', query)}"
    data = fetch_json(
        "https://api.open-meteo.com/v1/forecast?"
        + urllib.parse.urlencode({
            "latitude": latitude,
            "longitude": longitude,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
            "forecast_days": 7,
            "timezone": "auto",
        })
    )
    daily = data.get("daily", {})
    headers = ["Date", "City", "Max temperature C", "Min temperature C", "Rainfall mm"]
    rows = [
        [day, place.get("name", query), daily["temperature_2m_max"][index],
         daily["temperature_2m_min"][index], daily["precipitation_sum"][index]]
        for index, day in enumerate(daily.get("time", []))
    ]
    return headers, rows, f"Open-Meteo forecast · {place.get('name', query)}"


def collect_weather(query, project_id):
    if project_id == "weather-analysis":
        headers, rows, source = open_meteo(query)
        return result(headers, rows, source)
    if project_id == "smart-cities":
        headers, rows, source = open_meteo(query, include_air=True)
        return result(headers, rows, source, "Open-Meteo air-quality observations; these are environmental measurements, not city traffic or energy data.")
    headers, weather_rows, weather_source = open_meteo(query)
    headers_air, air_rows, air_source = open_meteo(query, include_air=True)
    air_by_time = {row[0][:10]: row[2:] for row in air_rows}
    output_headers = headers + headers_air[2:]
    rows = [row + air_by_time.get(row[0], ["", "", "", ""]) for row in weather_rows]
    return result(output_headers, rows, weather_source + " and " + air_source)


def collect_world_bank(query, project_id):
    country = (query or "USA").strip().upper()
    if not re.fullmatch(r"[A-Z]{3}", country):
        raise CollectionError("Enter a 3-letter ISO country code, such as USA, GBR, or IND.")
    indicator = "SE.SEC.ENRR" if project_id == "education-analytics" else "SP.DYN.LE00.IN"
    data = fetch_json(
        f"https://api.worldbank.org/v2/country/{country}/indicator/{indicator}?"
        + urllib.parse.urlencode({"format": "json"})
    )
    if not isinstance(data, list) or len(data) < 2 or not isinstance(data[1], list) or not data[1]:
        raise CollectionError(f"No World Bank indicator data was found for {country}.")
    rows = [
        [entry.get("date", ""), entry.get("country", {}).get("value", country), entry.get("value", "")]
        for entry in data[1]
        if entry.get("value") is not None
    ]
    name = "Gross enrollment ratio, secondary, both sexes (%)" if project_id == "education-analytics" else "Life expectancy at birth, total (years)"
    return result(["Year", "Country", name], rows, f"World Bank Open Data · {indicator}")


def collect_social(query):
    params = {"tags": "story", "hitsPerPage": 50, "query": query or "data science"}
    data = fetch_json("https://hn.algolia.com/api/v1/search_by_date?" + urllib.parse.urlencode(params))
    rows = [
        [post.get("created_at", ""), post.get("title", ""), post.get("points", ""),
         post.get("num_comments", ""),
         "https://news.ycombinator.com/item?id=" + str(post.get("objectID", ""))]
        for post in data.get("hits", []) if post.get("title")
    ]
    return result(["Timestamp", "Topic", "Score", "Comments", "Link"], rows,
                  "Hacker News search API (Algolia)",
                  "Recent matching Hacker News stories, with community points and comments. No API key is required; coverage is Hacker News only.")


def collect_stocks(query):
    ticker = re.sub(r"[^a-zA-Z0-9.-]", "", query or "aapl").lower()
    if not ticker:
        raise CollectionError("Enter a valid stock ticker.")
    data = fetch_json(
        f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(ticker, safe='.-')}?"
        + urllib.parse.urlencode({"range": "1y", "interval": "1d"})
    )
    chart = data.get("chart", {})
    if chart.get("error"):
        raise CollectionError(chart["error"].get("description", "The market data source rejected this ticker."))
    results = chart.get("result", [])
    if not results:
        raise CollectionError(f"No market data was found for ticker {ticker.upper()}.")
    item = results[0]
    quote = item.get("indicators", {}).get("quote", [{}])[0]
    timestamps = item.get("timestamp", [])
    rows = [
        [
            datetime.fromtimestamp(timestamp, timezone.utc).date().isoformat(),
            item.get("meta", {}).get("symbol", ticker.upper()),
            quote.get("open", [None] * len(timestamps))[index],
            quote.get("high", [None] * len(timestamps))[index],
            quote.get("low", [None] * len(timestamps))[index],
            quote.get("close", [None] * len(timestamps))[index],
            quote.get("volume", [None] * len(timestamps))[index],
        ]
        for index, timestamp in enumerate(timestamps)
    ]
    return result(
        ["Date", "Symbol", "Open", "High", "Low", "Close", "Volume"],
        rows,
        f"Yahoo Finance chart data · {ticker.upper()}",
        "Yahoo Finance chart data may be delayed; this unofficial endpoint is not investment advice.",
    )


def sentiment(text):
    positive = {
        "amazing", "best", "brilliant", "enjoy", "excellent", "fantastic", "good",
        "great", "happy", "love", "perfect", "recommend", "thanks", "wonderful",
    }
    negative = {
        "awful", "bad", "broken", "disappointed", "hate", "horrible", "poor",
        "problem", "refund", "terrible", "waste", "worst",
    }
    words = re.findall(r"[a-z']+", text.lower())
    score = sum(word in positive for word in words) - sum(word in negative for word in words)
    label = "Positive" if score > 0 else "Negative" if score < 0 else "Neutral"
    return label, score


def collect_sentiment(query):
    if not query:
        raise CollectionError("Enter review text in the source field to score its sentiment.")
    label, score = sentiment(query)
    return result(["Review", "Sentiment", "Lexicon score"], [[query, label, score]], "Local transparent word-list baseline",
                  "A small rule-based word-list demo, not a trained model. Review the text and score before drawing conclusions.")


def collect_openalex(query, project_id):
    search = query or "data mining"
    params = {"search": search, "per-page": 50, "sort": "publication_year:desc"}
    api_key = os.environ.get("OPENALEX_API_KEY")
    if api_key:
        params["api_key"] = api_key
    data = fetch_json(
        "https://api.openalex.org/works?" + urllib.parse.urlencode(params)
    )
    works = data.get("results", [])
    headers = ["Title", "Year", "Author", "Topic", "Citations", "DOI"]
    rows = []
    for work in works:
        authors = work.get("authorships", [])
        author = authors[0].get("author", {}).get("display_name", "") if authors else ""
        concepts = work.get("concepts", [])
        topic = concepts[0].get("display_name", "") if concepts else search
        rows.append([
            work.get("title", ""), work.get("publication_year", ""), author,
            topic, work.get("cited_by_count", ""), work.get("doi", ""),
        ])
    return result(headers, rows, "OpenAlex scholarly works API")


def collect_movies(query):
    films = fetch_json("https://ghibliapi.vercel.app/films")
    search = query.strip().casefold()
    rows = [
        [film.get("title", ""), film.get("director", ""), film.get("rt_score", ""),
         film.get("release_date", ""), film.get("running_time", "")]
        for film in films
        if not search or search in (film.get("title", "") + " " + film.get("director", "")).casefold()
    ]
    return result(["Title", "Director", "RT score (0–100)", "Year", "Runtime (minutes)"], rows,
                  "Studio Ghibli public film API",
                  "Studio Ghibli films only. RT scores (0–100) are catalog metadata and may not reflect current ratings. Search a title or director, or leave blank for all films.")


class QuoteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.quotes = []
        self.current = None
        self.capture = None

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        classes = attributes.get("class", "").split()
        if tag == "div" and "quote" in classes:
            self.current = {"Quote": "", "Author": "", "Tags": ""}
        elif self.current is not None and tag == "span" and "text" in classes:
            self.capture = "Quote"
        elif self.current is not None and tag == "small" and "author" in classes:
            self.capture = "Author"
        elif self.current is not None and tag == "a" and "tag" in classes:
            self.capture = "Tags"

    def handle_data(self, data):
        if self.current is not None and self.capture:
            existing = self.current[self.capture]
            self.current[self.capture] = (existing + " " + data).strip()

    def handle_endtag(self, tag):
        if tag in {"span", "small", "a"}:
            self.capture = None
        if tag == "div" and self.current is not None and self.current.get("Quote"):
            self.quotes.append(self.current)
            self.current = None


def collect_selenium(query):
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.common.exceptions import NoSuchElementException
        from selenium.webdriver.support.ui import WebDriverWait
    except ImportError as error:
        raise CollectionError("Install the Selenium dependency and Chrome/Chromium to run this project.") from error
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    try:
        driver = webdriver.Chrome(options=options)
        try:
            driver.get("https://quotes.toscrape.com/js/")
            records = []
            for _ in range(3):
                WebDriverWait(driver, 10).until(
                    lambda browser: browser.find_elements(By.CSS_SELECTOR, ".quote .text")
                )
                first_quote = driver.find_element(By.CSS_SELECTOR, ".quote .text").text
                parser = QuoteParser()
                parser.feed(driver.page_source)
                records.extend(parser.quotes)
                try:
                    next_link = driver.find_element(By.CSS_SELECTOR, "li.next a")
                except NoSuchElementException:
                    break
                next_link.click()
                WebDriverWait(driver, 10).until(
                    lambda browser: browser.find_element(By.CSS_SELECTOR, ".quote .text").text != first_quote
                )
        finally:
            driver.quit()
    except Exception as error:
        raise CollectionError(f"Selenium could not load the public JavaScript-rendered practice site: {error}") from error
    if query:
        terms = query.lower().split()
        records = [record for record in records if all(term in record["Quote"].lower() for term in terms)]
    return result(["Quote", "Author", "Tags"], [[row["Quote"], row["Author"], row["Tags"]] for row in records],
                  "Quotes to Scrape JavaScript practice site")


def collect_fake_news(query):
    rows, sources, failures = [], [], []
    terms = set(re.findall(r"[a-zA-Z0-9]{3,}", query.lower())) - STOP_WORDS
    for url, publisher in [("https://fullfact.org/feed/", "Full Fact"),
                           ("https://www.factcheck.org/feed/", "FactCheck.org")]:
        try:
            root = ET.fromstring(request_bytes(url, accept="application/rss+xml, application/xml"))
        except (CollectionError, ET.ParseError) as error:
            failures.append(f"{publisher}: {error}")
            continue
        sources.append(publisher)
        for item in root.findall(".//item")[:50]:
            title = item.findtext("title", default="").strip()
            summary = unescape(re.sub(r"<[^>]+>", " ", item.findtext("description", default="")))
            summary = " ".join(summary.split())[:2000]
            text = (title + " " + summary).lower()
            if terms and not any(term in text for term in terms):
                continue
            rows.append([title, publisher, summary, item.findtext("pubDate", default=""),
                         item.findtext("link", default="")])
    if not rows:
        if not sources:
            raise CollectionError("Fact-check feeds are unavailable. " + "; ".join(failures))
        raise CollectionError("No recent fact-check feed articles matched. Try a broader topic or leave the filter blank; this is not a full archive search.")
    message = "Articles from recent publisher feeds; topic matches are not a verdict on your claim. Read each review. No API key required."
    if failures:
        message += " Some feeds were unavailable: " + "; ".join(failures)
    return result(["Headline", "Publisher", "Summary", "Published", "Link"], rows,
                  " + ".join(sources) + " RSS", message)


def collect(project_id, query):
    if project_id == "job-listings":
        return collect_jobs(query)
    if project_id in {"news-headlines", "realtime-monitor", "automated-pipeline", "web-to-sql", "news-recommendations"}:
        return collect_rss(query, project_id)
    if project_id in {"price-tracker", "price-comparison", "market-intelligence"}:
        return collect_products(query, project_id)
    if project_id in {"weather-analysis", "smart-cities", "api-aggregation"}:
        return collect_weather(query, project_id)
    if project_id in {"public-health", "healthcare-mining", "education-analytics"}:
        return collect_world_bank(query, project_id)
    if project_id == "social-trends":
        return collect_social(query)
    if project_id == "stock-mining":
        return collect_stocks(query)
    if project_id == "review-sentiment":
        return collect_sentiment(query)
    if project_id in {"academic-publications", "research-trends"}:
        return collect_openalex(query, project_id)
    if project_id == "movie-insights":
        return collect_movies(query)
    if project_id == "selenium-scraper":
        return collect_selenium(query)
    if project_id == "fake-news":
        return collect_fake_news(query)
    raise CollectionError("Unknown project. Choose a project from the library.")


PROJECTS = {
    "job-listings", "news-headlines", "price-tracker", "weather-analysis", "public-health",
    "social-trends", "movie-insights", "stock-mining", "review-sentiment",
    "academic-publications", "realtime-monitor", "selenium-scraper", "price-comparison",
    "news-recommendations", "fake-news", "automated-pipeline", "web-to-sql",
    "api-aggregation", "market-intelligence", "smart-cities", "healthcare-mining",
    "education-analytics", "research-trends",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/health":
            self.send_json(200, {"ok": True, "projects": len(PROJECTS)})
            return
        if parsed.path.startswith("/api/history/"):
            project_id = parsed.path.removeprefix("/api/history/")
            if project_id not in PROJECTS:
                self.send_json(404, {"error": "Unknown project."})
                return
            try:
                records = load_saved_records(project_id)
            except (sqlite3.Error, json.JSONDecodeError) as error:
                self.send_json(500, {"error": f"Could not read the local SQLite data: {error}"})
                return
            if not records:
                self.send_json(404, {"error": "There are no saved runs for this project yet."})
                return
            headers = list(records[0])
            self.send_json(200, {
                "headers": headers,
                "rows": [[record.get(header, "") for header in headers] for record in records],
                "source": "LOCAL SQLITE · SAVED RUNS",
                "message": f"Loaded {len(records)} saved records from the local SQLite database.",
            })
            return
        if parsed.path.startswith("/api/collect/"):
            project_id = parsed.path.removeprefix("/api/collect/")
            if project_id not in PROJECTS:
                self.send_json(404, {"error": "Unknown project."})
                return
            query = urllib.parse.parse_qs(parsed.query).get("query", [""])[0][:300]
            try:
                payload = collect(project_id, query)
                self.send_json(200, payload)
            except CollectionError as error:
                self.send_json(502, {"error": str(error)})
            except (KeyError, IndexError, TypeError, ValueError) as error:
                self.send_json(502, {"error": f"The source response could not be processed: {error}"})
            except sqlite3.Error as error:
                self.send_json(500, {"error": f"Could not save or read the local SQLite data: {error}"})
            return
        if parsed.path == "/":
            self.path = "/index.html"
        super().do_GET()

    def log_message(self, format_string, *args):
        sys.stderr.write("%s - %s\n" % (self.log_date_time_string(), format_string % args))


def main():
    host = "127.0.0.1"
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Fieldnotes is available at http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Fieldnotes.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
