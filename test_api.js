const baseUrl = 'http://localhost:8080/api';

async function run() {
  try {
    const relRes = await fetch(`${baseUrl}/relatorios/desempenho?dataInicio=01/01/2000%2000:00&dataFim=31/12/2099%2023:59`);
    const rel = await relRes.json();
    console.log("Relatorio Desempenho:", JSON.stringify(rel, null, 2));

    const fatRes = await fetch(`${baseUrl}/relatorios/faturamento?dataInicio=01/01/2000%2000:00&dataFim=31/12/2099%2023:59`);
    const fat = await fatRes.json();
    console.log("Relatorio Faturamento:", JSON.stringify(fat, null, 2));

    const agendRes = await fetch(`${baseUrl}/agendamentos`);
    const agend = await agendRes.json();
    console.log("Agendamentos:", JSON.stringify(agend, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
