import os

files = [
    "test_servico.py",
    "test_funcionario.py",
    "test_cliente.py",
    "test_agendamento.py"
]

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        lines = file.readlines()
    
    with open(f, "w", encoding="utf-8") as file:
        for line in lines:
            stripped = line.strip()
            if stripped == "from selenium.webdriver.common.by import By" and line.startswith("    "):
                continue
            if stripped == "from selenium.webdriver.support.ui import WebDriverWait" and line.startswith("    "):
                continue
            if stripped == "from selenium.webdriver.support import expected_conditions as EC" and line.startswith("    "):
                continue
            file.write(line)
    print(f"Fixed {f}")
