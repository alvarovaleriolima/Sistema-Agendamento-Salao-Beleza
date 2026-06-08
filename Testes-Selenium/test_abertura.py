def test_abre_sistema(driver):
    driver.get("http://localhost:5173/")

    assert "localhost" in driver.current_url
    assert "Funcionários" in driver.page_source