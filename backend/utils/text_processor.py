from typing import List
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def extract_text_from_url(url: str) -> str:
    """Extract text content from a given URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        # Get text content
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        print(f"Error extracting text from {url}: {str(e)}")
        return ""

def get_links_from_url(url: str) -> List[str]:
    """Extract all links from a given URL."""
    links = []
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for link in soup.find_all('a'):
            href = link.get('href')
            if href:
                absolute_url = urljoin(url, href)
                links.append(absolute_url)
                
        return links
    except Exception as e:
        print(f"Error extracting links from {url}: {str(e)}")
        return []