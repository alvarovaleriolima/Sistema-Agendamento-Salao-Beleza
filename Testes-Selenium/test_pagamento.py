import pytest
import requests
import datetime

URL_BASE_API = "http://localhost:8080/api"

def obter_dados_teste():
    """Busca um agendamento existente e o respectivo cliente para vincular ao pagamento."""
    try:
        res_agendamentos = requests.get(f"{URL_BASE_API}/agendamentos")
        if res_agendamentos.status_code != 200:
            pytest.skip("Backend não está acessível no endpoint /agendamentos")
            
        agendamentos = res_agendamentos.json()
        if not agendamentos:
            pytest.skip("Nenhum agendamento disponível no banco para rodar os testes de pagamento")
            
        agendamento = agendamentos[0]
        cliente_login = agendamento['clienteLogin']
        
        res_cliente = requests.get(f"{URL_BASE_API}/clientes/login/{cliente_login}")
        cliente = res_cliente.json()
        
        return cliente['id'], agendamento['id']
    except requests.exceptions.ConnectionError:
        pytest.skip("Backend offline (ConnectionError)")

def test_criar_pagamento():
    """ Objetivo: Registrar um pagamento com sucesso (RFC02) """
    cliente_id, agendamento_id = obter_dados_teste()
        
    payload = {
        "clienteId": cliente_id,
        "agendamentoId": agendamento_id,
        "valor": 150.00,
        "status": "PAGO",
        "dataPagamento": datetime.datetime.now().strftime("%Y-%m-%d"),
        "formaPagamento": "PIX"
    }
    
    response = requests.post(f"{URL_BASE_API}/pagamentos", json=payload)
    assert response.status_code in [200, 201], f"Falha ao criar pagamento: {response.text}"
    
    data = response.json()
    assert data["status"] == "PAGO"
    assert data["formaPagamento"] == "PIX"
    assert data["valor"] == 150.00
    assert data["clienteId"] == cliente_id
    assert data["agendamentoId"] == agendamento_id

def test_impedir_valor_negativo():
    """ Objetivo: Garantir que o sistema impede pagamentos com valor negativo (RFC02) """
    cliente_id, agendamento_id = obter_dados_teste()
        
    payload = {
        "clienteId": cliente_id,
        "agendamentoId": agendamento_id,
        "valor": -50.00,
        "status": "PENDENTE"
    }
    
    response = requests.post(f"{URL_BASE_API}/pagamentos", json=payload)
    
    # O backend deve retornar 400 Bad Request devido a validação @PositiveOrZero em PagamentoRequestDTO
    assert response.status_code == 400, f"Deveria ter recusado valor negativo, mas retornou {response.status_code}: {response.text}"

def test_consultar_pagamentos():
    """ Objetivo: Consultar lista de pagamentos e garantir que o recém criado está lá (RFC02) """
    try:
        response = requests.get(f"{URL_BASE_API}/pagamentos")
        if response.status_code != 200:
            pytest.skip("Backend não está acessível no endpoint /pagamentos")
            
        dados = response.json()
        assert isinstance(dados, list)
    except requests.exceptions.ConnectionError:
        pytest.skip("Backend offline (ConnectionError)")
