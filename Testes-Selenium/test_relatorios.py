import os
import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

URL_BASE = "http://localhost:5173/"

def acessar_e_logar_admin(driver, espera):
    driver.get(URL_BASE)
    # Preenche credenciais
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Digite seu login']"))).send_keys("admin")
    driver.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys("admin123")
    # Clica em entrar
    driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()
    # Verifica se apareceu o toast de sucesso e espera
    espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success')]")))
    time.sleep(1) # Aguarda animações

def test_gerar_relatorio_sucesso(driver):
    """ Objetivo: Acessar a tela de relatórios e gerar um relatório """
    espera = WebDriverWait(driver, 10)
    acessar_e_logar_admin(driver, espera)
    
    # Clicar no menu Relatórios
    aba_relatorios = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Relatórios')]")))
    aba_relatorios.click()
    
    # Opcional: preencher datas se necessário, mas os campos default já trazem o mês atual.
    botao_gerar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Gerar Relatório')]")))
    botao_gerar.click()
    
    # Esperar carregar os relatórios verificando a presença dos cards de resumo
    espera.until(EC.visibility_of_element_located((By.XPATH, "//h3[contains(text(), 'Faturamento Total Bruto')]")))
    
    # Tirar screenshot
    os.makedirs("evidencias_relatorios", exist_ok=True)
    driver.save_screenshot("evidencias_relatorios/CT01_gerar_relatorio_sucesso.png")
    
    # Validações visuais
    faturamento_card = driver.find_element(By.XPATH, "//h3[contains(text(), 'Faturamento Total Bruto')]")
    ranking_card = driver.find_element(By.XPATH, "//h3[contains(text(), 'Ranking de Serviços')]")
    
    assert faturamento_card.is_displayed()
    assert ranking_card.is_displayed()
