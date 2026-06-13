import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture()
def driver():
    # ------------------ SETUP (Preparação) ------------------
    # Configurações do navegador
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    # options.add_argument("--headless") # Descomente no futuro para rodar os testes sem abrir a tela
    
    # Inicializa o Chrome baixando o driver compatível automaticamente
    servico = Service(ChromeDriverManager().install())
    navegador = webdriver.Chrome(service=servico, options=options)
    
    # Define uma espera global de 10 segundos. 
    # Se o Selenium não achar um elemento na hora, ele tenta por até 10s antes de falhar.
    navegador.implicitly_wait(10)

    # Pausa a função e entrega o navegador pronto para o teste usar
    yield navegador

    # ----------------- TEARDOWN (Limpeza) -----------------
    # Quando o teste termina (passando ou falhando), o Pytest volta para cá e fecha a janela
    navegador.quit()