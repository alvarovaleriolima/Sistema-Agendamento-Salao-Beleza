import re

with open('test_funcionario.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'(espera = WebDriverWait\(driver, 10\)\n)',
    r'\1    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., \'Funcionários\')]"))).click()\n',
    content
)

with open('test_funcionario.py', 'w', encoding='utf-8') as f:
    f.write(content)
