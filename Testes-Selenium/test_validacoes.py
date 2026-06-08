def test_senha_menor_que_8_caracteres(driver):
    driver.get(f"{URL_BASE}/funcionarios") # Acessa a página principal
    wait = WebDriverWait(driver, 10)

    # 1. Clica no botão para abrir o Modal
    btn_novo = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Novo Funcionário')]")))
    btn_novo.click()

    # 2. Agora o formulário está visível. Preenche o campo login para habilitar validações
    wait.until(EC.visibility_of_element_located((By.NAME, "login"))).send_keys("usuario_teste")
    
    # 3. Preenche a senha com 7 caracteres
    driver.find_element(By.NAME, "senha").send_keys("1234567")
    
    # Tenta salvar
    driver.find_element(By.XPATH, "//button[@type='submit']").click()

    # Espera a mensagem de erro
    xpath_mensagem_erro = "//p[contains(text(), 'Senha deve ter no mínimo 8 caracteres')]"
    erro_senha = wait.until(EC.visibility_of_element_located((By.XPATH, xpath_mensagem_erro)))
    
    assert erro_senha.is_displayed(), "A mensagem de erro de senha não apareceu na tela"