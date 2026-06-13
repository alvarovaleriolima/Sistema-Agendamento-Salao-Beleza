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
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    # 1. Clica no menu lateral 'Clientes' para mudar de página no React
    menu_clientes = espera.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'sidebar-item') and contains(., 'Clientes')]")))
    menu_clientes.click()
    
    # 2. Abre o modal de Novo Cliente
    botao_novo = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Cliente')]")))
    botao_novo.click()
    
    # 3. Preenche os dados
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys("Cliente Automação")
    
    # Preenche a data de nascimento (o FrontEnd deve aplicar a máscara DD/MM/AAAA automaticamente)
    driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA']").send_keys("15081995")
    
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 98888-7777")
    
    login_unico = f"cliente.auto.{int(time.time())}"
    login_global_cliente = login_unico 
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_unico)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("cliente@salao.com")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    # Valida o Toast de sucesso
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 'toast-success') and contains(., 'cadastrado')]")))
    
    os.makedirs("evidencias_clientes", exist_ok=True)
    driver.save_screenshot("evidencias_clientes/CT01_cliente_sucesso.png")
    assert mensagem is not None

def test_erro_login_duplicado_cliente(driver):
    """ Objetivo: Tentar cadastrar cliente com login já existente """
    global login_global_cliente
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    menu_clientes = espera.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'sidebar-item') and contains(., 'Clientes')]")))
    menu_clientes.click()
    
    botao_novo = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Cliente')]")))
    botao_novo.click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys("Cliente Clone")
    
    driver.find_element(By.XPATH, "//input[@placeholder='DD/MM/AAAA']").send_keys("10101990")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 91111-2222")
    
    # Usa o login gerado no teste anterior!
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_global_cliente)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    # Valida a mensagem de erro (ajuste o texto do contains se o seu Java devolver uma msg diferente)
    mensagem_erro = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 'toast-error') or contains(., 'já existe')]")))
    
    os.makedirs("evidencias_clientes", exist_ok=True)
    driver.save_screenshot("evidencias_clientes/CT02_cliente_login_duplicado.png")
    assert mensagem_erro is not None

def test_buscar_cliente(driver):
    """ Objetivo: Buscar cliente cadastrado """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    global login_global_cliente
    
    # Navega para Clientes
    espera.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(., 'Clientes') and contains(@class, 'sidebar-item')]"))).click()
    
    # Busca pelo login salvo globalmente
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
    """ Objetivo: Editar dados de um cliente com navegação garantida """
    espera = WebDriverWait(driver, 15)
    
    # 1. Navegação explícita: Garante que estamos na página correta
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Clientes')]"))).click()
    
    # 2. Espera a tabela estar presente e visível
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    
    # 3. Busca o botão de editar na primeira linha
    botao_editar = espera.until(EC.element_to_be_clickable((By.XPATH, "(//tbody//button[@title='Editar'])[1]")))
    botao_editar.click()
    
    # 4. Edição
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    campo_nome.send_keys(Keys.CONTROL + "a")
    campo_nome.send_keys(Keys.BACKSPACE)
    time.sleep(0.5)
    campo_nome.send_keys("Cliente Editado Automação")
    
    botao_salvar = driver.find_element(By.XPATH, "//button[text()='Salvar Alterações']")
    driver.execute_script("arguments[0].click();", botao_salvar)
    
    # 5. Validação
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 'toast-success')]")))
    assert mensagem.is_displayed()
    driver.save_screenshot("evidencias_clientes/CT04_cliente_edicao.png")

def test_inativar_cliente(driver):
    """ Objetivo: Inativar cliente com navegação garantida """
    espera = WebDriverWait(driver, 15)
    
    # 1. Navegação explícita
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Clientes')]"))).click()
    
    # 2. Espera a tabela e o botão de inativar
    espera.until(EC.visibility_of_element_located((By.TAG_NAME, "tbody")))
    botao_inativar = espera.until(EC.element_to_be_clickable((By.XPATH, "(//tbody//button[@title='Inativar'])[1]")))
    botao_inativar.click()
    
    # 3. Confirma no modal
    botao_confirmar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'btn-danger') and text()='Confirmar']")))
    botao_confirmar.click()
    
    # 4. Validação
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 'toast-success') and contains(., 'inativado')]")))
    assert mensagem.is_displayed()
    driver.save_screenshot("evidencias_clientes/CT05_cliente_inativacao.png")