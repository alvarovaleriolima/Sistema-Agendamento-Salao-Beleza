import os
import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

URL_BASE = "http://localhost:5173/"

def acessar_agendamentos(driver, espera):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Agendamentos')]"))).click()
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Agendamento')]")))

def setup_dados(driver, espera):
    # Criar cliente
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Clientes')]"))).click()
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Cliente')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Gabriel Santos")
    driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA']").send_keys("10101990")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(11) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(f"cli.{int(time.time())}")
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))
    
    # Criar funcionario
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Funcionários')]"))).click()
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Helena Rocha")
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(f"prof.{int(time.time())}")
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(11) 99999-9999")
    Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select")).select_by_value("PROFISSIONAL")
    Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Especialidade')]/following-sibling::select")).select_by_value("CABELO")
    driver.find_element(By.XPATH, "//input[@placeholder='08:00 às 18:00']").send_keys("08:00 às 18:00")
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    try:
        espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))
    except:
        driver.save_screenshot("evidencias_agendamentos/erro_modal_funcionario.png")
        raise
    time.sleep(1)
    
    # Criar servico
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Serviços')]"))).click()
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Serviço')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Ex: Corte feminino']"))).send_keys("Luzes e Reflexo")
    driver.find_element(By.XPATH, "//input[@placeholder='Ex: 85.00']").send_keys("50.00")
    driver.find_element(By.XPATH, "//input[@placeholder='Ex: 60']").send_keys("30")
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))

def test_erro_validacao_agendamento(driver):
    """ Objetivo: Tentar cadastrar um agendamento sem preencher os campos """
    espera = WebDriverWait(driver, 10)
    acessar_agendamentos(driver, espera)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Agendamento')]"))).click()
    
    espera.until(EC.visibility_of_element_located((By.XPATH, "//select[contains(@class, 's-select')]")))
    
    driver.find_element(By.XPATH, "//button[text()='Agendar']").click()
    
    erros_obrigatorio = espera.until(EC.presence_of_all_elements_located((By.XPATH, "//*[contains(@class, 's-field-error') and text()='Obrigatório']")))
    erro_data = driver.find_element(By.XPATH, "//*[contains(@class, 's-field-error') and text()='Formato: DD/MM/AAAA HH:MM']")
    
    os.makedirs("evidencias_agendamentos", exist_ok=True)
    driver.save_screenshot("evidencias_agendamentos/CT01_erro_validacao_agendamento.png")
    
    driver.find_element(By.XPATH, "//button[text()='Cancelar']").click()
    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))
    
    assert len(erros_obrigatorio) >= 3
    assert erro_data is not None

def test_cadastrar_agendamento_com_sucesso(driver):
    """ Objetivo: Cadastrar um agendamento com dados corretos """
    espera = WebDriverWait(driver, 10)
    setup_dados(driver, espera)
    acessar_agendamentos(driver, espera)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Agendamento')]"))).click()
    
    select_cliente = Select(espera.until(EC.visibility_of_element_located((By.XPATH, "//label[contains(text(), 'Cliente')]/following-sibling::select"))))
    espera.until(lambda d: len(select_cliente.options) > 1)
    
    select_cliente.select_by_index(1)
    
    select_profissional = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Profissional')]/following-sibling::select"))
    select_profissional.select_by_index(1)
    
    select_servico = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Serviço')]/following-sibling::select"))
    select_servico.select_by_index(1)
    
    campo_data = driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA HH:MM']")
    campo_data.send_keys("101020301400") # A máscara formata para 10/10/2030 14:00
    
    driver.find_element(By.XPATH, "//button[text()='Agendar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    
    os.makedirs("evidencias_agendamentos", exist_ok=True)
    driver.save_screenshot("evidencias_agendamentos/CT02_cadastro_agendamento_sucesso.png")
    
    assert mensagem is not None

def test_editar_agendamento(driver):
    """ Objetivo: Editar o primeiro agendamento listado, alterando status """
    espera = WebDriverWait(driver, 15)
    acessar_agendamentos(driver, espera)
    
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    botoes_editar = driver.find_elements(By.XPATH, "//tbody//button[@title='Editar']")
    if not botoes_editar:
        pytest.skip("Não há agendamentos para editar")
        
    botoes_editar[0].click()
    
    select_status = Select(espera.until(EC.visibility_of_element_located((By.XPATH, "//label[contains(text(), 'Status')]/following-sibling::select"))))
    select_status.select_by_value("CONCLUIDO")
    
    driver.find_element(By.XPATH, "//button[text()='Salvar Alterações']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, "s-modal-overlay")))
    
    os.makedirs("evidencias_agendamentos", exist_ok=True)
    driver.save_screenshot("evidencias_agendamentos/CT03_edicao_agendamento_sucesso.png")
    assert mensagem is not None

def test_cancelar_agendamento(driver):
    """ Objetivo: Cancelar um agendamento agendado """
    espera = WebDriverWait(driver, 15)
    acessar_agendamentos(driver, espera)
    
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    botoes_cancelar = driver.find_elements(By.XPATH, "//tbody//button[@title='Cancelar']")
    if not botoes_cancelar:
        pytest.skip("Não há agendamentos válidos para cancelar (Apenas agendados podem ser cancelados)")
        
    botoes_cancelar[0].click()
    
    botao_confirmar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 's-btn-danger')]")))
    botao_confirmar.click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    
    os.makedirs("evidencias_agendamentos", exist_ok=True)
    driver.save_screenshot("evidencias_agendamentos/CT04_cancelar_agendamento_sucesso.png")
    assert mensagem is not None
