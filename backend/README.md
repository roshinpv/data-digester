# AI Agent Creator Backend

This is the backend service for the AI Agent Creator application. It provides APIs for creating and managing AI agents, processing documents, and handling web crawling operations.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The server will start on http://localhost:8000

## API Endpoints

- POST /agents - Create a new agent
- GET /agents - List all agents
- DELETE /agents/{agent_id} - Delete an agent
- POST /agents/{agent_id}/upload - Upload a file to an agent

## Development

To run in development mode with auto-reload:
```bash
uvicorn main:app --reload
```