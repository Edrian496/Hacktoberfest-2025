from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import requests
import random

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted sources
TRUSTED_SOURCES = [
    "dost.gov.ph",
    "phivolcs.dost.gov.ph",
    "pagasa.dost.gov.ph",
    "ndrrmc.gov.ph",
    "pna.gov.ph",
    "gov.ph",
    "who.int",
    "cdc.gov",
    "un.org",
]

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36",
]

class FactRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

    @field_validator('text', 'url', mode='after')
    @classmethod
    def validate_at_least_one(cls, v, info):
        return v

    def model_post_init(self, __context):
        if not self.text and not self.url:
            raise ValueError("Either 'text' or 'url' must be provided")

def is_trusted_source(url: str) -> bool:
    from urllib.parse import urlparse
    try:
        domain = urlparse(url).netloc.lower().replace("www.", "")
        return any(domain == t or domain.endswith("." + t) for t in TRUSTED_SOURCES)
    except:
        return False

def fetch_url_content(url: str) -> str:
    """Fetch content using sync Playwright (works on all sites, even JS-heavy)."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(user_agent=random.choice(USER_AGENTS))
        try:
            page.goto(url, timeout=30000)
            html = page.content()
        except Exception as e:
            browser.close()
            raise Exception(f"Failed to fetch URL: {e}")
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "iframe"]):
        tag.decompose()

    article = (
        soup.find('article') or
        soup.find('main') or
        soup.find('div', {'class': ['content', 'article', 'post', 'entry-content']}) or
        soup.find('div', {'id': ['content', 'main-content']})
    )
    paragraphs = article.find_all("p") if article else soup.find_all("p")
    content = "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))
    if not content:
        content = soup.get_text(separator="\n", strip=True)
    return "\n".join(line.strip() for line in content.split("\n") if line.strip())

def search_related_article(query: str) -> dict:
    try:
        search_url = f"https://www.bing.com/news/search?q={requests.utils.quote(query[:100])}"
        res = requests.get(search_url, headers={'User-Agent': random.choice(USER_AGENTS)}, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        first_article = soup.find("a", {"class": "title"}) or soup.select_one(".news-card a")
        if first_article and first_article.get("href"):
            return {"title": first_article.get_text(strip=True), "url": first_article["href"]}
    except Exception as e:
        print(f"Search error: {e}")
    return {"title": "No related article found", "url": ""}

@app.post("/fact-check")
def fact_check(request: FactRequest):
    content = ""
    source_url = request.url
    is_trusted = is_trusted_source(source_url) if source_url else False

    if request.url:
        try:
            content = fetch_url_content(request.url)
        except Exception as e:
            return {
                "verdict": "unable_to_verify",
                "confidence": 0,
                "explanation": f"Could not fetch content from URL: {str(e)[:200]}",
                "related_article": {},
                "is_trusted_source": is_trusted,
                "source_url": source_url
            }
    elif request.text:
        content = request.text
    else:
        return {
            "verdict": "unable_to_verify",
            "confidence": 0,
            "explanation": "No content provided.",
            "related_article": {},
            "is_trusted_source": False
        }

    if not content.strip():
        return {
            "verdict": "unable_to_verify",
            "confidence": 0,
            "explanation": "No content to analyze.",
            "related_article": {},
            "is_trusted_source": is_trusted,
            "source_url": source_url
        }

    content = content[:1000]
    verdict = "needs_review"
    confidence = 80 if is_trusted else 50
    text_lower = content.lower()

    if is_trusted:
        verdict = "likely_accurate"
        confidence = 85
    if "verified" in text_lower or "confirmed" in text_lower:
        confidence = min(confidence + 10, 95)
    if "unverified" in text_lower or "rumor" in text_lower:
        verdict = "misleading"
        confidence = 75

    related_article = search_related_article(content[:150])
    explanations = {
        "likely_accurate": "This information comes from a trusted source and appears accurate.",
        "needs_review": "This claim requires further verification from authoritative sources.",
        "misleading": "This information may contain inaccuracies or misleading elements.",
        "unable_to_verify": "Unable to access or verify the content."
    }

    return {
        "verdict": verdict,
        "confidence": confidence,
        "explanation": explanations.get(verdict, explanations["needs_review"]),
        "related_article": related_article,
        "is_trusted_source": is_trusted,
        "source_url": source_url
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
