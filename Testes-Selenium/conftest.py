import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

@pytest.fixture(scope="function")
def driver():
    # Configurações do Chrome
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    # chrome_options.add_argument("--headless") # Descomente para rodar sem abrir a tela
    
    # Inicializa o navegador
    meu_driver = webdriver.Chrome(options=chrome_options)
    meu_driver.implicitly_wait(10) # Espera implícita para dar tempo dos elementos carregarem
    
    # Entrega o driver para o teste usar
    yield meu_driver
    
    # Após o teste terminar (ou falhar), fecha o navegador
    meu_driver.quit()