from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import os

login_global_para_duplicacao = ""

# Definição da URL base para facilitar futuras alterações
URL_BASE = "http://localhost:5173/"

def test_cadastrar_administrador_com_sucesso(driver):
    global login_global_para_duplicacao
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    botao_novo_funcionario = espera.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))
    )
    botao_novo_funcionario.click()
    
    campo_nome = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))
    )
    campo_nome.send_keys("Carlos Pereira")
    
    login_unico = f"carlos.pereira.{int(time.time())}"
    login_global_para_duplicacao = login_unico 
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_unico)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("admin@salao.com")
    
    elemento_select = driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select")
    dropdown_perfil = Select(elemento_select)
    dropdown_perfil.select_by_value("ADMINISTRADOR")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem_sucesso = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Funcionário cadastrado')]"))
    )
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT01_cadastro_sucesso.png")
    assert mensagem_sucesso is not None


def test_erro_senha_com_7_caracteres(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    botao_novo = espera.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))
    )
    botao_novo.click()
    
    campo_nome = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))
    )
    campo_nome.send_keys("Daniel Souza")
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys("daniel.erro")
    
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("1234567")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("erro@salao.com")
    
    elemento_select = driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select")
    Select(elemento_select).select_by_value("ADMINISTRADOR")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem_erro = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//*[text()='Mínimo 8 caracteres']"))
    )
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT02_erro_senha.png")
    assert mensagem_erro.is_displayed()


def test_cadastrar_profissional_com_sucesso(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Eduardo Mendes")
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(f"eduardo.mendes.{int(time.time())}")
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-8888")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("prof@salao.com")
    
    dropdown_perfil = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select"))
    dropdown_perfil.select_by_value("PROFISSIONAL")
    
    elemento_especialidade = espera.until(
        EC.presence_of_element_located((By.XPATH, "//select[option[text()='Cabelo']]"))
    )
    Select(elemento_especialidade).select_by_visible_text("Sobrancelha")
    
    driver.find_element(By.XPATH, "//input[@placeholder='08:00 às 18:00']").send_keys("09:00 às 17:00")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Funcionário cadastrado')]")))
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT03_profissional_sucesso.png")
    assert mensagem is not None

def test_cadastrar_recepcionista_com_sucesso(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Fernanda Costa")
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(f"fernanda.costa.{int(time.time())}")
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-7777")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("recep@salao.com")
    
    dropdown = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select"))
    dropdown.select_by_value("RECEPCIONISTA")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Funcionário cadastrado')]")))
    driver.save_screenshot("evidencias/CT04_recepcionista_sucesso.png")
    assert mensagem is not None

def test_erro_login_duplicado(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    global login_global_para_duplicacao
    login_repetido = login_global_para_duplicacao 
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Fernanda Costa Clone")
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_repetido)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("clone@salao.com")
    
    dropdown = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select"))
    dropdown.select_by_value("ADMINISTRADOR")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem_erro = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-error')]")))
    driver.save_screenshot("evidencias/CT05_erro_login_duplicado.png")
    assert mensagem_erro is not None

def test_buscar_funcionario(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    global login_global_para_duplicacao
    
    aba_login = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 's-search-tab') and text()='Login']")))
    aba_login.click()
    
    campo_busca = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[contains(@class, 'search-input')]")))
    campo_busca.send_keys(login_global_para_duplicacao)
    
    driver.find_element(By.XPATH, "//button[contains(@class, 'btn-search')]").click()
    time.sleep(1)
    
    tabela = driver.find_element(By.TAG_NAME, "tbody").text
    assert login_global_para_duplicacao in tabela, "O funcionário buscado não apareceu na tabela!"
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT06_busca_sucesso.png")

def test_editar_funcionario(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    time.sleep(1)
    
    botao_editar = espera.until(EC.element_to_be_clickable((By.XPATH, "(//button[@title='Editar'])[1]")))
    botao_editar.click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys(Keys.CONTROL + "a")
    campo_nome.send_keys(Keys.BACKSPACE)
    time.sleep(0.5)
    
    campo_nome.send_keys("Marcos Vinicius")
    time.sleep(0.5)
    
    botao_salvar = espera.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Salvar Alterações']")))
    driver.execute_script("arguments[0].click();", botao_salvar)
    
    try:
        mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success') and contains(., 'atualizado')]")))
        os.makedirs("evidencias", exist_ok=True)
        driver.save_screenshot("evidencias/CT07_edicao_sucesso.png")
        assert mensagem is not None
    except Exception as e:
        os.makedirs("evidencias", exist_ok=True)
        driver.save_screenshot("evidencias/ERRO_BUG_EDICAO.png")
        raise e

def test_inativar_funcionario(driver):
    driver.get(URL_BASE)
    try:
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass
    espera = WebDriverWait(driver, 10)
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()
    
    # Pega todos os botões de inativar e clica no ÚLTIMO (para não inativar o admin que é o primeiro)
    botoes_inativar = espera.until(EC.presence_of_all_elements_located((By.XPATH, "//button[@title='Inativar']")))
    botao_inativar = botoes_inativar[-1]
    driver.execute_script("arguments[0].scrollIntoView(true);", botao_inativar)
    time.sleep(1)
    botao_inativar.click()
    
    botao_confirmar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'btn-danger') and text()='Confirmar']")))
    botao_confirmar.click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 's-toast-success') and contains(., 'inativado')]")))
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT08_inativacao_sucesso.png")
    assert mensagem is not None