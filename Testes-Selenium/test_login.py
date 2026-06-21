from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

URL_BASE = "http://localhost:5173/"

def test_login_funcionario_sucesso(driver):
    driver.get(URL_BASE)
    espera = WebDriverWait(driver, 10)
    
    # Preenche credenciais
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Digite seu login']"))).send_keys("admin")
    driver.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys("admin123")
    
    # Clica em entrar
    driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()
    
    # Verifica se apareceu o toast de sucesso e se logou
    mensagem_sucesso = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success') and contains(., 'Bem-vindo(a)')]")))
    
    os.makedirs("evidencias_login", exist_ok=True)
    driver.save_screenshot("evidencias_login/CT01_login_funcionario_sucesso.png")
    assert mensagem_sucesso is not None

def test_login_funcionario_erro(driver):
    driver.get(URL_BASE)
    espera = WebDriverWait(driver, 10)
    
    # Preenche credenciais incorretas
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Digite seu login']"))).send_keys("admin")
    driver.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys("senha_errada")
    
    # Clica em entrar
    driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()
    
    # Verifica mensagem de erro no form
    mensagem_erro = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-login-error')]")))
    
    os.makedirs("evidencias_login", exist_ok=True)
    driver.save_screenshot("evidencias_login/CT02_login_funcionario_erro.png")
    assert "Credenciais inválidas" in mensagem_erro.text or "inativo" in mensagem_erro.text or "Invalid credentials" in mensagem_erro.text

def test_cadastro_e_login_cliente_sucesso(driver):
    driver.get(URL_BASE)
    espera = WebDriverWait(driver, 10)
    
    # Clica na aba Cliente
    aba_cliente = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Cliente')]")))
    aba_cliente.click()
    
    # Clica em Cadastre-se aqui
    link_cadastro = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Cadastre-se aqui')]")))
    link_cadastro.click()
    
    # Preenche formulário de registro
    login_unico = f"cliente.teste.{int(time.time())}"
    
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Digite seu nome completo']"))).send_keys("Cliente de Teste")
    driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA']").send_keys("15/08/1990")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("35988887777")
    driver.find_element(By.XPATH, "//input[@placeholder='Digite seu email']").send_keys("cliente@teste.com")
    
    driver.find_element(By.XPATH, "//input[@placeholder='Digite seu login']").send_keys(login_unico)
    driver.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys("senha123")
    
    # Clica em Cadastrar
    driver.find_element(By.XPATH, "//button[contains(., 'Cadastrar')]").click()
    
    # Verifica sucesso e login automático
    mensagem_sucesso = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success') and contains(., 'Cadastro realizado')]")))
    
    os.makedirs("evidencias_login", exist_ok=True)
    driver.save_screenshot("evidencias_login/CT03_cadastro_cliente_sucesso.png")
    assert mensagem_sucesso is not None

def test_login_cliente_erro(driver):
    driver.get(URL_BASE)
    espera = WebDriverWait(driver, 10)
    
    # Clica na aba Cliente
    aba_cliente = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Cliente')]")))
    aba_cliente.click()
    
    # Preenche credenciais incorretas
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Digite seu login']"))).send_keys("cliente_inexistente")
    driver.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys("senha_errada")
    
    # Clica em entrar
    driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()
    
    # Verifica mensagem de erro no form
    mensagem_erro = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-login-error')]")))
    
    os.makedirs("evidencias_login", exist_ok=True)
    driver.save_screenshot("evidencias_login/CT04_login_cliente_erro.png")
    assert "Credenciais inválidas" in mensagem_erro.text or "inativo" in mensagem_erro.text or "Invalid credentials" in mensagem_erro.text
