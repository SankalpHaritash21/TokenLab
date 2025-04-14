# Install required packages:
# pip install tokenizers datasets sentencepiece transformers

from tokenizers import Tokenizer, models, trainers, pre_tokenizers, decoders, processors
from datasets import load_dataset
from sentencepiece import SentencePieceTrainer, SentencePieceProcessor
from transformers import AutoTokenizer
import os

def train_bpe_tokenizer(language_code: str = "hi", vocab_size: int = 30000):
    """Train BPE tokenizer (GPT-style) on specified language"""
    # Use updated C4 dataset instead of MC4
    dataset = load_dataset(
        "allenai/c4",
        f"hi",
        split="train",
        streaming=True,
        trust_remote_code=True
    )
    
    tokenizer = Tokenizer(models.BPE())
    tokenizer.pre_tokenizer = pre_tokenizers.ByteLevel(add_prefix_space=False)
    
    trainer = trainers.BpeTrainer(
        vocab_size=vocab_size,
        special_tokens=["<pad>", "<s>", "</s>", "<unk>", "<mask>"],
        min_frequency=2
    )

    def batch_iterator():
        count = 0
        for example in dataset:
            if count >= 1000:  # Reduced sample size
                break
            yield example["text"]
            count += 1

    tokenizer.train_from_iterator(batch_iterator(), trainer=trainer)
    
    # Add post-processing
    tokenizer.post_processor = processors.ByteLevel(trim_offsets=False)
    tokenizer.decoder = decoders.ByteLevel()
    
    return tokenizer

def train_sentencepiece_tokenizer(language: str = "hindi"):
    """Train SentencePiece tokenizer (LLaMA-style)"""
    # Use updated C4 dataset
    dataset = load_dataset(
        "allenai/c4",
        "hi",
        split="train",
        streaming=True,
        trust_remote_code=True
    )
    
    # Save corpus to file
    corpus_file = f"{language}_corpus.txt"
    with open(corpus_file, "w", encoding="utf-8") as f:
        count = 0
        for example in dataset:
            if count >= 1000:
                break
            f.write(example["text"] + "\n")
            count += 1

    # Train SentencePiece model
    SentencePieceTrainer.train(
        input=corpus_file,
        model_prefix=f"{language}_sp_model",
        vocab_size=20000,
        character_coverage=0.9995,
        pad_id=0,
        unk_id=1,
        bos_id=2,
        eos_id=3,
    )

    # Load trained model
    sp_model = SentencePieceProcessor()
    sp_model.load(f"{language}_sp_model.model")
    return sp_model

def main():
    try:
        # Train new tokenizers
        hindi_bpe = train_bpe_tokenizer()
        hindi_sp = train_sentencepiece_tokenizer()
        
        # Load pre-trained tokenizer
        pretrained = AutoTokenizer.from_pretrained("hf-internal-testing/llama-tokenizer")
        
        # Example texts
        texts = {
            "english": "Hello world! This is a tokenizer test.",
            "hindi": "नमस्ते दुनिया! यह एक टोकनाइज़र परीक्षण है।",
            "code-mixed": "Hello दुनिया! 1234 @test"
        }
        
        # Tokenize with all systems
        for name, text in texts.items():
            print(f"\n=== {name.upper()} ===")
            print(f"Original: {text}")
            
            if hindi_bpe:
                bpe_output = hindi_bpe.encode(text)
                print(f"\nOur BPE: {bpe_output.tokens}")
            
            if hindi_sp:
                print(f"Our SPM: {hindi_sp.encode_as_pieces(text)}")
            
            print(f"LLaMA: {pretrained.tokenize(text)}")

    except Exception as e:
        print(f"Main execution error: {str(e)}")

if __name__ == "__main__":
    main()