import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'Chunking', label:'Chunking & Tokenization' },
  { key:'VectorDB', label:'Vector DB & Embeddings' },
  { key:'Retrieval', label:'Pre/Post Retrieval' },
  { key:'CacheHistory', label:'Cache & History DB' },
  { key:'DataTypes', label:'Data Types Testing' },
  { key:'Evaluation', label:'Output Evaluation' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { Chunking:'#e74c3c', VectorDB:'#3498db', Retrieval:'#9b59b6', CacheHistory:'#2ecc71', DataTypes:'#e67e22', Evaluation:'#1abc9c' };

const S = [
  {id:'RAG-001',title:'Document Chunking Strategy Comparison',layer:'Chunking',framework:'LangChain',language:'Python',difficulty:'Intermediate',
   description:'Compares fixed-size, semantic, and recursive character text splitting strategies for banking policy documents, measuring chunk quality, boundary preservation, and information completeness.',
   prerequisites:'LangChain 0.2+, tiktoken, Banking policy PDF corpus (10+ documents)',
   config:'CHUNK_SIZES=256,512,1024\nCHUNK_OVERLAP=50\nSPLITTER_TYPES=fixed,semantic,recursive\nTOKENIZER=cl100k_base\nINPUT_DIR=/data/banking_policies',
   code:`from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
    TokenTextSplitter
)
import tiktoken

doc = open("/data/banking_policies/lending_policy.txt").read()
enc = tiktoken.get_encoding("cl100k_base")

# Fixed-size splitting
fixed = CharacterTextSplitter(chunk_size=512, chunk_overlap=50)
fixed_chunks = fixed.split_text(doc)
assert all(len(c) <= 562 for c in fixed_chunks), "Fixed chunks exceed limit"

# Recursive splitting (respects paragraphs, sentences)
recursive = RecursiveCharacterTextSplitter(
    chunk_size=512, chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)
rec_chunks = recursive.split_text(doc)
boundary_ok = sum(1 for c in rec_chunks if c.endswith("."))
assert boundary_ok / len(rec_chunks) > 0.7, "Poor boundary preservation"

# Token-based splitting
token_splitter = TokenTextSplitter(
    encoding_name="cl100k_base", chunk_size=256, chunk_overlap=25
)
tok_chunks = token_splitter.split_text(doc)
for chunk in tok_chunks:
    tokens = enc.encode(chunk)
    assert len(tokens) <= 281, f"Token chunk exceeds limit: {len(tokens)}"

print(f"Fixed: {len(fixed_chunks)} chunks")
print(f"Recursive: {len(rec_chunks)} chunks, boundary={boundary_ok}")
print(f"Token: {len(tok_chunks)} chunks")
assert len(rec_chunks) >= len(fixed_chunks) * 0.8, "Recursive too fragmented"`,
   expectedOutput:`[TEST] RAG-001: Document Chunking Strategy Comparison
[INFO] Document loaded: lending_policy.txt (24,380 chars)
[PASS] Fixed-size splitter: 48 chunks (512 chars, 50 overlap)
[PASS] All fixed chunks within size limit (max=558)
[PASS] Recursive splitter: 52 chunks with boundary preservation
[PASS] Sentence boundary ratio: 0.84 (threshold: 0.70)
[PASS] Token splitter: 61 chunks (256 tokens, 25 overlap)
[PASS] All token chunks within token limit (max=278)
[INFO] Avg tokens/chunk: Fixed=198, Recursive=186, Token=251
[PASS] Recursive fragmentation within tolerance
[INFO] Recommended: RecursiveCharacterTextSplitter for policy docs
-----------------------------------
RAG-001: Chunking Strategy — 6 passed, 0 failed`},

  {id:'RAG-002',title:'Token Count Validation & Limits',layer:'Chunking',framework:'tiktoken / LangChain',language:'Python',difficulty:'Beginner',
   description:'Validates tokenizer accuracy across multiple encoding schemes, tests max token limit handling for LLM context windows, and ensures consistent token counting between chunking and embedding stages.',
   prerequisites:'tiktoken, LangChain 0.2+, Sample banking text corpus',
   config:'ENCODINGS=cl100k_base,p50k_base,o200k_base\nMAX_CONTEXT_WINDOW=8192\nRESERVED_TOKENS=512\nMODEL=gpt-4o',
   code:`import tiktoken

# Test encoding consistency across models
encodings = {
    "cl100k_base": tiktoken.get_encoding("cl100k_base"),
    "o200k_base": tiktoken.get_encoding("o200k_base"),
}

banking_text = """The customer's fixed deposit of INR 5,00,000
matures on 15-Mar-2026 with 7.25% p.a. interest compounded
quarterly. Early withdrawal penalty: 1% of principal."""

for name, enc in encodings.items():
    tokens = enc.encode(banking_text)
    decoded = enc.decode(tokens)
    assert decoded == banking_text, f"{name}: decode mismatch"
    print(f"{name}: {len(tokens)} tokens, roundtrip OK")

# Test context window limit enforcement
enc = tiktoken.get_encoding("cl100k_base")
max_ctx = 8192
reserved = 512
max_input = max_ctx - reserved

long_doc = banking_text * 200
tokens = enc.encode(long_doc)
if len(tokens) > max_input:
    truncated = enc.decode(tokens[:max_input])
    assert len(enc.encode(truncated)) <= max_input

# Test special characters in banking context
special_texts = [
    "Account #12345-67890 Balance: \\$1,234.56",
    "SWIFT: SBININBB104 | IFSC: SBIN0001234",
    "KYC Status: \\u2713 Verified | PAN: ABCDE1234F",
]
for text in special_texts:
    tokens = enc.encode(text)
    assert enc.decode(tokens) == text, f"Special char roundtrip failed"
    print(f"Special text OK: {len(tokens)} tokens")`,
   expectedOutput:`[TEST] RAG-002: Token Count Validation & Limits
[PASS] cl100k_base: 52 tokens, roundtrip decode verified
[PASS] o200k_base: 48 tokens, roundtrip decode verified
[INFO] Token variance across encodings: 4 tokens (7.7%)
[PASS] Context window enforcement: 8192 max, 512 reserved
[INFO] Long document: 10,400 tokens truncated to 7,680
[PASS] Truncation preserves valid token boundaries
[PASS] Account number with special chars: 14 tokens, roundtrip OK
[PASS] SWIFT/IFSC codes: 18 tokens, roundtrip OK
[PASS] Unicode checkmark + PAN format: 16 tokens, roundtrip OK
[INFO] All banking-specific text patterns tokenized correctly
-----------------------------------
RAG-002: Token Validation — 7 passed, 0 failed`},

  {id:'RAG-003',title:'Chunk Overlap & Context Preservation',layer:'Chunking',framework:'LlamaIndex',language:'Python',difficulty:'Advanced',
   description:'Tests chunk overlap strategies to ensure critical cross-boundary information (e.g., loan terms spanning paragraphs) is preserved during document splitting for banking knowledge bases.',
   prerequisites:'LlamaIndex 0.10+, SentenceTransformers, Banking document corpus',
   config:'OVERLAP_SIZES=0,25,50,100\nCHUNK_SIZE=512\nSIMILARITY_THRESHOLD=0.85\nEMBEDDING_MODEL=all-MiniLM-L6-v2\nDOC_PATH=/data/loan_agreements',
   code:`from llama_index.core.node_parser import SentenceSplitter
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

doc_text = open("/data/loan_agreements/home_loan_terms.txt").read()

overlaps = [0, 25, 50, 100]
results = {}

for overlap in overlaps:
    parser = SentenceSplitter(chunk_size=512, chunk_overlap=overlap)
    from llama_index.core import Document
    nodes = parser.get_nodes_from_documents([Document(text=doc_text)])

    # Check boundary information preservation
    boundary_pairs = []
    for i in range(len(nodes) - 1):
        end_text = nodes[i].text[-overlap:] if overlap > 0 else ""
        start_text = nodes[i+1].text[:overlap] if overlap > 0 else ""
        if overlap > 0:
            emb_end = model.encode([end_text])
            emb_start = model.encode([start_text])
            sim = np.dot(emb_end[0], emb_start[0]) / (
                np.linalg.norm(emb_end[0]) * np.linalg.norm(emb_start[0])
            )
            boundary_pairs.append(sim)

    avg_sim = np.mean(boundary_pairs) if boundary_pairs else 0
    results[overlap] = {
        "chunks": len(nodes),
        "avg_boundary_sim": round(float(avg_sim), 4),
    }
    print(f"Overlap={overlap}: {len(nodes)} chunks, sim={avg_sim:.4f}")

# Overlap=50+ should have meaningful boundary similarity
assert results[50]["avg_boundary_sim"] > 0.85, "Overlap 50 too low"
assert results[100]["avg_boundary_sim"] > results[25]["avg_boundary_sim"]
assert results[0]["avg_boundary_sim"] == 0, "Zero overlap should be 0"`,
   expectedOutput:`[TEST] RAG-003: Chunk Overlap & Context Preservation
[INFO] Document loaded: home_loan_terms.txt (18,720 chars)
[PASS] Overlap=0: 37 chunks, boundary similarity=0.0000
[PASS] Overlap=25: 39 chunks, boundary similarity=0.7823
[PASS] Overlap=50: 41 chunks, boundary similarity=0.8912
[PASS] Overlap=100: 44 chunks, boundary similarity=0.9347
[PASS] Overlap=50 exceeds threshold (0.89 > 0.85)
[PASS] Overlap=100 > Overlap=25 similarity (monotonic increase)
[INFO] Optimal overlap for loan docs: 50 chars (cost/quality balance)
[INFO] Cross-boundary terms preserved: interest rate, EMI schedule
[PASS] Zero overlap correctly reports 0 similarity
-----------------------------------
RAG-003: Chunk Overlap — 7 passed, 0 failed`},

  {id:'RAG-004',title:'Embedding Generation & Quality',layer:'VectorDB',framework:'SentenceTransformers / OpenAI',language:'Python',difficulty:'Intermediate',
   description:'Validates embedding generation quality for banking domain text, tests semantic similarity between related concepts, and ensures embedding dimensions match vector store configuration.',
   prerequisites:'SentenceTransformers, OpenAI API key (optional), ChromaDB, Banking text samples',
   config:'EMBEDDING_MODEL=all-MiniLM-L6-v2\nEXPECTED_DIM=384\nSIMILARITY_THRESHOLD=0.75\nOPENAI_MODEL=text-embedding-3-small\nOPENAI_DIM=1536',
   code:`from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# Banking domain semantic pairs (should be similar)
similar_pairs = [
    ("fixed deposit interest rate", "FD maturity returns"),
    ("home loan EMI calculation", "mortgage monthly installment"),
    ("KYC document verification", "customer identity validation"),
]

# Dissimilar pairs (should be distant)
dissimilar_pairs = [
    ("fixed deposit interest rate", "credit card fraud detection"),
    ("home loan EMI calculation", "stock market trading volume"),
]

# Test embedding dimensions
test_emb = model.encode(["test banking query"])
assert test_emb.shape[1] == 384, f"Dimension mismatch: {test_emb.shape[1]}"

# Test semantic similarity for related concepts
for text_a, text_b in similar_pairs:
    emb_a, emb_b = model.encode([text_a]), model.encode([text_b])
    sim = np.dot(emb_a[0], emb_b[0]) / (
        np.linalg.norm(emb_a[0]) * np.linalg.norm(emb_b[0]))
    assert sim > 0.75, f"Low similarity: {text_a} vs {text_b} = {sim}"
    print(f"Similar: {sim:.4f} | {text_a} <-> {text_b}")

# Test dissimilar pairs have lower scores
for text_a, text_b in dissimilar_pairs:
    emb_a, emb_b = model.encode([text_a]), model.encode([text_b])
    sim = np.dot(emb_a[0], emb_b[0]) / (
        np.linalg.norm(emb_a[0]) * np.linalg.norm(emb_b[0]))
    assert sim < 0.5, f"Too similar: {text_a} vs {text_b} = {sim}"
    print(f"Dissimilar: {sim:.4f} | {text_a} <-> {text_b}")

# Test embedding normalization
norms = np.linalg.norm(test_emb, axis=1)
assert np.allclose(norms, 1.0, atol=0.01), "Embeddings not normalized"`,
   expectedOutput:`[TEST] RAG-004: Embedding Generation & Quality
[PASS] Embedding dimension: 384 (expected: 384)
[PASS] Similar: 0.8234 | fixed deposit interest rate <-> FD maturity returns
[PASS] Similar: 0.8567 | home loan EMI calculation <-> mortgage monthly installment
[PASS] Similar: 0.7912 | KYC document verification <-> customer identity validation
[PASS] Dissimilar: 0.2341 | fixed deposit interest rate <-> credit card fraud detection
[PASS] Dissimilar: 0.1876 | home loan EMI calculation <-> stock market trading volume
[PASS] Embedding normalization: L2 norm = 1.0000
[INFO] Model: all-MiniLM-L6-v2 | Encoding speed: 142 texts/sec
[INFO] Banking domain semantic clusters validated
-----------------------------------
RAG-004: Embedding Quality — 7 passed, 0 failed`},

  {id:'RAG-005',title:'Vector Similarity Search Accuracy',layer:'VectorDB',framework:'ChromaDB / FAISS',language:'Python',difficulty:'Intermediate',
   description:'Tests vector similarity search using cosine and L2 distance metrics in ChromaDB, validates top-k retrieval accuracy, and benchmarks index performance for banking FAQ knowledge base.',
   prerequisites:'ChromaDB 0.4+, FAISS, SentenceTransformers, Banking FAQ dataset (100+ entries)',
   config:'CHROMA_PATH=/data/chroma_db\nCOLLECTION=banking_faq\nTOP_K=5\nDISTANCE_METRIC=cosine\nEMBEDDING_MODEL=all-MiniLM-L6-v2',
   code:`import chromadb
from chromadb.utils import embedding_functions

ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)
client = chromadb.PersistentClient(path="/data/chroma_db")

# Create collection with cosine distance
collection = client.get_or_create_collection(
    name="banking_faq", embedding_function=ef,
    metadata={"hnsw:space": "cosine"}
)

# Seed banking FAQ data
faqs = [
    "How to open a savings account online",
    "Fixed deposit interest rates for senior citizens",
    "Home loan eligibility criteria and documents required",
    "Credit card bill payment due date and late fees",
    "NEFT RTGS IMPS transfer limits and charges",
    "Debit card PIN reset process through ATM",
    "NRI account types NRE NRO FCNR differences",
    "Locker facility availability and annual rental charges",
]
collection.upsert(
    ids=[f"faq_{i}" for i in range(len(faqs))],
    documents=faqs
)

# Test cosine similarity search
queries = [
    ("savings account opening process", "faq_0"),
    ("FD rates for elderly customers", "faq_1"),
    ("housing loan documents needed", "faq_2"),
]
for query, expected_id in queries:
    results = collection.query(query_texts=[query], n_results=3)
    top_id = results["ids"][0][0]
    top_dist = results["distances"][0][0]
    assert top_id == expected_id, f"Wrong top result: {top_id}"
    assert top_dist < 0.5, f"Distance too high: {top_dist}"
    print(f"Query: {query} -> Top: {top_id}, dist={top_dist:.4f}")

# Benchmark search latency
import time
start = time.time()
for _ in range(100):
    collection.query(query_texts=["account balance check"], n_results=5)
avg_ms = ((time.time() - start) / 100) * 1000
assert avg_ms < 50, f"Search too slow: {avg_ms:.1f}ms"`,
   expectedOutput:`[TEST] RAG-005: Vector Similarity Search Accuracy
[INFO] ChromaDB collection: banking_faq (8 documents)
[PASS] Query: savings account opening -> Top: faq_0, dist=0.1823
[PASS] Query: FD rates for elderly -> Top: faq_1, dist=0.2104
[PASS] Query: housing loan documents -> Top: faq_2, dist=0.1956
[PASS] All top-1 results match expected FAQ entries
[PASS] All distances below threshold (max=0.2104 < 0.50)
[INFO] Benchmarking: 100 queries on 8-doc collection
[PASS] Avg search latency: 3.2ms (threshold: 50ms)
[INFO] Distance metric: cosine | Index: HNSW
[INFO] Top-3 recall@3: 100% for test queries
-----------------------------------
RAG-005: Vector Search — 6 passed, 0 failed`},

  {id:'RAG-006',title:'Vector Upsert, Delete & Index Integrity',layer:'VectorDB',framework:'ChromaDB / Pinecone',language:'Python',difficulty:'Advanced',
   description:'Tests CRUD operations on vector databases including upsert with metadata, selective deletion, index rebuilding, and data integrity validation for banking document vectors.',
   prerequisites:'ChromaDB 0.4+, Pinecone client (optional), SentenceTransformers',
   config:'CHROMA_PATH=/data/chroma_test\nCOLLECTION=banking_docs\nNAMESPACE=loan_products\nINDEX_TYPE=hnsw\nEF_CONSTRUCTION=200',
   code:`import chromadb
from chromadb.utils import embedding_functions
import uuid

ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)
client = chromadb.PersistentClient(path="/data/chroma_test")

# Clean slate
try:
    client.delete_collection("banking_crud_test")
except:
    pass
col = client.create_collection("banking_crud_test", embedding_function=ef)

# Test 1: Upsert with metadata
doc_ids = [str(uuid.uuid4()) for _ in range(5)]
col.upsert(
    ids=doc_ids,
    documents=[
        "Home loan interest rate 8.5% for salaried employees",
        "Personal loan processing fee waiver for existing customers",
        "Car loan maximum tenure 7 years with flexible EMI",
        "Education loan moratorium period until course completion",
        "Gold loan instant disbursement within 30 minutes",
    ],
    metadatas=[
        {"product": "home_loan", "rate": 8.5, "active": True},
        {"product": "personal_loan", "rate": 10.5, "active": True},
        {"product": "car_loan", "rate": 9.0, "active": True},
        {"product": "education_loan", "rate": 7.5, "active": True},
        {"product": "gold_loan", "rate": 11.0, "active": False},
    ]
)
assert col.count() == 5, f"Expected 5, got {col.count()}"

# Test 2: Metadata filter query
results = col.query(
    query_texts=["loan interest rate"],
    n_results=3,
    where={"active": True}
)
assert len(results["ids"][0]) == 3
assert all(m["active"] for m in results["metadatas"][0])

# Test 3: Update existing document
col.update(ids=[doc_ids[0]], documents=[
    "Home loan revised rate 8.25% for salaried with CIBIL 750+"
], metadatas=[{"product": "home_loan", "rate": 8.25, "active": True}])
updated = col.get(ids=[doc_ids[0]])
assert updated["metadatas"][0]["rate"] == 8.25

# Test 4: Delete and verify
col.delete(ids=[doc_ids[4]])
assert col.count() == 4
remaining = col.get(ids=[doc_ids[4]])
assert len(remaining["ids"]) == 0, "Deleted doc still exists"`,
   expectedOutput:`[TEST] RAG-006: Vector Upsert, Delete & Index Integrity
[INFO] Collection created: banking_crud_test
[PASS] Upsert: 5 documents with metadata inserted
[PASS] Collection count: 5 (expected: 5)
[PASS] Metadata filter: 3 active loan results returned
[PASS] All filtered results have active=True
[PASS] Update: home_loan rate changed 8.5 -> 8.25
[PASS] Updated metadata verified: rate=8.25
[PASS] Delete: gold_loan document removed
[PASS] Collection count after delete: 4 (expected: 4)
[PASS] Deleted document not retrievable (confirmed purged)
[INFO] Index type: HNSW | Integrity check: passed
-----------------------------------
RAG-006: Vector CRUD — 9 passed, 0 failed`},

  {id:'RAG-007',title:'Query Rewriting & HyDE Expansion',layer:'Retrieval',framework:'LangChain',language:'Python',difficulty:'Advanced',
   description:'Tests pre-retrieval query enhancement techniques including query rewriting, Hypothetical Document Embedding (HyDE), and multi-query generation for improving retrieval of banking product information.',
   prerequisites:'LangChain 0.2+, OpenAI API or local LLM, ChromaDB, Banking knowledge base',
   config:'LLM_MODEL=gpt-4o-mini\nVECTOR_STORE=chroma\nCOLLECTION=banking_products\nHYDE_ENABLED=true\nMULTI_QUERY_COUNT=3',
   code:`from langchain.retrievers import MultiQueryRetriever
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(
    persist_directory="/data/chroma_banking",
    embedding_function=embeddings
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Test 1: Multi-query generation
retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    llm=llm
)
query = "What are the charges for international transfers?"
docs = retriever.get_relevant_documents(query)
assert len(docs) >= 3, f"Too few results: {len(docs)}"
print(f"Multi-query returned {len(docs)} unique documents")

# Test 2: HyDE - generate hypothetical answer, embed it
hyde_prompt = PromptTemplate(
    input_variables=["question"],
    template="Write a short banking FAQ answer for: {question}"
)
hyde_answer = llm.predict(
    hyde_prompt.format(question="How to set up auto-debit for EMI?")
)
assert len(hyde_answer) > 50, "HyDE answer too short"
hyde_docs = vectorstore.similarity_search(hyde_answer, k=3)
assert len(hyde_docs) >= 2, "HyDE retrieval too few results"

# Test 3: Query rewriting for ambiguous input
rewrites = llm.predict(
    "Rewrite this vague banking query into 3 specific queries "
    "(one per line): 'account problem'"
).strip().split("\\n")
assert len(rewrites) >= 3, f"Expected 3 rewrites, got {len(rewrites)}"
for rw in rewrites[:3]:
    rw_docs = vectorstore.similarity_search(rw.strip(), k=2)
    assert len(rw_docs) > 0, f"No results for rewrite: {rw}"
    print(f"Rewrite: {rw.strip()[:60]} -> {len(rw_docs)} docs")`,
   expectedOutput:`[TEST] RAG-007: Query Rewriting & HyDE Expansion
[INFO] Vector store loaded: banking_products (1,247 documents)
[PASS] Multi-query: generated 3 sub-queries from original
[PASS] Multi-query retrieval: 8 unique documents (deduplicated)
[INFO] Sub-queries: international wire fees, forex charges, SWIFT costs
[PASS] HyDE: hypothetical answer generated (127 chars)
[PASS] HyDE retrieval: 3 relevant documents found
[INFO] HyDE similarity boost: +0.12 avg vs direct query
[PASS] Query rewriting: 3 specific rewrites from "account problem"
[PASS] Rewrite 1: "How to check account balance online" -> 2 docs
[PASS] Rewrite 2: "Account locked or frozen resolution" -> 2 docs
[PASS] Rewrite 3: "Account statement download issues" -> 2 docs
-----------------------------------
RAG-007: Query Enhancement — 8 passed, 0 failed`},

  {id:'RAG-008',title:'Re-Ranking & Relevance Scoring',layer:'Retrieval',framework:'LangChain / Cohere',language:'Python',difficulty:'Intermediate',
   description:'Tests post-retrieval re-ranking using cross-encoder models to improve result ordering, validates relevance scoring, and measures re-ranking impact on answer quality for banking queries.',
   prerequisites:'sentence-transformers, cross-encoder model, ChromaDB with banking data',
   config:'RERANKER_MODEL=cross-encoder/ms-marco-MiniLM-L-6-v2\nTOP_K_INITIAL=20\nTOP_K_RERANKED=5\nRELEVANCE_THRESHOLD=0.5\nVECTOR_STORE=chroma',
   code:`from sentence_transformers import CrossEncoder
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(
    persist_directory="/data/chroma_banking",
    embedding_function=embeddings
)

query = "What is the penalty for early FD withdrawal?"

# Step 1: Initial retrieval (broad, top-20)
initial_docs = vectorstore.similarity_search(query, k=20)
assert len(initial_docs) >= 10, "Too few initial results"

# Step 2: Re-rank with cross-encoder
pairs = [(query, doc.page_content) for doc in initial_docs]
scores = reranker.predict(pairs)

ranked = sorted(
    zip(initial_docs, scores), key=lambda x: x[1], reverse=True
)

# Verify re-ranking changed order
original_order = [d.page_content[:50] for d in initial_docs[:5]]
reranked_order = [d.page_content[:50] for d, s in ranked[:5]]
assert original_order != reranked_order, "Re-ranking had no effect"

# Top-5 after re-ranking should be highly relevant
top5_scores = [s for _, s in ranked[:5]]
assert all(s > 0.5 for s in top5_scores), "Low relevance in top-5"
assert top5_scores[0] > top5_scores[-1], "Scores not descending"

# Check that FD-related content is prioritized
top5_content = " ".join([d.page_content for d, _ in ranked[:5]])
assert any(kw in top5_content.lower() for kw in
    ["fixed deposit", "fd", "premature withdrawal", "penalty"])

print(f"Initial: {len(initial_docs)} docs")
print(f"Top-5 scores: {[f'{s:.4f}' for s in top5_scores]}")
print(f"Re-ranking changed top-5 order: True")`,
   expectedOutput:`[TEST] RAG-008: Re-Ranking & Relevance Scoring
[INFO] Initial retrieval: 20 documents from vector search
[PASS] Cross-encoder re-ranking applied (20 pairs scored)
[PASS] Re-ranking changed document ordering (top-5 shuffled)
[PASS] Top-5 scores: [0.9234, 0.8876, 0.8543, 0.7912, 0.6234]
[PASS] All top-5 scores above relevance threshold (0.50)
[PASS] Scores in descending order confirmed
[PASS] FD/penalty content prioritized in top-5 results
[INFO] Avg score improvement: top-1 moved from rank 4 to rank 1
[INFO] Reranker: cross-encoder/ms-marco-MiniLM-L-6-v2
[INFO] Latency: initial=12ms, rerank=45ms, total=57ms
-----------------------------------
RAG-008: Re-Ranking — 6 passed, 0 failed`},

  {id:'RAG-009',title:'MMR & Context Compression',layer:'Retrieval',framework:'LangChain',language:'Python',difficulty:'Advanced',
   description:'Tests Maximal Marginal Relevance (MMR) for diverse retrieval results and context compression to reduce redundancy in retrieved banking documents before LLM generation.',
   prerequisites:'LangChain 0.2+, LLMChainExtractor, ChromaDB, Banking policy documents',
   config:'MMR_LAMBDA=0.7\nFETCH_K=20\nRETURN_K=5\nCOMPRESSOR_MODEL=gpt-4o-mini\nMAX_COMPRESSED_TOKENS=500',
   code:`from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.chat_models import ChatOpenAI
import numpy as np

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(
    persist_directory="/data/chroma_banking",
    embedding_function=embeddings
)

query = "What documents are needed for a home loan application?"

# Test 1: Standard similarity search (may have duplicates)
std_docs = vectorstore.similarity_search(query, k=5)

# Test 2: MMR search (diverse results)
mmr_docs = vectorstore.max_marginal_relevance_search(
    query, k=5, fetch_k=20, lambda_mult=0.7
)
assert len(mmr_docs) == 5, f"MMR returned {len(mmr_docs)} docs"

# Measure diversity: pairwise similarity should be lower for MMR
def pairwise_sim(docs):
    embs = embeddings.embed_documents([d.page_content for d in docs])
    embs = np.array(embs)
    sims = []
    for i in range(len(embs)):
        for j in range(i+1, len(embs)):
            sim = np.dot(embs[i], embs[j]) / (
                np.linalg.norm(embs[i]) * np.linalg.norm(embs[j]))
            sims.append(sim)
    return np.mean(sims)

std_sim = pairwise_sim(std_docs)
mmr_sim = pairwise_sim(mmr_docs)
assert mmr_sim < std_sim, "MMR not more diverse than standard"
print(f"Standard avg pairwise sim: {std_sim:.4f}")
print(f"MMR avg pairwise sim: {mmr_sim:.4f}")

# Test 3: Context compression
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 5})
)
compressed_docs = compression_retriever.get_relevant_documents(query)
original_len = sum(len(d.page_content) for d in std_docs)
compressed_len = sum(len(d.page_content) for d in compressed_docs)
ratio = compressed_len / original_len
assert ratio < 0.6, f"Compression ratio too high: {ratio:.2f}"
print(f"Compression: {original_len} -> {compressed_len} chars ({ratio:.2%})")`,
   expectedOutput:`[TEST] RAG-009: MMR & Context Compression
[INFO] Vector store: 1,247 banking documents loaded
[PASS] Standard search: 5 documents retrieved
[PASS] MMR search: 5 diverse documents retrieved (lambda=0.7)
[PASS] MMR diversity: avg pairwise sim=0.4123 < standard=0.7234
[INFO] Diversity improvement: 43.0% lower inter-document similarity
[PASS] MMR results cover: income proof, property docs, KYC, CIBIL, employer letter
[PASS] Context compression applied: 5 docs compressed
[PASS] Compression ratio: 4,280 -> 1,890 chars (44.2%)
[INFO] Compressed output retains key: documents list, eligibility criteria
[PASS] Compression ratio below threshold (0.44 < 0.60)
-----------------------------------
RAG-009: MMR & Compression — 7 passed, 0 failed`},

  {id:'RAG-010',title:'Semantic Cache Hit & Miss Validation',layer:'CacheHistory',framework:'GPTCache / Redis',language:'Python',difficulty:'Intermediate',
   description:'Tests semantic caching for RAG queries using vector similarity to detect cache hits, validates cache invalidation, and measures latency improvement for repeated banking queries.',
   prerequisites:'Redis 7+, GPTCache or custom semantic cache, SentenceTransformers',
   config:'REDIS_URL=redis://cache.bank.local:6379/0\nCACHE_THRESHOLD=0.92\nCACHE_TTL=3600\nEMBEDDING_MODEL=all-MiniLM-L6-v2\nMAX_CACHE_SIZE=10000',
   code:`import redis
import json
import time
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
r = redis.Redis(host="cache.bank.local", port=6379, db=0)
r.flushdb()

THRESHOLD = 0.92
cache_store = {}

def cache_set(query, response):
    emb = model.encode([query])[0]
    key = f"rag_cache:{hash(query)}"
    r.setex(key, 3600, json.dumps({
        "query": query, "response": response,
        "embedding": emb.tolist()
    }))
    cache_store[key] = emb

def cache_get(query):
    emb = model.encode([query])[0]
    for key, cached_emb in cache_store.items():
        sim = np.dot(emb, cached_emb) / (
            np.linalg.norm(emb) * np.linalg.norm(cached_emb))
        if sim >= THRESHOLD:
            data = r.get(key)
            if data:
                return json.loads(data)["response"], sim
    return None, 0.0

# Seed cache with banking queries
cache_set("What is the FD interest rate for 1 year?",
    "The FD rate for 1 year tenure is 7.25% p.a.")
cache_set("How to apply for a credit card online?",
    "Visit net banking > Cards > Apply for Credit Card.")

# Test exact match (should hit)
resp, sim = cache_get("What is the FD interest rate for 1 year?")
assert resp is not None, "Exact match should hit cache"
assert sim >= 0.99, f"Exact match sim too low: {sim}"

# Test semantic match (slightly different phrasing)
resp2, sim2 = cache_get("FD interest rate for one year tenure?")
assert resp2 is not None, "Semantic match should hit cache"
assert sim2 >= THRESHOLD, f"Semantic sim below threshold: {sim2}"

# Test cache miss (different topic)
resp3, sim3 = cache_get("How to block a lost debit card?")
assert resp3 is None, "Unrelated query should miss cache"
assert sim3 < THRESHOLD, f"Miss sim too high: {sim3}"

# Test cache invalidation
r.flushdb()
cache_store.clear()
resp4, _ = cache_get("What is the FD interest rate for 1 year?")
assert resp4 is None, "Cache should be empty after flush"`,
   expectedOutput:`[TEST] RAG-010: Semantic Cache Hit & Miss Validation
[INFO] Redis connected: cache.bank.local:6379, DB flushed
[INFO] Cache seeded: 2 banking query-response pairs
[PASS] Exact match: cache HIT (similarity=0.9999)
[PASS] Response: "The FD rate for 1 year tenure is 7.25% p.a."
[PASS] Semantic match: cache HIT (similarity=0.9456)
[INFO] Query variation: "FD interest rate for one year tenure?"
[PASS] Dissimilar query: cache MISS (similarity=0.2341)
[PASS] Unrelated topic correctly missed cache
[PASS] Cache invalidation: flush confirmed, all keys removed
[PASS] Post-flush query returns None (cache empty)
[INFO] Cache threshold: 0.92 | TTL: 3600s | Latency saved: ~450ms
-----------------------------------
RAG-010: Semantic Cache — 7 passed, 0 failed`},

  {id:'RAG-011',title:'Conversation History & Context Window',layer:'CacheHistory',framework:'LangChain / Redis',language:'Python',difficulty:'Intermediate',
   description:'Tests conversation history storage and retrieval, validates context window management for multi-turn banking support conversations, and ensures proper history truncation.',
   prerequisites:'LangChain 0.2+, Redis 7+, ChatOpenAI or local LLM',
   config:'REDIS_URL=redis://cache.bank.local:6379/1\nMAX_HISTORY=20\nMAX_TOKENS=4096\nCONTEXT_STRATEGY=sliding_window\nSESSION_TTL=1800',
   code:`from langchain.memory import ConversationBufferWindowMemory
from langchain.memory import ConversationSummaryBufferMemory
from langchain.chat_models import ChatOpenAI
import tiktoken
import json
import redis

r = redis.Redis(host="cache.bank.local", port=6379, db=1)
enc = tiktoken.get_encoding("cl100k_base")

# Test 1: Sliding window memory (last K turns)
window_memory = ConversationBufferWindowMemory(k=5, return_messages=True)

turns = [
    ("What is my account balance?", "Your savings balance is INR 45,230."),
    ("Show last 5 transactions", "Here are your recent transactions..."),
    ("Transfer 5000 to account 1234", "Transfer initiated. OTP sent."),
    ("OTP is 483921", "Transfer of INR 5,000 confirmed."),
    ("What is my new balance?", "Updated balance: INR 40,230."),
    ("Show FD rates", "Current FD rates: 1yr=7.25%, 2yr=7.50%"),
    ("Open FD for 50000", "FD opened: INR 50,000 for 1 year at 7.25%"),
]

for human, ai in turns:
    window_memory.save_context({"input": human}, {"output": ai})

history = window_memory.load_memory_variables({})
messages = history["history"]
assert len(messages) == 10, f"Expected 10 messages (5 turns), got {len(messages)}"

# Verify oldest turns were evicted
full_text = " ".join([m.content for m in messages])
assert "account balance" not in full_text.lower(), "Old turn not evicted"
assert "FD opened" in full_text, "Recent turn missing"

# Test 2: Token-aware context management
all_history = " ".join([f"H:{h} A:{a}" for h, a in turns])
total_tokens = len(enc.encode(all_history))
max_tokens = 200
if total_tokens > max_tokens:
    truncated_tokens = enc.encode(all_history)[-max_tokens:]
    truncated = enc.decode(truncated_tokens)
    assert len(enc.encode(truncated)) <= max_tokens

# Test 3: Session persistence in Redis
session_id = "sess_banking_001"
r.setex(f"chat:{session_id}", 1800, json.dumps(
    [{"role": "user", "content": h, "response": a} for h, a in turns]
))
stored = json.loads(r.get(f"chat:{session_id}"))
assert len(stored) == 7, f"Expected 7 turns stored, got {len(stored)}"
ttl = r.ttl(f"chat:{session_id}")
assert ttl > 0 and ttl <= 1800, f"TTL invalid: {ttl}"`,
   expectedOutput:`[TEST] RAG-011: Conversation History & Context Window
[INFO] Testing sliding window memory (k=5)
[PASS] Window memory: 10 messages retained (5 turns)
[PASS] Oldest turns evicted: "account balance" not in window
[PASS] Recent turns preserved: "FD opened" found in window
[INFO] Total conversation: 7 turns, window retains last 5
[PASS] Token-aware truncation: 312 tokens -> 200 tokens
[PASS] Truncated context within token limit
[PASS] Redis session stored: 7 turns for sess_banking_001
[PASS] Session TTL: 1800 seconds (30 minutes)
[INFO] Context strategy: sliding_window | Max history: 20
[INFO] Eviction order: FIFO (oldest turns removed first)
-----------------------------------
RAG-011: History & Context — 7 passed, 0 failed`},

  {id:'RAG-012',title:'Cache Invalidation & Historical Query',layer:'CacheHistory',framework:'Redis / Python',language:'Python',difficulty:'Advanced',
   description:'Tests cache invalidation strategies including TTL-based, event-driven, and version-based invalidation for banking data that changes (rates, policies), plus historical query retrieval for audit compliance.',
   prerequisites:'Redis 7+, Banking rate update event system, Audit log database',
   config:'REDIS_URL=redis://cache.bank.local:6379/2\nCACHE_VERSION_KEY=rag_cache_version\nRATE_UPDATE_CHANNEL=rate_updates\nAUDIT_RETENTION_DAYS=365',
   code:`import redis
import json
import time
from datetime import datetime, timedelta

r = redis.Redis(host="cache.bank.local", port=6379, db=2)
r.flushdb()

# Test 1: TTL-based invalidation
r.setex("rag:fd_rates", 60, json.dumps({
    "query": "FD rates", "response": "1yr: 7.25%, 2yr: 7.50%",
    "cached_at": datetime.utcnow().isoformat()
}))
assert r.get("rag:fd_rates") is not None, "Cache should exist"
ttl = r.ttl("rag:fd_rates")
assert 0 < ttl <= 60, f"TTL invalid: {ttl}"

# Test 2: Version-based invalidation
r.set("rag_cache_version", "v1")
r.set("rag:v1:loan_rates", json.dumps({"rate": "8.5%"}))
r.set("rag:v1:fd_rates", json.dumps({"rate": "7.25%"}))

# Simulate rate update event
new_version = "v2"
r.set("rag_cache_version", new_version)
# Old version keys become stale
old_keys = list(r.scan_iter("rag:v1:*"))
for key in old_keys:
    r.delete(key)
assert r.get("rag:v1:loan_rates") is None, "Old version not purged"

# Seed new version
r.set(f"rag:{new_version}:loan_rates", json.dumps({"rate": "8.25%"}))
current_version = r.get("rag_cache_version").decode()
new_data = json.loads(r.get(f"rag:{current_version}:loan_rates"))
assert new_data["rate"] == "8.25%", "New rate not set"

# Test 3: Pub/Sub event-driven invalidation
pubsub = r.pubsub()
pubsub.subscribe("rate_updates")
r.publish("rate_updates", json.dumps({
    "event": "RATE_CHANGE", "product": "home_loan",
    "old_rate": "8.5%", "new_rate": "8.25%",
    "timestamp": datetime.utcnow().isoformat()
}))
msg = pubsub.get_message(timeout=2)  # subscription confirmation
msg = pubsub.get_message(timeout=2)  # actual message
assert msg is not None and msg["type"] == "message"
event = json.loads(msg["data"])
assert event["event"] == "RATE_CHANGE"

# Test 4: Audit trail for historical queries
audit_key = f"audit:queries:{datetime.utcnow().strftime('%Y%m%d')}"
r.rpush(audit_key, json.dumps({
    "query": "home loan rate", "user": "CUST001",
    "timestamp": datetime.utcnow().isoformat(),
    "cache_hit": False, "response_time_ms": 234
}))
r.expire(audit_key, 365 * 86400)
audit_log = r.lrange(audit_key, 0, -1)
assert len(audit_log) >= 1, "Audit log empty"`,
   expectedOutput:`[TEST] RAG-012: Cache Invalidation & Historical Query
[INFO] Redis connected: cache.bank.local:6379/2, DB flushed
[PASS] TTL-based: FD rates cached with 60s TTL
[PASS] TTL countdown active: 58 seconds remaining
[PASS] Version-based: v1 keys created (loan_rates, fd_rates)
[PASS] Version bumped: v1 -> v2, old keys purged
[PASS] New version data: loan rate = 8.25% (updated)
[PASS] Pub/Sub: RATE_CHANGE event published and received
[INFO] Event: home_loan rate 8.5% -> 8.25%
[PASS] Audit trail: query logged with timestamp and user
[PASS] Audit retention: 365 days TTL set on audit key
[INFO] Invalidation strategies: TTL + Version + Event-driven
-----------------------------------
RAG-012: Cache Invalidation — 8 passed, 0 failed`},

  {id:'RAG-013',title:'Numerical Data Extraction Accuracy',layer:'DataTypes',framework:'LangChain / Regex',language:'Python',difficulty:'Intermediate',
   description:'Tests RAG pipeline accuracy in extracting and preserving numerical data from banking documents including interest rates, account numbers, transaction amounts, and dates.',
   prerequisites:'LangChain 0.2+, Banking document corpus with numerical data, Regex patterns',
   config:'TOLERANCE_RATE=0.001\nTOLERANCE_AMOUNT=0.01\nDATE_FORMATS=DD-MMM-YYYY,YYYY-MM-DD\nCURRENCY=INR',
   code:`import re
from langchain.text_splitter import RecursiveCharacterTextSplitter

banking_doc = """
Account Statement: SA-10234567890
Period: 01-Jan-2026 to 31-Jan-2026
Opening Balance: INR 1,25,430.75
Fixed Deposit: FD-98765 | Rate: 7.25% p.a. | Maturity: 15-Mar-2027
Home Loan: HL-54321 | EMI: INR 32,456.00 | Outstanding: INR 28,45,678.90
Credit Card: 4532-XXXX-XXXX-7890 | Due: INR 15,234.56
SWIFT Transfer: USD 10,000.00 (INR 8,34,500.00 @ 83.45)
"""

splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
chunks = splitter.split_text(banking_doc)

# Test 1: Interest rate extraction
rate_pattern = r'(\d+\.\d+)%\s*p\.a\.'
all_text = " ".join(chunks)
rates = re.findall(rate_pattern, all_text)
assert "7.25" in rates, f"FD rate not found in chunks: {rates}"

# Test 2: Amount extraction (Indian format with commas)
amount_pattern = r'INR\s+([\d,]+\.\d{2})'
amounts = re.findall(amount_pattern, all_text)
expected_amounts = ["1,25,430.75", "32,456.00", "28,45,678.90",
                    "15,234.56", "8,34,500.00"]
for exp in expected_amounts:
    assert exp in amounts, f"Amount {exp} not found: {amounts}"

# Test 3: Account number preservation
acct_pattern = r'SA-\d{11}'
accts = re.findall(acct_pattern, all_text)
assert "SA-10234567890" in accts, "Account number lost in chunking"

# Test 4: Date extraction
date_pattern = r'\d{2}-[A-Z][a-z]{2}-\d{4}'
dates = re.findall(date_pattern, all_text)
assert "01-Jan-2026" in dates, "Start date not found"
assert "15-Mar-2027" in dates, "FD maturity date not found"

# Test 5: Forex rate preservation
forex_pattern = r'@\s*(\d+\.\d{2})'
forex = re.findall(forex_pattern, all_text)
assert "83.45" in forex, "Forex rate lost in chunking"

# Test 6: Cross-chunk numerical integrity
for chunk in chunks:
    partial_amounts = re.findall(r'INR\s+[\d,]+$', chunk)
    if partial_amounts:
        print(f"WARNING: Amount split across chunks: {chunk[-30:]}")`,
   expectedOutput:`[TEST] RAG-013: Numerical Data Extraction Accuracy
[INFO] Document: 7 numerical fields across banking statement
[PASS] Interest rate extracted: 7.25% p.a. (FD-98765)
[PASS] Amount: INR 1,25,430.75 (opening balance)
[PASS] Amount: INR 32,456.00 (home loan EMI)
[PASS] Amount: INR 28,45,678.90 (outstanding principal)
[PASS] Amount: INR 15,234.56 (credit card due)
[PASS] Amount: INR 8,34,500.00 (SWIFT transfer)
[PASS] Account number preserved: SA-10234567890
[PASS] Dates extracted: 01-Jan-2026, 15-Mar-2027
[PASS] Forex rate preserved: 83.45 (USD/INR)
[PASS] Cross-chunk integrity: no amounts split across boundaries
-----------------------------------
RAG-013: Numerical Extraction — 10 passed, 0 failed`},

  {id:'RAG-014',title:'Semi-Structured Data Ingestion',layer:'DataTypes',framework:'LlamaIndex / Pandas',language:'Python',difficulty:'Advanced',
   description:'Tests RAG pipeline handling of semi-structured banking data including HTML tables, JSON API responses, CSV transaction files, and mixed-format regulatory reports.',
   prerequisites:'LlamaIndex 0.10+, Pandas, BeautifulSoup4, Sample banking data files',
   config:'TABLE_PARSER=html.parser\nJSON_DEPTH=3\nCSV_ENCODING=utf-8\nMAX_TABLE_ROWS=1000\nCHUNK_TABLES=true',
   code:`import pandas as pd
import json
from bs4 import BeautifulSoup
from llama_index.core import Document
from llama_index.core.node_parser import SentenceSplitter

# Test 1: HTML table extraction (bank statement)
html_table = """
<table>
  <tr><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th></tr>
  <tr><td>2026-01-15</td><td>NEFT-Corp Salary</td><td></td><td>85000.00</td></tr>
  <tr><td>2026-01-16</td><td>UPI-Grocery Store</td><td>2340.50</td><td></td></tr>
  <tr><td>2026-01-18</td><td>EMI-Home Loan HL54321</td><td>32456.00</td><td></td></tr>
</table>
"""
soup = BeautifulSoup(html_table, "html.parser")
rows = soup.find_all("tr")
headers = [th.text for th in rows[0].find_all("th")]
assert headers == ["Date", "Description", "Debit", "Credit"]
data_rows = [[td.text for td in row.find_all("td")] for row in rows[1:]]
assert len(data_rows) == 3, f"Expected 3 rows, got {len(data_rows)}"
assert data_rows[0][3] == "85000.00", "Salary amount wrong"

# Test 2: JSON API response parsing
api_response = {
    "account": {"number": "SA-10234567890", "type": "savings"},
    "balance": {"available": 125430.75, "currency": "INR"},
    "recent_transactions": [
        {"id": "TXN001", "amount": -2340.50, "type": "UPI"},
        {"id": "TXN002", "amount": 85000.00, "type": "NEFT"},
    ]
}
doc_text = json.dumps(api_response, indent=2)
doc = Document(text=doc_text, metadata={"source": "api", "format": "json"})
parser = SentenceSplitter(chunk_size=256, chunk_overlap=20)
nodes = parser.get_nodes_from_documents([doc])
assert len(nodes) >= 1, "JSON not parsed into nodes"
full_text = " ".join([n.text for n in nodes])
assert "SA-10234567890" in full_text, "Account number lost"
assert "125430.75" in full_text, "Balance lost in parsing"

# Test 3: CSV transaction data
csv_data = "Date,Type,Amount,Balance\\n2026-01-15,NEFT,85000.00,125430.75"
df = pd.read_csv(pd.io.common.StringIO(csv_data))
assert len(df) == 1, "CSV row count wrong"
assert df.iloc[0]["Amount"] == 85000.00, "CSV amount mismatch"
md_table = df.to_markdown(index=False)
assert "NEFT" in md_table, "Markdown conversion failed"

print(f"HTML: {len(data_rows)} rows parsed")
print(f"JSON: {len(nodes)} nodes, all fields preserved")
print(f"CSV: {len(df)} rows, markdown conversion OK")`,
   expectedOutput:`[TEST] RAG-014: Semi-Structured Data Ingestion
[INFO] Testing 3 data formats: HTML table, JSON API, CSV
[PASS] HTML table: 4 columns, 3 data rows extracted
[PASS] HTML: Salary amount=85000.00 correctly parsed
[PASS] JSON API response: account, balance, transactions parsed
[PASS] JSON: Account SA-10234567890 preserved in nodes
[PASS] JSON: Balance 125430.75 preserved after chunking
[INFO] JSON document split into 2 nodes (256 char chunks)
[PASS] CSV: 1 transaction row parsed via Pandas
[PASS] CSV: Amount=85000.00 type-validated as float
[PASS] CSV: Markdown table conversion successful
[INFO] All 3 semi-structured formats ingested without data loss
-----------------------------------
RAG-014: Semi-Structured Data — 8 passed, 0 failed`},

  {id:'RAG-015',title:'PDF Document Ingestion & Parsing',layer:'DataTypes',framework:'LlamaIndex / PyMuPDF',language:'Python',difficulty:'Intermediate',
   description:'Tests PDF document ingestion for banking reports including text extraction, table detection, header/footer removal, and metadata preservation for regulatory compliance documents.',
   prerequisites:'PyMuPDF (fitz), LlamaIndex 0.10+, Sample banking PDFs (KYC forms, loan agreements)',
   config:'PDF_DIR=/data/banking_pdfs\nOCR_ENABLED=false\nTABLE_DETECTION=true\nSTRIP_HEADERS=true\nMIN_TEXT_LENGTH=50',
   code:`import fitz  # PyMuPDF
from llama_index.core import Document, SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
import os

# Test 1: PDF text extraction quality
pdf_path = "/data/banking_pdfs/home_loan_agreement.pdf"
doc = fitz.open(pdf_path)
assert doc.page_count > 0, "PDF has no pages"

full_text = ""
for page in doc:
    text = page.get_text("text")
    full_text += text + "\\n"
    assert len(text.strip()) > 0, f"Page {page.number} is empty"

doc.close()
assert len(full_text) > 500, f"Extracted text too short: {len(full_text)}"
print(f"PDF: {doc.page_count} pages, {len(full_text)} chars extracted")

# Test 2: Key banking terms preserved
required_terms = [
    "principal amount", "interest rate", "EMI",
    "prepayment", "foreclosure", "collateral"
]
found = [t for t in required_terms if t.lower() in full_text.lower()]
coverage = len(found) / len(required_terms)
assert coverage >= 0.8, f"Term coverage too low: {coverage:.0%}"

# Test 3: Table detection in PDF
for page in fitz.open(pdf_path):
    tables = page.find_tables()
    if tables.tables:
        for table in tables.tables:
            df = table.to_pandas()
            assert df.shape[0] > 0, "Empty table detected"
            assert df.shape[1] >= 2, "Table has < 2 columns"
            print(f"Table found: {df.shape[0]} rows x {df.shape[1]} cols")

# Test 4: Metadata extraction
meta_doc = fitz.open(pdf_path)
metadata = meta_doc.metadata
assert metadata.get("title") or metadata.get("subject"), "No PDF metadata"
print(f"PDF metadata: title={metadata.get('title', 'N/A')}")

# Test 5: Chunking PDF content for RAG
llama_doc = Document(text=full_text, metadata={
    "source": pdf_path, "pages": doc.page_count, "type": "loan_agreement"
})
parser = SentenceSplitter(chunk_size=512, chunk_overlap=50)
nodes = parser.get_nodes_from_documents([llama_doc])
assert len(nodes) >= 5, f"Too few chunks: {len(nodes)}"
for node in nodes:
    assert len(node.text.strip()) >= 50, "Chunk too short"
    assert node.metadata["source"] == pdf_path`,
   expectedOutput:`[TEST] RAG-015: PDF Document Ingestion & Parsing
[INFO] PDF: home_loan_agreement.pdf (12 pages)
[PASS] Text extraction: 12 pages, 28,450 chars extracted
[PASS] All pages have non-empty text content
[PASS] Banking terms: 6/6 found (100% coverage)
[INFO] Terms: principal amount, interest rate, EMI, prepayment, foreclosure, collateral
[PASS] Table detected: page 4 — 8 rows x 5 cols (EMI schedule)
[PASS] Table detected: page 7 — 3 rows x 4 cols (fee structure)
[PASS] PDF metadata: title="Home Loan Agreement"
[PASS] Chunked into 56 nodes (512 chars, 50 overlap)
[PASS] All chunks >= 50 chars with source metadata
[INFO] Source metadata preserved across all nodes
-----------------------------------
RAG-015: PDF Ingestion — 8 passed, 0 failed`},

  {id:'RAG-016',title:'Faithfulness & Groundedness Scoring',layer:'Evaluation',framework:'RAGAS / LangChain',language:'Python',difficulty:'Advanced',
   description:'Tests RAG output quality using RAGAS faithfulness metric to detect hallucinations, validates groundedness by checking if every claim in the answer is supported by retrieved context.',
   prerequisites:'RAGAS 0.1+, LangChain 0.2+, OpenAI API, Banking QA dataset with ground truth',
   config:'RAGAS_MODEL=gpt-4o\nFAITHFULNESS_THRESHOLD=0.85\nGROUNDEDNESS_THRESHOLD=0.80\nDATASET=/data/banking_qa_golden.json',
   code:`from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

# Banking RAG QA evaluation dataset
eval_data = {
    "question": [
        "What is the interest rate for a 2-year fixed deposit?",
        "What documents are required for a home loan?",
        "What is the maximum NEFT transfer limit per day?",
    ],
    "answer": [
        "The interest rate for a 2-year FD is 7.50% per annum for general customers and 8.00% for senior citizens.",
        "For a home loan you need: identity proof (Aadhaar/PAN), address proof, income proof (salary slips for 6 months), bank statements, property documents, and passport photos.",
        "The maximum NEFT transfer limit is INR 10,00,000 per transaction with no daily cap for individual accounts.",
    ],
    "contexts": [
        ["Fixed deposit rates: 1yr=7.25%, 2yr=7.50%, 3yr=7.75% for general. Senior citizen: additional 0.50% on all tenures."],
        ["Home loan documents: 1. Identity proof (Aadhaar/PAN), 2. Address proof, 3. Last 6 months salary slips, 4. Bank statements, 5. Property papers, 6. Passport photos."],
        ["NEFT transfer limits: Individual accounts - INR 10,00,000 per transaction. Corporate - INR 50,00,000. No daily cap for individuals."],
    ],
    "ground_truth": [
        "2-year FD rate is 7.50% p.a. for general and 8.00% for senior citizens.",
        "Identity proof, address proof, salary slips, bank statements, property documents, passport photos.",
        "INR 10,00,000 per transaction, no daily cap for individuals.",
    ],
}

dataset = Dataset.from_dict(eval_data)
result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_precision],
)

faith_score = result["faithfulness"]
relevancy_score = result["answer_relevancy"]
precision_score = result["context_precision"]

assert faith_score >= 0.85, f"Faithfulness too low: {faith_score:.4f}"
assert relevancy_score >= 0.80, f"Relevancy too low: {relevancy_score:.4f}"
assert precision_score >= 0.80, f"Precision too low: {precision_score:.4f}"

print(f"Faithfulness: {faith_score:.4f}")
print(f"Answer Relevancy: {relevancy_score:.4f}")
print(f"Context Precision: {precision_score:.4f}")
print(f"All RAGAS metrics above threshold")`,
   expectedOutput:`[TEST] RAG-016: Faithfulness & Groundedness Scoring
[INFO] Evaluating 3 banking QA pairs with RAGAS
[INFO] Metrics: faithfulness, answer_relevancy, context_precision
[PASS] Faithfulness: 0.9233 (threshold: 0.85)
[PASS] Answer Relevancy: 0.8912 (threshold: 0.80)
[PASS] Context Precision: 0.9567 (threshold: 0.80)
[INFO] Q1 (FD rate): faith=0.95, all claims grounded in context
[INFO] Q2 (home loan docs): faith=0.92, 6/6 documents matched
[INFO] Q3 (NEFT limit): faith=0.90, amount and cap verified
[PASS] All RAGAS metrics above minimum thresholds
[PASS] No hallucinated claims detected in answers
[INFO] Evaluation model: gpt-4o | Dataset: 3 samples
-----------------------------------
RAG-016: Faithfulness Scoring — 5 passed, 0 failed`},

  {id:'RAG-017',title:'Hallucination Detection & Prevention',layer:'Evaluation',framework:'RAGAS / Custom',language:'Python',difficulty:'Advanced',
   description:'Tests RAG pipeline for hallucination detection by comparing generated answers against source context, identifies unsupported claims, and validates hallucination prevention guardrails.',
   prerequisites:'RAGAS 0.1+, OpenAI API, Banking context documents, Known hallucination test cases',
   config:'HALLUCINATION_THRESHOLD=0.10\nCLAIM_EXTRACTOR=gpt-4o-mini\nVERIFICATION_MODEL=gpt-4o\nSTRICT_MODE=true',
   code:`from ragas.metrics import faithfulness
from datasets import Dataset
import json

# Test cases: answers with known hallucinations
test_cases = [
    {
        "question": "What is the penalty for bounced cheque?",
        "context": "Cheque return charges: INR 500 per instance for insufficient funds. Applicable for savings and current accounts.",
        "answer_good": "The penalty for a bounced cheque is INR 500 per instance due to insufficient funds.",
        "answer_hallucinated": "The penalty for a bounced cheque is INR 500, and repeated bouncing can lead to a 6-month jail sentence under Section 138.",
        "hallucination_claim": "6-month jail sentence under Section 138"
    },
    {
        "question": "What is the minimum balance for savings account?",
        "context": "Minimum average quarterly balance: Metro - INR 5,000, Urban - INR 3,000, Rural - INR 1,000. Non-maintenance fee: INR 300.",
        "answer_good": "Minimum balance varies: Metro INR 5,000, Urban INR 3,000, Rural INR 1,000.",
        "answer_hallucinated": "Minimum balance is INR 5,000 for metro branches. Zero-balance accounts are available for all Jan Dhan holders and government employees.",
        "hallucination_claim": "Zero-balance for government employees"
    },
]

results = []
for tc in test_cases:
    # Evaluate good answer (should be faithful)
    good_ds = Dataset.from_dict({
        "question": [tc["question"]],
        "answer": [tc["answer_good"]],
        "contexts": [[tc["context"]]],
    })
    # Evaluate hallucinated answer (should score low)
    bad_ds = Dataset.from_dict({
        "question": [tc["question"]],
        "answer": [tc["answer_hallucinated"]],
        "contexts": [[tc["context"]]],
    })

    good_score = evaluate(good_ds, metrics=[faithfulness])["faithfulness"]
    bad_score = evaluate(bad_ds, metrics=[faithfulness])["faithfulness"]

    assert good_score > 0.85, f"Good answer scored low: {good_score}"
    assert bad_score < good_score, "Hallucinated not worse than good"
    assert good_score - bad_score > 0.15, "Score gap too small"

    results.append({
        "question": tc["question"][:50],
        "good_score": round(good_score, 4),
        "bad_score": round(bad_score, 4),
        "hallucination": tc["hallucination_claim"][:40],
    })
    print(f"Good={good_score:.4f} Bad={bad_score:.4f} | {tc['question'][:50]}")

# Verify all hallucinations were detected
detected = sum(1 for r in results if r["bad_score"] < 0.70)
assert detected == len(results), "Not all hallucinations detected"`,
   expectedOutput:`[TEST] RAG-017: Hallucination Detection & Prevention
[INFO] Testing 2 QA pairs: good answers vs hallucinated answers
[PASS] Q1 (bounced cheque): Good=0.9500, Hallucinated=0.5200
[INFO] Hallucination detected: "6-month jail sentence under Section 138"
[PASS] Q1: Score gap=0.43 (threshold: 0.15) — hallucination caught
[PASS] Q2 (min balance): Good=0.9200, Hallucinated=0.4800
[INFO] Hallucination detected: "Zero-balance for government employees"
[PASS] Q2: Score gap=0.44 (threshold: 0.15) — hallucination caught
[PASS] All hallucinated answers scored below 0.70
[PASS] All good answers scored above 0.85
[PASS] 2/2 hallucinations successfully detected
[INFO] Detection rate: 100% | False positives: 0
-----------------------------------
RAG-017: Hallucination Detection — 7 passed, 0 failed`},

  {id:'RAG-018',title:'Context Recall & Answer Completeness',layer:'Evaluation',framework:'RAGAS / DeepEval',language:'Python',difficulty:'Intermediate',
   description:'Tests RAG output completeness using context recall and answer coverage metrics, validates that all relevant information from retrieved context appears in the final answer for banking queries.',
   prerequisites:'RAGAS 0.1+, DeepEval 0.21+, Banking QA evaluation dataset',
   config:'RECALL_THRESHOLD=0.80\nCOVERAGE_THRESHOLD=0.75\nEVAL_MODEL=gpt-4o\nDATASET_SIZE=5\nSTRICT_COVERAGE=true',
   code:`from ragas import evaluate
from ragas.metrics import context_recall, context_precision, answer_relevancy
from datasets import Dataset

# Banking QA with comprehensive ground truth
eval_data = {
    "question": [
        "What are all the charges for a home loan?",
        "What are the features of NRI NRE account?",
        "What is the process for filing a credit card dispute?",
    ],
    "answer": [
        "Home loan charges include: processing fee (0.5% of loan), legal verification fee (INR 5,000), valuation charge (INR 3,000), prepayment penalty (2% for fixed rate), and documentation charge (INR 1,500).",
        "NRE account features: full repatriability of principal and interest, tax-free interest income in India, joint holding with another NRI, available as savings/FD/recurring deposit.",
        "To file a credit card dispute: 1) Call the 24x7 helpline within 30 days, 2) Fill dispute form online or at branch, 3) Bank investigates within 45 days, 4) Provisional credit issued within 10 working days.",
    ],
    "contexts": [
        ["Home loan charges: Processing fee 0.5% of loan amount. Legal verification: INR 5,000. Technical valuation: INR 3,000. Prepayment penalty: 2% of outstanding for fixed rate loans, nil for floating. Documentation charges: INR 1,500. Stamp duty and registration as per state norms."],
        ["NRE Account: Funds fully repatriable (principal + interest). Interest earned is tax-free in India under Income Tax Act. Can be held jointly with another NRI only. Available types: savings, fixed deposit, recurring deposit. Minimum balance: INR 10,000 or equivalent."],
        ["Credit card dispute process: Report within 30 days of statement date. Contact 24x7 helpline or submit form online/branch. Investigation completed within 45 working days per RBI mandate. Provisional credit within 10 working days for domestic transactions."],
    ],
    "ground_truth": [
        "Processing fee 0.5%, legal verification INR 5000, valuation INR 3000, prepayment penalty 2% fixed rate, documentation INR 1500, stamp duty per state.",
        "Full repatriability, tax-free interest, joint holding with NRI, savings/FD/RD available, minimum balance INR 10000.",
        "Report within 30 days, call helpline or fill form, 45-day investigation, provisional credit in 10 working days.",
    ],
}

dataset = Dataset.from_dict(eval_data)
result = evaluate(
    dataset,
    metrics=[context_recall, context_precision, answer_relevancy],
)

recall = result["context_recall"]
precision = result["context_precision"]
relevancy = result["answer_relevancy"]

assert recall >= 0.80, f"Context recall too low: {recall:.4f}"
assert precision >= 0.80, f"Context precision too low: {precision:.4f}"
assert relevancy >= 0.75, f"Answer relevancy too low: {relevancy:.4f}"

# Check per-question completeness
for i, q in enumerate(eval_data["question"]):
    gt_claims = eval_data["ground_truth"][i].split(",")
    answer = eval_data["answer"][i].lower()
    matched = sum(1 for c in gt_claims if any(
        w.strip().lower() in answer for w in c.split()))
    coverage = matched / len(gt_claims)
    assert coverage >= 0.75, f"Q{i+1} coverage low: {coverage:.0%}"
    print(f"Q{i+1}: {matched}/{len(gt_claims)} claims covered ({coverage:.0%})")

print(f"\\nRecall={recall:.4f} Precision={precision:.4f} Relevancy={relevancy:.4f}")`,
   expectedOutput:`[TEST] RAG-018: Context Recall & Answer Completeness
[INFO] Evaluating 3 banking QA pairs for completeness
[PASS] Context Recall: 0.8934 (threshold: 0.80)
[PASS] Context Precision: 0.9123 (threshold: 0.80)
[PASS] Answer Relevancy: 0.8567 (threshold: 0.75)
[PASS] Q1 (home loan charges): 5/6 claims covered (83%)
[INFO] Q1 missing: stamp duty per state (minor omission)
[PASS] Q2 (NRE account): 4/5 claims covered (80%)
[INFO] Q2 missing: minimum balance INR 10000 (minor omission)
[PASS] Q3 (card dispute): 4/4 claims covered (100%)
[PASS] All questions above 75% coverage threshold
[INFO] Overall claim coverage: 13/15 (86.7%)
-----------------------------------
RAG-018: Context Recall — 7 passed, 0 failed`},
];

export default function RAGTestingLab() {
  const [tab, setTab] = useState('Chunking');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
    if (s.layer !== tab) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) { setOutput(prev => prev + (prev ? '\n' : '') + lines[i]); setProgress(Math.round(((i + 1) / lines.length) * 100)); i++; }
      else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = S.filter(s => s.layer === tab).length;
  const passedTab = S.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page:{minHeight:'100vh',background:`linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`,color:C.text,fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",padding:'18px 22px 40px'},
    h1:{fontSize:28,fontWeight:800,margin:0,background:`linear-gradient(90deg,${C.accent},#3498db)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sub:{fontSize:13,color:C.muted,marginTop:4},
    statsBar:{display:'flex',justifyContent:'center',gap:24,marginBottom:14,flexWrap:'wrap'},
    stat:{background:C.card,borderRadius:8,padding:'6px 18px',fontSize:13,border:`1px solid ${C.border}`},
    split:{display:'flex',gap:16,height:'calc(100vh - 160px)',minHeight:500},
    left:{width:'38%',minWidth:320,display:'flex',flexDirection:'column',gap:10},
    right:{flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'},
    tabBar:{display:'flex',gap:4,flexWrap:'wrap'},
    tabBtn:(a)=>({padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:a?C.accent:C.card,color:a?'#0a0a1a':C.text}),
    input:{flex:1,padding:'7px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:13,outline:'none',minWidth:120},
    select:{padding:'6px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:12,outline:'none'},
    list:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,paddingRight:4},
    card:(a)=>({padding:'10px 14px',borderRadius:8,background:a?C.cardHover:C.card,border:`1px solid ${a?C.accent:C.border}`,cursor:'pointer'}),
    badge:(c)=>({display:'inline-block',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700,background:c+'22',color:c,marginRight:4}),
    dot:(st)=>({display:'inline-block',width:8,height:8,borderRadius:'50%',background:st==='passed'?C.accent:C.muted,marginRight:6}),
    panel:{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,overflowY:'auto'},
    editor:{width:'100%',minHeight:200,maxHeight:280,padding:12,borderRadius:8,border:`1px solid ${C.border}`,background:C.editorBg,color:C.editorText,fontFamily:"'Fira Code','Consolas',monospace",fontSize:12,lineHeight:1.6,resize:'vertical',outline:'none',whiteSpace:'pre',overflowX:'auto'},
    btn:(bg)=>({padding:'7px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:bg||C.accent,color:(bg===C.danger||bg==='#555')?'#fff':'#0a0a1a'}),
    outBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,fontFamily:"'Fira Code','Consolas',monospace",fontSize:11,color:C.accent,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:60,maxHeight:180,overflowY:'auto'},
    progBar:{height:4,borderRadius:2,background:'#0a2744',marginTop:6},
    progFill:(p)=>({height:'100%',borderRadius:2,width:p+'%',background:p===100?C.accent:'#3498db',transition:'width 0.3s'}),
    progO:{height:6,borderRadius:3,background:'#0a2744',marginBottom:8},
    progOF:(p)=>({height:'100%',borderRadius:3,width:p+'%',background:`linear-gradient(90deg,${C.accent},#3498db)`,transition:'width 0.4s'}),
    cfgBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,marginTop:8,fontSize:12,lineHeight:1.6,color:C.warn,fontFamily:"'Fira Code','Consolas',monospace",whiteSpace:'pre-wrap'},
  };

  return (
    <div style={sty.page}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 style={sty.h1}>RAG Testing Lab</h1>
        <div style={sty.sub}>RAG Pipeline Testing — Chunking, Embeddings, Retrieval, Caching, Data Types & Evaluation — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll>0?Math.round((passedAll/totalAll)*100):0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>{TABS.map(t=><button key={t.key} style={sty.tabBtn(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input style={sty.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e=>setDiffF(e.target.value)}>{['All',...DIFF].map(d=><option key={d} value={d}>{d==='All'?'Difficulty':d}</option>)}</select>
          </div>
          <div style={sty.progO}><div style={sty.progOF(totalTab>0?Math.round((passedTab/totalTab)*100):0)}/></div>
          <div style={sty.list}>
            {filtered.length===0&&<div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s=>(
              <div key={s.id} style={sty.card(sel.id===s.id)} onClick={()=>pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])}/><span style={{fontSize:11,color:C.accent,marginRight:8}}>{s.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.header}}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TC[s.layer]||C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DC[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel,flex:'0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div><span style={sty.badge(TC[sel.layer]||C.accent)}>{sel.layer}</span><span style={sty.badge(DC[sel.difficulty])}>{sel.difficulty}</span><span style={sty.badge('#f1c40f')}>{sel.language}</span></div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel,flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}><button style={sty.btn()} onClick={copy}>Copy</button><button style={sty.btn('#555')} onClick={reset}>Reset</button></div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running?'#555':C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running?'Running...':'Run Test'}</button>
              {statuses[sel.id]==='passed'&&<span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress>0&&progress<100&&<span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={()=>setShowConfig(!showConfig)}>{showConfig?'Hide':'Show'} Config</button>
            </div>
            {(running||output)&&(<div><div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div><div style={sty.outBox}>{output||'Starting...'}</div><div style={sty.progBar}><div style={sty.progFill(progress)}/></div></div>)}
            {showConfig&&<div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
