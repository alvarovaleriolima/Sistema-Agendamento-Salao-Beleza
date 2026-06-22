import os
import time
import pytest
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

URL_BASE = "http://localhost:5173/"

def acessar_e_logar_admin(driver, espera):
    driver.get(URL_BASE)
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Digite seu login']"))).send_keys("admin")
    driver.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys("admin123")
    driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()
    time.sleep(2)
    os.makedirs("evidencias_relatorios", exist_ok=True)
    driver.save_screenshot("evidencias_relatorios/DEBUG_apos_login.png")

def test_relatorio_fluxo_completo(driver):
    """ Objetivo: Criar agendamento, concluir e validar se aparece no relatório com faturamento """
    espera = WebDriverWait(driver, 10)
    acessar_e_logar_admin(driver, espera)
    
    # 1. Criar Agendamento
    aba_agendamentos = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Agendamentos')]")))
    aba_agendamentos.click()
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Agendamento')]"))).click()
    
    select_cliente = Select(espera.until(EC.visibility_of_element_located((By.XPATH, "//label[contains(text(), 'Cliente')]/following-sibling::select"))))
    espera.until(lambda d: len(select_cliente.options) > 1)
    select_cliente.select_by_index(1)
    
    select_profissional = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Profissional')]/following-sibling::select"))
    select_profissional.select_by_index(1)
    
    select_servico = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Serviço')]/following-sibling::select"))
    select_servico.select_by_index(1)
    
    # Criar para hoje, para que apareça imediatamente na tabela de agendamentos
    agora = datetime.now()
    data_str = f"{agora.strftime('%d%m%Y')}2300"
    
    campo_data = driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA HH:MM']")
    campo_data.send_keys(data_str)
    
    driver.find_element(By.XPATH, "//button[text()='Agendar']").click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    time.sleep(1)
    
    # 2. Editar para CONCLUIDO
    botoes_editar = driver.find_elements(By.XPATH, "//tbody//button[@title='Editar']")
    botoes_editar[0].click()
    
    select_status = Select(espera.until(EC.visibility_of_element_located((By.XPATH, "//label[contains(text(), 'Status')]/following-sibling::select"))))
    select_status.select_by_value("CONCLUIDO")
    driver.find_element(By.XPATH, "//button[text()='Salvar Alterações']").click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    time.sleep(1)
    
    # 3. Gerar Relatório
    aba_relatorios = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Relatórios')]")))
    aba_relatorios.click()
    
    botao_gerar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Gerar Relatório')]")))
    botao_gerar.click()
    
    # Espera a requisição terminar e a tabela ou card carregar
    time.sleep(1)
    faturamento_card = espera.until(EC.visibility_of_element_located((By.XPATH, "//h3[contains(text(), 'Faturamento Total Bruto')]/following-sibling::div")))
    
    os.makedirs("evidencias_relatorios", exist_ok=True)
    driver.save_screenshot("evidencias_relatorios/CT01_relatorio_fluxo_completo.png")
    
    # Validar se o faturamento mudou
    assert faturamento_card.text != "R$ 0,00"

