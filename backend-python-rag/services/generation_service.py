"""
services/generation_service.py
-------------------------------
Wraps Gemini 1.5 Flash to generate grounded, cited legal answers
from retrieved ChromaDB context chunks.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini once at module level
_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if _API_KEY:
    genai.configure(api_key=_API_KEY)

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = genai.GenerativeModel("gemini-1.5-flash")
    return _model


SYSTEM_PROMPT = """You are NyayaMitra, a compassionate and knowledgeable legal assistant for India's first-time litigants.

Your role is to:
1. Answer questions clearly and simply, avoiding complex legal jargon.
2. Always ground your answer in the provided CONTEXT from legal documents.
3. If the answer is found in the context, cite the source file name.
4. If the context doesn't have enough information, say so honestly — do NOT hallucinate.
5. Support both Hindi and English. If the user asks in Hindi, answer in Hindi.
6. Always advise the user to consult a qualified lawyer for their specific situation.

Format your response as:
- A clear, plain-language answer (2–4 paragraphs)
- A "Sources" section listing the filenames you referenced
"""


def generate_answer(query: str, context_chunks: list[dict]) -> dict:
    """
    Generate a grounded RAG answer using Gemini 1.5 Flash.

    Args:
        query: The user's legal question.
        context_chunks: List of dicts with keys: text, filename, chunk_index, score.

    Returns:
        dict with keys: answer (str), sources (list[str])
    """
    if not context_chunks:
        return {
            "answer": (
                "मुझे इस प्रश्न के लिए प्रासंगिक दस्तावेज़ नहीं मिले। / "
                "I could not find relevant documents for this question. "
                "Please consult a qualified lawyer."
            ),
            "sources": [],
        }

    # Build context block with source labels
    context_lines = []
    sources = []
    for i, chunk in enumerate(context_chunks):
        filename = chunk.get("filename", "unknown")
        text = chunk.get("text", "")
        context_lines.append(f"[Source {i+1}: {filename}]\n{text}")
        if filename not in sources:
            sources.append(filename)

    context_block = "\n\n---\n\n".join(context_lines)

    prompt = f"""{SYSTEM_PROMPT}

CONTEXT:
{context_block}

USER QUESTION:
{query}

ANSWER:"""

    model = _get_model()
    response = model.generate_content(prompt)
    answer_text = response.text.strip()

    return {
        "answer": answer_text,
        "sources": sources,
    }
