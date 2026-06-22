import os

files_to_fix = [
    "test_funcionario.py",
    "test_cliente.py",
    "test_servico.py",
    "test_agendamento.py"
]

injection = """    driver.get(URL_BASE)
    try:
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        WebDriverWait(driver, 3).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='text']"))).send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("admin123")
        driver.find_element(By.CSS_SELECTOR, "button.s-btn-primary").click()
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Bem-vindo')]")))
    except Exception as e:
        pass"""

for file in files_to_fix:
    path = os.path.join("C:\\Projetos\\Sistema-Agendamento-Salao-Beleza\\Testes-Selenium", file)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace only if not already replaced
        if "admin123" not in content:
            content = content.replace("    driver.get(URL_BASE)", injection)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
        print(f"Fixed {file}")
