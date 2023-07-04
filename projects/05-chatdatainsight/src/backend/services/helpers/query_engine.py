from llama_index import StorageContext, load_index_from_storage

def private_dataset_query(question,path):
      
      print("query question:",question)

      # rebuild storage context
      storage_context = StorageContext.from_defaults(persist_dir=path)
      # load index
      index = load_index_from_storage(path)

      query_engine = index.as_query_engine()
      response = query_engine.query(question)

      print("query result:",response)

      return response

