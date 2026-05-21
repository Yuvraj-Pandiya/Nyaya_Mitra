import unittest
import os
import shutil
import numpy as np
from services.chunking_service import chunk_text
from services.ocr_service import clean_text
from core.vector_store import get_collection, COLLECTION_NAME

class TestRAGPipeline(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # We will use a separate temp directory for testing ChromaDB to avoid polluting the dev db
        base_dir = os.path.dirname(os.path.abspath(__file__))
        cls.test_db_path = os.path.join(base_dir, "data", "test_chromadb")
        if os.path.exists(cls.test_db_path):
            shutil.rmtree(cls.test_db_path)
        os.makedirs(cls.test_db_path, exist_ok=True)
        
        # Override the database client for testing
        import chromadb
        import core.vector_store as vs
        vs._client = chromadb.PersistentClient(path=cls.test_db_path)
        vs._collection = None # Reset collection singleton

    @classmethod
    def tearDownClass(cls):
        # Clean up test DB after test suite run
        import core.vector_store as vs
        vs._client = None
        vs._collection = None
        if os.path.exists(cls.test_db_path):
            shutil.rmtree(cls.test_db_path, ignore_errors=True)

    def test_text_cleaning(self):
        """Test that OCR text cleaning removes redundant whitespaces and formatting."""
        raw_text = "Hello    World! \n\n\n This is a   test.\n"
        cleaned = clean_text(raw_text)
        self.assertEqual(cleaned, "Hello World! \n This is a test.")

    def test_pdf_extraction_validation(self):
        """Test ocr_service's PDF validation rules (empty bytes, invalid format, offset header)."""
        from services.ocr_service import extract_text_from_pdf
        
        # 1. Test empty / too short bytes
        with self.assertRaises(ValueError) as context:
            extract_text_from_pdf(b"")
        self.assertIn("empty or corrupted", str(context.exception))
        
        with self.assertRaises(ValueError) as context:
            extract_text_from_pdf(b"12345")
        self.assertIn("empty or corrupted", str(context.exception))
        
        # 2. Test invalid signature
        with self.assertRaises(ValueError) as context:
            extract_text_from_pdf(b"not_a_pdf_format_at_all_longer_than_ten_bytes")
        self.assertIn("Missing %PDF- header signature", str(context.exception))
        
        # 3. Test trimming of offset header (starts with some garbage, but contains %PDF- later)
        # Note: pdfplumber will still try to open it, we test if it doesn't fail on signature validation
        offset_pdf_bytes = b"garbage_prefix\n%PDF-1.4\n" + b"some_other_data"
        with self.assertRaises(Exception) as context:
            # It will pass the signature validation, but fail downstream at pdfplumber parsing
            extract_text_from_pdf(offset_pdf_bytes)
        # We assert it did NOT fail with ValueError signature message, but rather downstream pdfplumber exceptions
        self.assertNotIsInstance(context.exception, ValueError)

    def test_chunking_service(self):
        """Test recursive character chunking parameters and output structure."""
        # Create a document of 1200 characters (should produce at least 2 chunks with size=800, overlap=150)
        document_text = " ".join(["word" for _ in range(300)])
        filename = "test_agreement.pdf"
        
        chunks = chunk_text(text=document_text, filename=filename, chunk_size=800, chunk_overlap=150)
        
        self.assertTrue(len(chunks) >= 2)
        for i, chunk in enumerate(chunks):
            self.assertIn("text", chunk)
            self.assertIn("metadata", chunk)
            self.assertEqual(chunk["metadata"]["filename"], filename)
            self.assertEqual(chunk["metadata"]["chunk_index"], i)
            self.assertEqual(chunk["metadata"]["total_chunks"], len(chunks))

    def test_chromadb_storage_and_cosine_similarity(self):
        """Test that we can store document chunks with 768-dimensional embeddings and query them using Cosine similarity."""
        collection = get_collection()
        self.assertEqual(collection.name, COLLECTION_NAME)
        
        # Define mock documents, metadata, and 768-dimensional mock vectors
        doc1 = "The Tenant shall pay rent on the 1st of every month."
        doc2 = "The Landlord shall maintain the structural integrity of the property."
        
        # Create two distinct 768-dimensional vectors
        vec1 = np.zeros(768)
        vec1[0] = 1.0 # Highlight first dimension
        vec2 = np.zeros(768)
        vec2[1] = 1.0 # Highlight second dimension
        
        ids = ["doc1_chunk_0", "doc2_chunk_0"]
        documents = [doc1, doc2]
        metadatas = [
            {"filename": "rent_agreement.pdf", "chunk_index": 0, "total_chunks": 1, "char_count": len(doc1)},
            {"filename": "rent_agreement.pdf", "chunk_index": 1, "total_chunks": 1, "char_count": len(doc2)}
        ]
        
        # Upsert documents and mock vectors into ChromaDB
        collection.upsert(
            ids=ids,
            embeddings=[vec1.tolist(), vec2.tolist()],
            documents=documents,
            metadatas=metadatas
        )
        
        # Query ChromaDB with a vector identical to vec1 (which should match doc1 best)
        query_vec = np.zeros(768)
        query_vec[0] = 0.9
        
        results = collection.query(
            query_embeddings=[query_vec.tolist()],
            n_results=2,
            include=["documents", "metadatas", "distances"]
        )
        
        # Verify the structure of the retrieved data matches the RAG description
        retrieved_docs = results["documents"][0]
        retrieved_metas = results["metadatas"][0]
        retrieved_distances = results["distances"][0]
        
        self.assertEqual(retrieved_docs[0], doc1)
        self.assertEqual(retrieved_metas[0]["filename"], "rent_agreement.pdf")
        self.assertEqual(retrieved_metas[0]["chunk_index"], 0)
        
        # Calculate Cosine similarity from ChromaDB distance (where distance = 1 - cosine_similarity)
        similarity_1 = 1.0 - retrieved_distances[0]
        similarity_2 = 1.0 - retrieved_distances[1]
        
        self.assertGreater(similarity_1, similarity_2)
        print(f"\n[ChromaDB Test Results]")
        print(f"Query matched: '{retrieved_docs[0]}' (Similarity: {similarity_1:.4f})")
        print(f"Second best match: '{retrieved_docs[1]}' (Similarity: {similarity_2:.4f})")

    def test_live_embedding_generation(self):
        """Test that the live embedding service successfully generates 768-dimensional embeddings using the real Gemini API."""
        from services.embedding_service import embed_chunks
        
        # Load environment variables just in case
        from dotenv import load_dotenv
        load_dotenv()
        
        # Test text
        test_chunks = [{"text": "Hello world, this is a live integration test for NyayaMitra embeddings."}]
        
        try:
            vectors = embed_chunks(test_chunks)
            self.assertEqual(len(vectors), 1)
            self.assertEqual(len(vectors[0]), 768)
            print(f"\n[Live Gemini Embedding Test Results]")
            print(f"Successfully generated embedding vector of length {len(vectors[0])}!")
        except Exception as e:
            self.fail(f"Live embedding generation failed: {e}")

if __name__ == "__main__":
    unittest.main()
