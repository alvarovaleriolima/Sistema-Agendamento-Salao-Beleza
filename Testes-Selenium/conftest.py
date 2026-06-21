import pytest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture()
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    servico = Service(ChromeDriverManager().install())
    navegador = webdriver.Chrome(service=servico, options=options)
    
    # 1. Espera global
    navegador.implicitly_wait(10)
    
    # 2. Tentativa de conexão com retry para evitar ERR_CONNECTION_REFUSED
    url = "http://localhost:5173/"
    max_retries = 3
    for i in range(max_retries):
        try:
            navegador.get(url)
            break # Se conectou, sai do loop
        except Exception as e:
            if i < max_retries - 1:
                time.sleep(3) # Aguarda 3 segundos antes de tentar de novo
            else:
                raise e # Se falhar 3 vezes, para o teste
    
    yield navegador
    navegador.quit()