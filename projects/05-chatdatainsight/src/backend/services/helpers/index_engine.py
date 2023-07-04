from llama_index import GPTVectorStoreIndex, SimpleDirectoryReader

def establish_private_dataset_index(text_folder_path,index_folder_path):
      
        # openai version = 0.26.4
        
      print("convert text materials to index...")

      documents = SimpleDirectoryReader(text_folder_path).load_data()
      index = GPTVectorStoreIndex.from_documents(documents)
      index.storage_context.persist(persist_dir=index_folder_path)

      print("done")