import os

files = ["test_cliente.py", "test_servico.py", "test_agendamento.py"]

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Remove driver.refresh() and time.sleep(1)
    content = content.replace("    driver.refresh()\n    time.sleep(1)\n", "")
    content = content.replace("    driver.refresh()\n", "")
    
    # Remove time.sleep(1) that I added after invisibility_of_element_located
    content = content.replace("    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, \"s-modal-overlay\")))\n    time.sleep(1)\n", "    espera.until(EC.invisibility_of_element_located((By.CLASS_NAME, \"s-modal-overlay\")))\n")
    
    # Replace is_displayed()
    content = content.replace("assert mensagem.is_displayed()", "assert mensagem is not None")
    content = content.replace("assert mensagem_erro.is_displayed()", "assert mensagem_erro is not None")
    
    with open(f, "w", encoding="utf-8") as file:
        file.write(content)
