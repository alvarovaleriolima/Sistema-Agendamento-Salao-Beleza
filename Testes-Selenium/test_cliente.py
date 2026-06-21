from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import os

login_global_cliente = ""

def test_cadastrar_cliente_com_sucesso(driver):
    """ Objetivo: Cadastrar um cliente validando a máscara de data """
    global login_global_cliente
    espera = WebDriverWait(driver, 10)
    
    # 1. Clica no menu lateral 'Clientes'
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'sidebar-item') and contains(., 'Clientes')]"))).click()
    
    # 2. Abre o modal de Novo Cliente
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Cliente')]"))).click()
    
    # 3. Preenche os dados
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys("Ana Oliveira")
    
    driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA']").send_keys("15081995")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 98888-7777")
    
    login_unico = f"ana.oliveira.{int(time.time())}"
    login_global_cliente = login_unico 
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_unico)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("ana.oliveira@email.com")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success') and contains(., 'cadastrado')]")))
    
    os.makedirs("evidencias_clientes", exist_ok=True)
    driver.save_screenshot("evidencias_clientes/CT01_cliente_sucesso.png")
    assert mensagem is not None

def test_erro_login_duplicado_cliente(driver):
    """ Objetivo: Tentar cadastrar cliente com login já existente """
    global login_global_cliente
    espera = WebDriverWait(driver, 10)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'sidebar-item') and contains(., 'Clientes')]"))).click()
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Cliente')]"))).click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys("Maria Silva")
    
    driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA']").send_keys("10101990")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 91111-2222")
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_global_cliente)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem_erro = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-error') or contains(., 'já existe')]")))
    
    os.makedirs("evidencias_clientes", exist_ok=True)
    driver.save_screenshot("evidencias_clientes/CT02_cliente_login_duplicado.png")
    assert mensagem_erro is not None

def test_buscar_cliente(driver):
    """ Objetivo: Buscar cliente cadastrado """
    espera = WebDriverWait(driver, 10)
    global login_global_cliente
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Clientes') and contains(@class, 'sidebar-item')]"))).click()
    
    aba_login = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']")))
    aba_login.click()
    
    campo_busca = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[contains(@class, 'search-input')]")))
    campo_busca.send_keys(login_global_cliente)
    driver.find_element(By.XPATH, "//button[contains(@class, 'btn-search')]").click()
    
    time.sleep(1)
    tabela = driver.find_element(By.TAG_NAME, "tbody").text
    assert login_global_cliente in tabela
    driver.save_screenshot("evidencias_clientes/CT03_cliente_busca.png")

def test_editar_cliente(driver):
    """ Objetivo: Editar dados de um cliente """
    espera = WebDriverWait(driver, 15)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Clientes')]"))).click()
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    driver.find_element(By.XPATH, "(//tbody//button[@title='Editar'])[1]").click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys(Keys.CONTROL + "a")
    campo_nome.send_keys(Keys.BACKSPACE)
    campo_nome.send_keys("Beatriz Souza")
    
    botao_salvar = driver.find_element(By.XPATH, "//button[text()='Salvar Alterações']")
    driver.execute_script("arguments[0].click();", botao_salvar)
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    assert mensagem.is_displayed()
    driver.save_screenshot("evidencias_clientes/CT04_cliente_edicao.png")

def test_inativar_cliente(driver):
    """ Objetivo: Inativar cliente """
    espera = WebDriverWait(driver, 15)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Clientes')]"))).click()
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    driver.find_element(By.XPATH, "(//tbody//button[@title='Inativar'])[1]").click()
    driver.find_element(By.XPATH, "//button[contains(@class, 'btn-danger') and text()='Confirmar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success') and contains(., 'inativado')]")))
    assert mensagem.is_displayed()
    driver.save_screenshot("evidencias_clientes/CT05_cliente_inativacao.png")