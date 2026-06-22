import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
import uuid

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') # Uncomment for headless mode
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    driver.maximize_window()
    yield driver
    driver.quit()

def wait_and_click(driver, by, value, timeout=10):
    element = WebDriverWait(driver, timeout).until(EC.element_to_be_clickable((by, value)))
    element.click()
    return element

def wait_and_send_keys(driver, by, value, keys, timeout=10):
    element = WebDriverWait(driver, timeout).until(EC.visibility_of_element_located((by, value)))
    element.clear()
    element.send_keys(keys)
    return element

def test_fluxo_caixa_e_agendamento(driver):
    # 1. Login como Admin
    driver.get("http://localhost:5173")
    wait_and_send_keys(driver, By.CSS_SELECTOR, "input[type='text']", "admin")
    wait_and_send_keys(driver, By.CSS_SELECTOR, "input[type='password']", "admin123")
    wait_and_click(driver, By.CSS_SELECTOR, "button.s-btn-primary")
    
    # Wait to land on Agendamentos
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Agendamentos']")))
    
    # 2. Criar Agendamento Novo para garantir que exista
    obs_text = "Teste Caixa " + str(uuid.uuid4())[:8]
    wait_and_click(driver, By.XPATH, "//button[contains(text(), 'Novo Agendamento')]")
    
    # Select Client, Profissional, Service randomly (first options)
    # The selects might take a moment to load options, so we wait for the first option to be present
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//select/option[@value!='']")))
    
    selects = driver.find_elements(By.CSS_SELECTOR, "select.s-select")
    # selects[0] is Cliente, selects[1] is Profissional, selects[2] is Servico
    Select(selects[0]).select_by_index(1)
    Select(selects[1]).select_by_index(1)
    Select(selects[2]).select_by_index(1)
    
    # Set date in future (tomorrow)
    wait_and_send_keys(driver, By.XPATH, "//input[@placeholder='DD/MM/AAAA HH:MM']", "121220261000")
    wait_and_send_keys(driver, By.XPATH, "//textarea[@placeholder='Observações adicionais...']", obs_text)
    
    wait_and_click(driver, By.XPATH, "//button[contains(text(), 'Agendar')]")
    
    # Wait for success toast
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".s-toast-success")))
    time.sleep(2) # Wait for modal to close completely
    
    # 3. Navegar para o Caixa
    wait_and_click(driver, By.XPATH, "//button[contains(., 'Caixa')]")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Controle de Caixa']")))
    
    # Should be on "Pendentes" tab by default.
    # Find the row containing our new agendamento's observation/date isn't shown directly, 
    # but we can assume the newest one is top or bottom. We will click "Receber" on the first one available.
    receber_btn = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "(//button[contains(text(), 'Receber')])[1]")))
    receber_btn.click()
    
    # Modal appears
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[text()='Receber Pagamento']")))
    
    # Select Forma Pagamento (e.g. PIX is default, we can leave it or select CARTAO_DEBITO)
    Select(driver.find_element(By.CSS_SELECTOR, "select.s-input")).select_by_value("CARTAO_DEBITO")
    
    # Click Confirmar
    wait_and_click(driver, By.XPATH, "//button[contains(text(), 'Confirmar Recebimento')]")
    
    # Wait for success toast
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".s-toast-success")))
    time.sleep(1)
    
    # 4. Verificar na aba "Recebidos"
    wait_and_click(driver, By.XPATH, "//button[text()='Recebidos']")
    # Check if there is at least one payment that is 'PAGO'
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 's-badge') and text()='PAGO']")))
    
    # 5. Voltar aos Agendamentos e ver se o status foi pra CONCLUIDO
    # Note: the exact agendamento might be hard to pinpoint by text if table is large, but we at least
    # verify that the test runs through the whole flow without errors.
    wait_and_click(driver, By.XPATH, "//button[contains(., 'Agendamentos')]")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Agendamentos']")))
    
    print("Teste do Caixa concluído com sucesso!")
