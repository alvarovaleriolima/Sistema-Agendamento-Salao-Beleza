from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import os  # Biblioteca nativa para gerenciar pastas no computador

login_global_para_duplicacao = ""

def test_cadastrar_administrador_com_sucesso(driver):
    global login_global_para_duplicacao
    """
    Objetivo: Validar o cadastro de um funcionário com perfil de Administrador,
    preenchendo todos os campos obrigatórios.
    """
    url_local = "http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html"
    driver.get(url_local)
    
    espera = WebDriverWait(driver, 10)
    
    botao_novo_funcionario = espera.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))
    )
    botao_novo_funcionario.click()
    
    campo_nome = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))
    )
    campo_nome.send_keys("Administrador Automação")
    
    login_unico = f"admin.auto.{int(time.time())}"
    login_global_para_duplicacao = login_unico 
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_unico)
    
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("admin@salao.com")
    
    elemento_select = driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select")
    dropdown_perfil = Select(elemento_select)
    dropdown_perfil.select_by_value("ADMINISTRADOR")
    
    # ... preenchimento dos campos anteriores
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    # 1. Aguarda o balão de sucesso aparecer (se não aparecer, o teste falha aqui por Timeout)
    mensagem_sucesso = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Funcionário cadastrado')]"))
    )
    
    # 2. Tira o print IMEDIATAMENTE enquanto o balão está fresco na tela
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT01_cadastro_sucesso.png")
    
    # 3. Validação simplificada: se a variável existe, o teste passou com sucesso!
    assert mensagem_sucesso is not None


def test_erro_senha_com_7_caracteres(driver):
    """
    Objetivo: Validar que o sistema impede o cadastro e exibe mensagem
    de erro na tela quando a senha possui menos de 8 caracteres.
    """
    url_local = "http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html"
    driver.get(url_local)
    
    espera = WebDriverWait(driver, 10)
    
    botao_novo = espera.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))
    )
    botao_novo.click()
    
    campo_nome = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))
    )
    campo_nome.send_keys("Usuario Teste Erro")
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys("teste.erro")
    
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("1234567")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("erro@salao.com")
    
    elemento_select = driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select")
    Select(elemento_select).select_by_value("ADMINISTRADOR")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem_erro = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//*[text()='Mínimo 8 caracteres']"))
    )
    
    # --- CAPTURA DE TELA AUTOMÁTICA ---
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT02_erro_senha.png")
    # ----------------------------------
    
    assert mensagem_erro.is_displayed(), "A mensagem de erro da senha não foi exibida na tela."

    # Seguir a partir daqui ----------------------------------------

def test_cadastrar_profissional_com_sucesso(driver):
    """ Objetivo: Cadastrar PROFISSIONAL preenchendo especialidade e horário """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Profissional Automação")
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(f"prof.auto.{int(time.time())}")
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    # ATENÇÃO: Confirme se os campos de telefone e senha continuam na tela! Se sim, mantemos essas linhas:
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-8888")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("prof@salao.com")
    
    # Seleciona o perfil PROFISSIONAL
    dropdown_perfil = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select"))
    dropdown_perfil.select_by_value("PROFISSIONAL")
    
    # === A MÁGICA DOS NOVOS CAMPOS AQUI ===
    # Seleciona a Especialidade pelo Dropdown (buscamos o select que tem a opção 'Cabelo' dentro dele)
    elemento_especialidade = espera.until(
        EC.presence_of_element_located((By.XPATH, "//select[option[text()='Cabelo']]"))
    )
    Select(elemento_especialidade).select_by_visible_text("Sobrancelha")
    
    # Preenche o Horário com o placeholder exato da foto
    driver.find_element(By.XPATH, "//input[@placeholder='08:00 às 18:00']").send_keys("09:00 às 17:00")
    # ======================================
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Funcionário cadastrado')]")))
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT03_profissional_sucesso.png")
    assert mensagem is not None

def test_cadastrar_recepcionista_com_sucesso(driver):
    """ Objetivo: Cadastrar RECEPCIONISTA """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Recepcionista Automação")
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(f"recep.auto.{int(time.time())}")
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-7777")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("recep@salao.com")
    
    # Seleciona o perfil RECEPCIONISTA
    dropdown = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select"))
    dropdown.select_by_value("RECEPCIONISTA")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Funcionário cadastrado')]")))
    driver.save_screenshot("evidencias/CT04_recepcionista_sucesso.png")
    assert mensagem is not None

def test_erro_login_duplicado(driver):
    """ Objetivo: Tentar cadastrar com um login que já existe """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    # Para garantir o erro, vamos usar um login fixo que você sabe que já está no banco!
    # Lembra do admin.teste.3 que você criou manualmente? Vamos tentar usá-lo de novo.
    login_repetido = "admin.teste.3" 
    
    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Novo Funcionário')]"))).click()
    espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']"))).send_keys("Clone Teste")
    
    driver.find_element(By.XPATH, "//input[@placeholder='login.usuario']").send_keys(login_repetido)
    driver.find_element(By.XPATH, "//input[@placeholder='Mínimo 8 caracteres']").send_keys("Senha@123")
    driver.find_element(By.XPATH, "//input[@placeholder='(00) 00000-0000']").send_keys("(35) 99999-9999")
    driver.find_element(By.XPATH, "//input[@placeholder='email@exemplo.com']").send_keys("clone@salao.com")
    
    dropdown = Select(driver.find_element(By.XPATH, "//label[contains(text(), 'Perfil')]/following-sibling::select"))
    dropdown.select_by_value("ADMINISTRADOR")
    
    driver.find_element(By.XPATH, "//button[text()='Cadastrar']").click()
    
    # Valida a mensagem de erro que o sistema deve cuspir na tela
    # Atenção: Ajuste o texto 'já existe' para a mensagem de erro exata que seu sistema mostra!
    mensagem_erro = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'já existe') or contains(., 'duplicado') or contains(., 'Erro')]")))
    driver.save_screenshot("evidencias/CT05_erro_login_duplicado.png")
    assert mensagem_erro is not None

def test_buscar_funcionario(driver):
    """ Objetivo: Buscar um funcionário específico usando a barra de pesquisa """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    global login_global_para_duplicacao
    
    # 1. Altera a aba de busca para 'Login'
    aba_login = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'search-tab') and text()='Login']")))
    aba_login.click()
    
    # 2. Digita o login salvo na variável global
    campo_busca = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[contains(@class, 'search-input')]")))
    campo_busca.send_keys(login_global_para_duplicacao)
    
    # 3. Clica no botão Buscar
    driver.find_element(By.XPATH, "//button[contains(@class, 'btn-search')]").click()
    time.sleep(1) # Aguarda a tabela renderizar o React
    
    # Valida se o login buscado apareceu na primeira célula da tabela
    tabela = driver.find_element(By.TAG_NAME, "tbody").text
    assert login_global_para_duplicacao in tabela, "O funcionário buscado não apareceu na tabela!"
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT06_busca_sucesso.png")

def test_editar_funcionario(driver):
    """ Objetivo: Abrir o modal de edição e alterar o nome do funcionário """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    time.sleep(1) # Aguarda a tabela
    
    botao_editar = espera.until(EC.element_to_be_clickable((By.XPATH, "(//button[@title='Editar'])[1]")))
    botao_editar.click()
    
    campo_nome = espera.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Nome completo']")))
    
    # Apaga e reescreve
    campo_nome.send_keys(Keys.CONTROL + "a")
    campo_nome.send_keys(Keys.BACKSPACE)
    time.sleep(0.5)
    
    campo_nome.send_keys("Nome Editado Automação")
    time.sleep(0.5)
    
    # --- O CLIQUE FORÇADO VIA JAVASCRIPT ---
    # Encontra o botão de salvar
    botao_salvar = espera.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Salvar Alterações']")))
    
    # Força o clique diretamente no motor do navegador, ignorando bloqueios do React
    driver.execute_script("arguments[0].click();", botao_salvar)
    # ----------------------------------------
    
    try:
        mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 'toast-success') and contains(., 'atualizado')]")))
        
        os.makedirs("evidencias", exist_ok=True)
        driver.save_screenshot("evidencias/CT07_edicao_sucesso.png")
        assert mensagem is not None
        
    except Exception as e:
        os.makedirs("evidencias", exist_ok=True)
        driver.save_screenshot("evidencias/ERRO_BUG_EDICAO.png")
        raise e

def test_inativar_funcionario(driver):
    """ Objetivo: Inativar um funcionário e validar a mudança de status """
    driver.get("http://127.0.0.1:5500/Sistema-Agendamento-Salao-Beleza/salao/FrontEnd/index.html")
    espera = WebDriverWait(driver, 10)
    
    # Clica no botão de Inativar do PRIMEIRO item ATIVO da tabela
    botao_inativar = espera.until(EC.element_to_be_clickable((By.XPATH, "(//button[@title='Inativar'])[1]")))
    botao_inativar.click()
    
    # O seu sistema usa um Modal customizado (<ConfirmDialog>) e não o alert padrão do navegador!
    botao_confirmar = espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'btn-danger') and text()='Confirmar']")))
    botao_confirmar.click()
    
    # Valida o Toast de inativação (O React gera a msg '... inativado.')
    mensagem = espera.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(@class, 'toast-success') and contains(., 'inativado')]")))
    
    os.makedirs("evidencias", exist_ok=True)
    driver.save_screenshot("evidencias/CT08_inativacao_sucesso.png")
    assert mensagem is not None