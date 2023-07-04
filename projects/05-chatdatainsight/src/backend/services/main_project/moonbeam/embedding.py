import openai
import sys
import os
import re


from bs4 import BeautifulSoup

from llama_index import GPTVectorStoreIndex, SimpleDirectoryReader
from llama_index import VectorStoreIndex, SimpleDirectoryReader


# Define the paths for the HTML folder and the text folder
HTML_FOLDER_PATH = 'services/main_project/moonbeam/static/materials/htmls'
TEXT_FOLDER_PATH = 'services/main_project/moonbeam/static/materials/texts'
INDEX_FORDER_PATH = 'services/main_project/moonbeam/static/index'


current_directory = os.path.dirname(os.path.realpath(__file__))
backend_directory = os.path.abspath(os.path.join(current_directory))
sys.path.insert(0, backend_directory)

from core.config import Config
openai.api_key = Config.OPENAI_API_KEY

def establish_knowledge_base_index():
      
        # openai version = 0.26.4
        
      print("convert text materials to index...")

      documents = SimpleDirectoryReader(TEXT_FOLDER_PATH).load_data()
      index = VectorStoreIndex.from_documents(documents)
      index.storage_context.persist(persist_dir=INDEX_FORDER_PATH)

      print("done")



# Function to convert HTML to text
def convert_html_to_text():

    # Loop through all files in the HTML folder
    for filename in os.listdir(HTML_FOLDER_PATH):
        # Process only HTML files
        if filename.endswith('.html'):
            html_file_path = os.path.join(HTML_FOLDER_PATH, filename)
            with open(html_file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()

            # Use BeautifulSoup to parse the content read from the HTML file
            soup = BeautifulSoup(html_content, 'html.parser')

            # Extract all text information
            text = soup.get_text()

            # Clean up the text by removing unnecessary white spaces and empty lines
            text = re.sub('\n\s*\n', '\n', text)

            # Create a new text filename, replacing .html with .txt
            txt_filename = filename.replace('.html', '.txt')
            txt_file_path = os.path.join(TEXT_FOLDER_PATH, txt_filename)
            
            # Write the cleaned up text into a new .txt file
            with open(txt_file_path, 'w', encoding='utf-8') as f:
                f.write(text)

    print('Conversion and cleanup of all HTML files is complete!')


