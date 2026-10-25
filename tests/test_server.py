import json
import re
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch

import server


class CollectorTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.database_patch = patch.object(
            server,
            "DATABASE",
            Path(self.temporary_directory.name) / "fieldnotes.sqlite3",
        )
        self.database_patch.start()

    def tearDown(self):
        self.database_patch.stop()
        self.temporary_directory.cleanup()

    def test_all_23_projects_have_a_collection_route(self):
        app_path = Path(__file__).resolve().parents[1] / "app.js"
        project_ids = set(re.findall(r'\{ id: "([^"]+)", track:', app_path.read_text(encoding="utf-8")))
        self.assertEqual(project_ids, server.PROJECTS)
        handler_names = {
            "collect_jobs", "collect_rss", "collect_products", "collect_weather",
            "collect_world_bank", "collect_social", "collect_stocks",
            "collect_sentiment", "collect_openalex", "collect_movies",
            "collect_selenium", "collect_fake_news",
        }
        payload = {"headers": ["Value"], "rows": [["ok"]], "source": "test", "message": "ok"}
        with patch.multiple(
            server,
            **{name: unittest.mock.Mock(return_value=payload) for name in handler_names},
        ):
            self.assertEqual(len(server.PROJECTS), 23)
            for project_id in server.PROJECTS:
                with self.subTest(project_id=project_id):
                    self.assertEqual(server.collect(project_id, ""), payload)

    def test_review_sentiment_returns_transparent_local_score(self):
        positive = server.collect_sentiment("This is a great and excellent product")
        negative = server.collect_sentiment("This is a terrible product")
        self.assertEqual(positive["rows"][0][1], "Positive")
        self.assertEqual(negative["rows"][0][1], "Negative")
        self.assertIn("word-list", positive["message"])

    def test_job_listings_include_skill_tags_and_source_links(self):
        job = {
            "title": "Data analyst",
            "company_name": "Example",
            "candidate_required_location": "Remote",
            "tags": ["SQL", "Python"],
            "publication_date": "2026-10-24",
            "url": "https://remotive.com/remote-jobs/example",
        }
        with patch.object(server, "fetch_json", return_value={"jobs": [job]}):
            payload = server.collect_jobs("data analyst")
        self.assertEqual(payload["rows"][0][3], "SQL, Python")
        self.assertEqual(payload["rows"][0][-1], job["url"])

    def test_stock_collector_normalizes_daily_chart_data(self):
        payload = {
            "chart": {
                "result": [{
                    "meta": {"symbol": "AAPL"},
                    "timestamp": [1790256600],
                    "indicators": {"quote": [{
                        "open": [100], "high": [110], "low": [95], "close": [105], "volume": [5000],
                    }]},
                }],
            },
        }
        with patch.object(server, "fetch_json", return_value=payload):
            result = server.collect_stocks("aapl")
        self.assertEqual(result["headers"], ["Date", "Symbol", "Open", "High", "Low", "Close", "Volume"])
        self.assertEqual(result["rows"][0][1:], ["AAPL", "100", "110", "95", "105", "5000"])

    def test_social_search_works_without_credentials(self):
        hit = {"created_at": "2026-10-25", "title": "Data science", "points": 12,
               "num_comments": 3, "objectID": "123"}
        with patch.dict("os.environ", {}, clear=True), patch.object(server, "fetch_json", return_value={"hits": [hit]}):
            payload = server.collect_social("data science")
        self.assertEqual(payload["rows"][0], ["2026-10-25", "Data science", "12", "3", "https://news.ycombinator.com/item?id=123"])
        self.assertIn("Hacker News", payload["source"])

    def test_movie_search_filters_free_film_catalog_without_credentials(self):
        films = [{"title": "Spirited Away", "director": "Hayao Miyazaki", "rt_score": "97", "release_date": "2001", "running_time": "125"},
                 {"title": "Ponyo", "director": "Hayao Miyazaki", "rt_score": "91", "release_date": "2008", "running_time": "100"}]
        with patch.dict("os.environ", {}, clear=True), patch.object(server, "fetch_json", return_value=films):
            payload = server.collect_movies("spirited")
        self.assertEqual(payload["rows"], [["Spirited Away", "Hayao Miyazaki", "97", "2001", "125"]])
        self.assertIn("0–100", payload["headers"][2])

    def test_movie_search_reports_no_matches(self):
        with patch.object(server, "fetch_json", return_value=[]):
            with self.assertRaisesRegex(server.CollectionError, "no records"):
                server.collect_movies("unknown")

    def test_selenium_quote_parser_extracts_dynamic_page_fields(self):
        parser = server.QuoteParser()
        parser.feed(
            '<div class="quote"><span class="text">An example quote</span>'
            '<small class="author">A. Writer</small><div class="tags">'
            '<a class="tag">data</a></div></div>'
        )
        self.assertEqual(
            parser.quotes,
            [{"Quote": "An example quote", "Author": "A. Writer", "Tags": "data"}],
        )

    def test_selenium_reports_browser_start_failure_without_claiming_dependency_is_missing(self):
        try:
            from selenium import webdriver
        except ImportError:
            self.skipTest("Selenium is not installed")
        with patch.object(webdriver, "Chrome", side_effect=RuntimeError("Browser start failed")):
            with self.assertRaisesRegex(server.CollectionError, "Browser start failed"):
                server.collect_selenium("")

    def test_price_tracker_persists_timestamped_snapshots(self):
        product = {"title": "Example phone", "price": 100, "rating": 4.5, "category": "phones", "reviews": []}
        with patch.object(server, "fetch_json", return_value={"products": [product]}):
            first = server.collect_products("phone", "price-tracker")
            second = server.collect_products("phone", "price-tracker")
        self.assertEqual(first["headers"][-1], "Collected Date")
        self.assertEqual(len(first["rows"]), 1)
        self.assertEqual(len(second["rows"]), 2)
        self.assertTrue(second["rows"][0][-1])

    def test_monitoring_and_pipeline_save_collected_feed_records(self):
        feed = b"""<rss><channel><item><title>Open data</title><description>Useful story</description>
            <pubDate>Sat, 24 Oct 2026 00:00:00 GMT</pubDate><link>https://example.test/story</link></item>
            </channel></rss>"""
        with patch.object(server, "request_bytes", return_value=feed):
            monitor = server.collect_rss("", "realtime-monitor")
            pipeline = server.collect_rss("", "automated-pipeline")
        self.assertEqual(monitor["rows"][0][0], "Open data")
        self.assertEqual(len(server.load_history("realtime-monitor")), 1)
        self.assertEqual(len(server.load_history("automated-pipeline")), 1)

    def test_headline_collector_merges_two_publishers(self):
        feed = b"<rss><channel><item><title>Headline</title><link>https://example.test</link></item></channel></rss>"
        with patch.object(server, "request_bytes", side_effect=[feed, feed]):
            payload = server.collect_rss("headline", "news-headlines")
        self.assertEqual([row[1] for row in payload["rows"]], ["BBC News", "The Guardian"])

    def test_world_bank_indicator_normalization(self):
        payload = [
            {"page": 1},
            [{"date": "2024", "country": {"value": "United Kingdom"}, "value": 82.1}],
        ]
        with patch.object(server, "fetch_json", return_value=payload):
            result = server.collect_world_bank("GBR", "healthcare-mining")
        self.assertEqual(result["rows"][0], ["2024", "United Kingdom", "82.1"])

    def test_fact_check_feed_filters_and_strips_markup_without_credentials(self):
        feed = b'<rss><channel><item><title>Climate claim</title><description>&lt;p&gt;Evidence &amp;amp; context&lt;/p&gt;</description><pubDate>Today</pubDate><link>https://example.test/review</link></item><item><title>Unrelated story</title></item></channel></rss>'
        with patch.dict("os.environ", {}, clear=True), patch.object(server, "request_bytes", return_value=feed):
            payload = server.collect_fake_news("climate")
        self.assertEqual(len(payload["rows"]), 2)
        self.assertEqual(payload["rows"][0], ["Climate claim", "Full Fact", "Evidence & context", "Today", "https://example.test/review"])
        self.assertIn("recent", payload["message"])

    def test_fact_check_feed_reports_partial_source_failures(self):
        feed = b'<rss><channel><item><title>A review</title></item></channel></rss>'
        with patch.object(server, "request_bytes", side_effect=[server.CollectionError("Unavailable"), feed]):
            payload = server.collect_fake_news("")
        self.assertEqual(payload["rows"][0][1], "FactCheck.org")
        self.assertIn("Unavailable", payload["message"])


class ApiTests(unittest.TestCase):
    def request_api(self, path):
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        try:
            import urllib.request

            with urllib.request.urlopen(f"http://127.0.0.1:{httpd.server_port}{path}") as response:
                payload = json.loads(response.read())
            return response.status, payload
        finally:
            httpd.shutdown()
            httpd.server_close()
            thread.join(timeout=3)

    def test_health_endpoint_reports_project_count(self):
        status, payload = self.request_api("/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(payload, {"ok": True, "projects": 23})

    def test_saved_history_endpoint_returns_persisted_rows(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(server, "DATABASE", Path(directory) / "fieldnotes.sqlite3"):
                server.persist("web-to-sql", [{"Headline": "Saved article"}])
                status, payload = self.request_api("/api/history/web-to-sql")
        self.assertEqual(status, 200)
        self.assertEqual(payload["headers"], ["Headline", "Snapshot time"])
        self.assertEqual(payload["rows"][0][0], "Saved article")


if __name__ == "__main__":
    unittest.main()
