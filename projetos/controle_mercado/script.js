// ---- POPUP ----
function abrirPopup() {
    document.getElementById("popup").style.display = "flex";
}




function fecharPopup() {
    document.getElementById("popup").style.display = "none";
}

// ---- SALVAR ITEM ----
function salvarProduto() {
    const quantidade = document.getElementById("inputQuantidade").value;
    const produto = document.getElementById("inputProduto").value;
    const valor = document.getElementById("inputValor").value;

    if (!quantidade || !produto || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    const lista = document.getElementById("listaProdutos");

    const li = document.createElement("li");

    const totalItem = quantidade * parseFloat(valor);

    li.setAttribute("data-valor", totalItem);

    const texto = document.createElement("span");
    texto.textContent = `${quantidade}x ${produto} — R$ ${valor}`;

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

    fecharPopup();

    // Limpar campos
    document.getElementById("inputQuantidade").value = "";
    document.getElementById("inputProduto").value = "";
    document.getElementById("inputValor").value = "";

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
        "Total: R$ " + total.toFixed(2);

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
