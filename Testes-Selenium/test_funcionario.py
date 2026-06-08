import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

URL_BASE = "http://localhost:5173"
def test_buscar_funcionario(driver):
    driver.get(f"{URL_BASE}/funcionarios")
    wait = WebDriverWait(driver, 10)

    # 1. Encontra o input de busca através de parte do placeholder
    input_busca = wait.until(EC.visibility_of_element_located((By.XPATH, "//input[contains(@placeholder, 'Buscar por')]")))
    input_busca.clear()
    input_busca.send_keys("Admin Teste")

    # 2. Clica no botão Buscar
    btn_buscar = driver.find_element(By.XPATH, "//button[contains(., 'Buscar')]")
    btn_buscar.click()

    # 3. Valida se a linha retornada na tabela contém o nome esperado
    # O React cria uma div com a classe "font-medium" para o nome
    nome_na_tabela = wait.until(EC.visibility_of_element_located((By.XPATH, "//td//div[contains(@class, 'font-medium')]"))).text
    assert "Admin Teste" in nome_na_tabela

def test_inativar_funcionario(driver):
    driver.get(f"{URL_BASE}/funcionarios")
    wait = WebDriverWait(driver, 10)

    # 1. Realiza a busca para isolar o funcionário na tabela
    input_busca = wait.until(EC.visibility_of_element_located((By.XPATH, "//input[contains(@placeholder, 'Buscar por')]")))
    input_busca.clear()
    input_busca.send_keys("Admin Teste")
    
    driver.find_element(By.XPATH, "//button[contains(., 'Buscar')]").click()

    # Dá uma pequena pausa para o React renderizar a tabela filtrada
    time.sleep(1)

    # 2. Clica no botão de inativar da tabela (identificado pelo title="Inativar")
    btn_inativar_tabela = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@title='Inativar']")))
    btn_inativar_tabela.click()

    # 3. Interage com o modal <ConfirmDialog>
    # Baseado na sua prop confirmLabel="Inativar", o botão de confirmação do modal deve ter esse texto
    btn_confirmar_modal = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@role='dialog']//button[contains(text(), 'Inativar')] | //button[contains(text(), 'Inativar') and not(@title)]")))
    btn_confirmar_modal.click()

    # 4. Validação: Verifica se a badge de status mudou para 'Inativo' na tabela
    # Busca um span dentro da tabela que contenha o texto 'Inativo'
    badge_inativo = wait.until(EC.visibility_of_element_located((By.XPATH, "//td//span[contains(text(), 'Inativo')]")))
    assert badge_inativo.is_displayed(), "O status do funcionário não mudou para Inativo na tabela."
    
    # Confirma que o botão de inativar sumiu para este usuário
    botoes_inativar = driver.find_elements(By.XPATH, "//button[@title='Inativar']")
    assert len(botoes_inativar) == 0, "O botão de inativar ainda está visível para um funcionário já inativo."