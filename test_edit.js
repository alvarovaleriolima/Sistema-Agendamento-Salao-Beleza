const baseUrl = 'http://localhost:8080/api';

async function run() {
  try {
    // Pegar o primeiro agendamento
    const agendRes = await fetch(`${baseUrl}/agendamentos`);
    const agends = await agendRes.json();
    if (agends.length === 0) {
      console.log("No agendamentos to edit");
      return;
    }
    const a = agends[0];
    
    // Editar para CONCLUIDO
    const reqBody = {
      status: "CONCLUIDO"
    };
    
    console.log(`Editing agendamento ${a.id}...`);
    const editRes = await fetch(`${baseUrl}/agendamentos/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });
    
    if (!editRes.ok) {
      const text = await editRes.text();
      console.error(`Status ${editRes.status}:`, text);
    } else {
      const data = await editRes.json();
      console.log("Success:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
