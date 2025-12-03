// ---- POPUP ----
function abrirPopup() {
    document.getElementById("popup").style.display = "flex";
}

function fecharPopup() {
    document.getElementById("popup").style.display = "none";
    // Limpar campos
    document.getElementById("inputQuantidade").value = "";
    document.getElementById("inputProduto").value = "";
    document.getElementById("inputValor").value = "";
}

// ---- FORMATAR VALOR AUTOMATICAMENTE ----
function formatarValorInput(event) {
    let input = event.target;
    // Pega apenas os dígitos e remove qualquer coisa que não seja número
    let valor = input.value.replace(/\D/g, "");

    if (valor.length > 0) {
        // Divide o valor em centavos e reais (sempre considera os últimos 2 dígitos como centavos)
        let reais = valor.slice(0, -2);
        let centavos = valor.slice(-2);

        // Se só tiver centavos (ex: 5 -> 0,05)
        if (reais.length === 0) {
            reais = "0";
        }
        
        // Constrói a string final no formato 'Reais,Centavos'
        input.value = `${reais},${centavos}`;
    }
}


// ---- SALVAR ITEM ----
function salvarProduto() {
    const quantidade = document.getElementById("inputQuantidade").value;
    const produto = document.getElementById("inputProduto").value;
    
    // Obtém o valor formatado com vírgula do input
    let valorInput = document.getElementById("inputValor").value; 
    
    // TRATAMENTO CRUCIAL: Substitui vírgula por ponto para o cálculo matemático em JS
    // Remove pontos se houverem (evitando 1.000,50), e substitui a vírgula por ponto.
    const valorNumerico = valorInput.replace(/\./g, '').replace(',', '.');


    if (!quantidade || !produto || !valorNumerico || isNaN(parseFloat(valorNumerico))) {
        alert("Preencha todos os campos e certifique-se que o valor é válido!");
        return;
    }

    const lista = document.getElementById("listaProdutos");

    const li = document.createElement("li");

    // Cálculo usando o valor convertido (com ponto)
    const totalItem = parseFloat(quantidade) * parseFloat(valorNumerico);

    li.setAttribute("data-valor", totalItem);

    const texto = document.createElement("span");
    // Exibe o valor do input (com vírgula)
    texto.textContent = `${quantidade}x ${produto} — R$ ${valorInput}`;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "X";
    btnRemover.className = "btn-remover";
    btnRemover.onclick = () => {
        li.remove();
        salvarListaLocalStorage();
        atualizarTotal();
    };

    li.appendChild(texto);
    li.appendChild(btnRemover);

    lista.appendChild(li);

    fecharPopup(); // fecharPopup agora também limpa os campos

    salvarListaLocalStorage();
    atualizarTotal();
}

// ---- ATUALIZAR TOTAL ----
function atualizarTotal() {
    const itens = document.querySelectorAll("#listaProdutos li");
    let total = 0;

    itens.forEach(item => {
        const valor = item.getAttribute("data-valor");
        if (valor) total += parseFloat(valor);
    });

    document.getElementById("totalCompras").textContent =
        "Total: R$ " + total.toFixed(2).replace('.', ','); // Exibe o total com vírgula

    localStorage.setItem("totalCompras", total);
}

// ---- SALVAR LISTA NO LOCAL STORAGE ----
function salvarListaLocalStorage() {
    const itens = [];

    document.querySelectorAll("#listaProdutos li").forEach(li => {
        itens.push({
            texto: li.querySelector("span").textContent,
            valor: li.getAttribute("data-valor")
        });
    });

    localStorage.setItem("listaCompras", JSON.stringify(itens));
}

// ---- CARREGAR LISTA AO INICIAR ----
function carregarLista() {
    const dados = localStorage.getItem("listaCompras");

    if (!dados) return;

    const itens = JSON.parse(dados);

    itens.forEach(item => {
        const li = document.createElement("li");
        li.setAttribute("data-valor", item.valor);

        const texto = document.createElement("span");
        texto.textContent = item.texto;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "X";
        btnRemover.className = "btn-remover";
        btnRemover.onclick = () => {
            li.remove();
            salvarListaLocalStorage();
            atualizarTotal();
        };

        li.appendChild(texto);
        li.appendChild(btnRemover);

        document.getElementById("listaProdutos").appendChild(li);
    });

    atualizarTotal();
}

// ---- INICIAR AO CARREGAR A PÁGINA ----
window.onload = () => {
    carregarLista();
    atualizarTotal();
    
    // Adiciona o listener de formatação ao campo de valor (MODIFICAÇÃO SOLICITADA)
    const inputValor = document.getElementById("inputValor");
    if (inputValor) {
        // 'input' é disparado a cada tecla digitada
        inputValor.addEventListener("input", formatarValorInput);
        
        // Move o cursor para o final após a formatação (melhora a UX)
        inputValor.addEventListener("click", (e) => {
            e.target.setSelectionRange(e.target.value.length, e.target.value.length);
        });
    }
};

function compartilharLista() {
    const area = document.querySelector("main");

    html2canvas(area, {
        backgroundColor: "#ffffff",
        scale: 2
    }).then(canvas => {
        canvas.toBlob(blob => {

            // Se o navegador tem a Web Share API (Android)
            if (navigator.share) {
                const file = new File([blob], "lista-de-compras.png", { type: "image/png" });
                navigator.share({
                    files: [file],
                    title: "Minha lista de compras",
                    text: "Segue minha lista de compras:"
                }).catch(err => console.log("Erro ao compartilhar:", err));
            } else {
                // fallback: baixar a imagem
                const link = document.createElement("a");
                link.download = "lista-de-compras.png";
                link.href = canvas.toDataURL();
                link.click();
            }

        });
    });
}
