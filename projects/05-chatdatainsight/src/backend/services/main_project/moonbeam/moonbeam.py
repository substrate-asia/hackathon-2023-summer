
from llama_index import StorageContext, load_index_from_storage

def moonbeam_query_engine(question):
      
      INDEX_FORDER_PATH = 'services/main_project/moonbeam/static/index'

    # rebuild storage context
      storage_context = StorageContext.from_defaults(persist_dir=INDEX_FORDER_PATH)
      # load index
      index = load_index_from_storage(storage_context)


      query_engine = index.as_query_engine()
      response = query_engine.query(question)

      print(response)

      return response


# moonbeam_query_engine("Which stablecoins are available on Moonbeam?")
