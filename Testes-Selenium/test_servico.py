import os
import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

URL_BASE = "http://localhost:5173/"

def acessar_servicos(driver, espera):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Serviços')]"))).click()
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Serviço')]")))

def test_erro_validacao_servico(driver):
    """ Objetivo: Tentar cadastrar um serviço sem preencher os campos obrigatórios """
    espera = WebDriverWait(driver, 10)
    acessar_servicos(driver, espera)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Serviço')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Ex: Corte feminino']")))
    
    # Clica direto em cadastrar para disparar os erros
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    # Validações de campo obrigatório e formatos
    erro_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-field-error') and text()='Obrigatório']")))
    erro_preco = driver.find_element(By.XPATH, "//*[contains(@class, 's-field-error') and text()='Informe um valor válido']")
    erro_duracao = driver.find_element(By.XPATH, "//*[contains(@class, 's-field-error') and text()='Mínimo 5 minutos']")
    
    os.makedirs("evidencias_servicos", exist_ok=True)
    driver.save_screenshot("evidencias_servicos/CT01_erro_validacao_servico.png")
    
    driver.find_element(By.XPATH, "//button[text()='Cancelar']").click()
    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))
    
    assert erro_nome is not None
    assert erro_preco is not None
    assert erro_duracao is not None

def test_cadastrar_servico_com_sucesso(driver):
    """ Objetivo: Cadastrar um serviço preenchendo os dados corretamente """
    espera = WebDriverWait(driver, 10)
    acessar_servicos(driver, espera)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Serviço')]"))).click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Ex: Corte feminino']")))
    campo_nome.send_keys(f"Corte Masculino Premium {int(time.time())}")
    
    driver.find_element(By.XPATH, "//textarea[@placeholder='Descrição opcional do serviço']").send_keys("Corte moderno com acabamento em navalha")
    driver.find_element(By.XPATH, "//input[@placeholder='Ex: 85.00']").send_keys("50.00")
    driver.find_element(By.XPATH, "//input[@placeholder='Ex: 60']").send_keys("45")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))
    
    os.makedirs("evidencias_servicos", exist_ok=True)
    driver.save_screenshot("evidencias_servicos/CT02_cadastro_servico_sucesso.png")
    
    assert mensagem is not None

def test_editar_servico(driver):
    """ Objetivo: Editar o primeiro serviço listado """
    espera = WebDriverWait(driver, 15)
    acessar_servicos(driver, espera)
    
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    driver.find_element(By.XPATH, "(//tbody//button[@title='Editar'])[1]").click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Ex: Corte feminino']")))
    campo_nome.clear()
    campo_nome.send_keys(f"Corte Masculino Atualizado {int(time.time())}")
    
    driver.find_element(By.XPATH, "//button[text()='Salvar Alterações']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    
    os.makedirs("evidencias_servicos", exist_ok=True)
    driver.save_screenshot("evidencias_servicos/CT03_edicao_servico_sucesso.png")
    assert mensagem is not None

def test_inativar_servico(driver):
    """ Objetivo: Inativar o primeiro serviço ativo listado """
    espera = WebDriverWait(driver, 15)
    acessar_servicos(driver, espera)
    
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    botoes_inativar = driver.find_elements(By.XPATH, "//tbody//button[@title='Inativar']")
    if not botoes_inativar:
        pytest.skip("Não há serviços ativos para inativar")
        
    botoes_inativar[0].click()
    
    botao_confirmar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 's-btn-danger')]")))
    botao_confirmar.click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    
    os.makedirs("evidencias_servicos", exist_ok=True)
    driver.save_screenshot("evidencias_servicos/CT04_inativar_servico_sucesso.png")
    assert mensagem is not None
