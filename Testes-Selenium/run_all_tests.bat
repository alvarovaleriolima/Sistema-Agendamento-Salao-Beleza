@echo off
echo ========================================================
echo Executando Bateria Completa de Testes do Sistema (E2E)
echo ========================================================

.\.venv\Scripts\pytest.exe test_login.py test_funcionario.py test_cliente.py test_servico.py test_agendamento.py test_caixa.py test_relatorios.py -v --html=relatorio_final_apresentacao.html --self-contained-html

echo.
echo Testes finalizados! O relatorio completo foi salvo em "relatorio_final_apresentacao.html".
pause
