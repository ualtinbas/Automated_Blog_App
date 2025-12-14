import os, json, re
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_ID = os.getenv("MODEL_ID", "Qwen/Qwen2.5-0.5B-Instruct")
HF_TOKEN = os.getenv("HF_TOKEN")

app = FastAPI()

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, token=HF_TOKEN)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    token=HF_TOKEN,
    device_map="cpu",
    low_cpu_mem_usage=True,
)

def strip_fences(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^```[a-zA-Z]*\s*", "", s)
    s = re.sub(r"\s*```$", "", s)
    return s.strip()

def maybe_json_field(s: str, key: str):
    m = re.search(r"\{.*\}", s, re.DOTALL)
    if not m:
        return None
    try:
        obj = json.loads(m.group(0))
        if key in obj:
            return str(obj[key]).strip()
    except Exception:
        return None
    return None

def run_llm(messages, max_new_tokens=200, temperature=0.7, top_p=0.95):
    inputs = tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        add_generation_prompt=True,
        return_tensors="pt"
    )

    out = model.generate(
        inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=temperature,
        top_p=top_p,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.eos_token_id,
    )

    prompt_len = inputs.shape[-1]
    gen_only = out[0][prompt_len:]
    return tokenizer.decode(gen_only, skip_special_tokens=True).strip()

class GenReq(BaseModel):

    topic: str | None = None

class TitleReq(BaseModel):
    topic: str | None = None

@app.post("/generate-title")
def generate_title(req: TitleReq):
    topic = req.topic or "A short interesting blog topic"

    messages = [
      {"role": "system", "content": "Return ONLY valid JSON. No extra text."},
      {"role": "user", "content": f"""
Return ONLY this JSON:

{{
  "title": "",
  "brief": {{
    "angle": "",
    "audience": "",
    "keywords": ["", "", "", ""],
    "outline": ["", "", "", "", ""]
  }}
}}

Rules:
- title: 6-12 words, no colon ":".
- outline: 5 bullet section ideas that match the title.
Topic: {topic}
""".strip()}
    ]

    text = run_llm(messages, max_new_tokens=450, temperature=0.2, top_p=0.9)

    # Remove markdown fences if present
    clean = text.strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean, flags=re.I)
    clean = re.sub(r"\s*```$", "", clean)

    # Now extract JSON
    m = re.search(r"\{.*\}", clean, re.DOTALL)
    if not m:
        return {"error": "brief_failed", "raw": text}

    try:
        data = json.loads(m.group(0))
        return data
    except Exception:
        return {"error": "brief_failed", "raw": text}

class DescReq(BaseModel):
    title: str
    brief: dict

@app.post("/generate-desc")
def generate_desc(req: DescReq):
    messages = [
      {"role": "system", "content": "Write exactly 1-2 sentences. Plain text only. No quotes. No JSON."},
      {"role": "user", "content": f"""
Title: {req.title}
Angle: {req.brief.get("angle","")}
Audience: {req.brief.get("audience","")}
Keywords: {req.brief.get("keywords",[])}

Write a short blog post description (1-2 sentences).
""".strip()}
    ]

    raw = run_llm(messages, max_new_tokens=900, temperature=0.8)
    clean = strip_fences(raw)

    parsed = maybe_json_field(clean, "desc")
    desc = parsed if parsed else clean

    # optionally: force 1–2 sentences
    return {"desc": desc}

class ContentReq(BaseModel):
    title: str
    desc: str
    brief: dict

@app.post("/generate-content")
def generate_content(req: ContentReq):
    messages = [
      {"role": "system", "content": "Output HTML using ONLY <p> and <br>. No other tags. No markdown."},
      {"role": "user", "content": f"""
Title: {req.title}
Description: {req.desc}
Outline: {req.brief.get("outline", [])}
Keywords: {req.brief.get("keywords", [])}

Write 250-500 words as HTML using ONLY <p> and <br>.
Hard rules:
- Do NOT include <img>, <svg>, <iframe>, <script>, <style>, or any data: URLs.
""".strip()}
    ]

    raw = run_llm(messages, max_new_tokens=900, temperature=0.8)
    html = strip_fences(raw)

    # remove common prefaces
    html = re.sub(r"^\s*(here(?:'| i)s|here is).*\n", "", html, flags=re.I)

    # hard sanitize
    html = re.sub(r"<\s*img[^>]*>", "", html, flags=re.I)
    html = re.sub(r"<\s*(script|style|iframe|svg)[\s\S]*?<\s*/\s*\1\s*>", "", html, flags=re.I)
    html = re.sub(r"data:[^\"'\s>]+", "", html, flags=re.I)

    # optionally enforce only <p> and <br> by stripping other tags:
    html = re.sub(r"</?(?!p\b|br\b)[a-zA-Z0-9:-]+[^>]*>", "", html)

    return {"content": html.strip()}