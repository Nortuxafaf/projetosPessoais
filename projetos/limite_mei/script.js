const limiteMensal = 6750;
const historicoEl = document.getElementById('historico');
const progressoEl = document.getElementById('progressBar');
const valorAtualEl = document.getElementById('valorAtual');
const restanteEl = document.getElementById('restante');
const inputValor = document.getElementById('valor');

let ganhos = JSON.parse(localStorage.getItem('mei-ganhos')) || [];

function atualizarUI() {
  historicoEl.innerHTML = '';
  let totalDeclarado = 0;

  ganhos.forEach((g, index) => {
    if (g.metodo !== 'dinheiro') totalDeclarado += g.valor;

    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <div>
        ${g.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} - ${g.metodo}
        <small>${g.data}</small>
      </div>
    `;
    div.onclick = () => {
      if (confirm("Deseja remover este ganho?")) {
        removerGanho(index);
      }
    };
    historicoEl.appendChild(div);
  });

  valorAtualEl.textContent = totalDeclarado.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  restanteEl.textContent = (limiteMensal - totalDeclarado).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  const porcentagem = Math.min((totalDeclarado / limiteMensal) * 100, 100);
  progressoEl.style.width = `${porcentagem}%`;
  progressoEl.style.background = porcentagem > 75 ? 'red' : porcentagem > 50 ? 'orange' : 'green';
}

function adicionarGanho() {
  const valorStr = inputValor.value.replace(/[^\d]/g, '');
  const valor = parseFloat(valorStr) / 100;
  const metodo = document.getElementById('metodo').value;

  if (!valor || valor <= 0) return;

  const data = new Date().toLocaleString();
  ganhos.push({ valor, metodo, data });
  localStorage.setItem('mei-ganhos', JSON.stringify(ganhos));
  inputValor.value = '';
  atualizarUI();
}

function removerGanho(index) {
  ganhos.splice(index, 1);
  localStorage.setItem('mei-ganhos', JSON.stringify(ganhos));
  atualizarUI();
}

inputValor.addEventListener('input', () => {
  let v = inputValor.value.replace(/\D/g, '');
  if (!v) v = '0';
  let valorFloat = parseFloat(v) / 100;

  inputValor.value = valorFloat.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
});



function atualizarUI() {
  const somenteHoje = document.getElementById('filtroData').checked;
  let totalPix = 0;
  let totalApp = 0;
  let totalDinheiro = 0;
  let totalDeclarado = 0;

  const hoje = new Date().toLocaleDateString("pt-BR");

  const ganhosFiltrados = ganhos.filter(g => {
    if (!somenteHoje) return true;
    return g.data.startsWith(hoje);
  });

  ganhosFiltrados.forEach((g) => {
    if (g.metodo === 'pix') totalPix += g.valor;
    if (g.metodo === 'app') totalApp += g.valor;
    if (g.metodo === 'dinheiro') totalDinheiro += g.valor;
    if (g.metodo !== 'dinheiro') totalDeclarado += g.valor;
  });

  valorAtualEl.textContent = totalDeclarado.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  restanteEl.textContent = (limiteMensal - totalDeclarado).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  const porcentagem = Math.min((totalDeclarado / limiteMensal) * 100, 100);
  progressoEl.style.width = `${porcentagem}%`;
  progressoEl.style.background = porcentagem > 75 ? 'red' : porcentagem > 50 ? 'orange' : 'green';

  historicoEl.innerHTML = `
    <div class="entry">Pix: <strong>${totalPix.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
    <div class="entry">App: <strong>${totalApp.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
    <div class="entry">Dinheiro: <strong>${totalDinheiro.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
  `;
}



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado!'));
}
const filtroCheckbox = document.getElementById('filtroData');
const switchLabel = document.getElementById('switchLabel');

filtroCheckbox.addEventListener('change', () => {
  switchLabel.textContent = filtroCheckbox.checked
    ? 'Mostrar ganhos do dia'
    : 'Mostrar ganhos do mês';
  atualizarUI();
});

document.getElementById('limparDados').addEventListener('click', () => {
  if (confirm("Tem certeza que deseja apagar todos os dados? Isso não pode ser desfeito!")) {
    localStorage.removeItem('mei-ganhos');
    ganhos = [];
    atualizarUI();
  }
});


