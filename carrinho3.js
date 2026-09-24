// --- VARIÁVEIS GLOBAIS ---
let carrinho = [];
let total = 0;
let pontosAcumulados = 0;
let usuarioLogado = false;

// --- FUNÇÃO 1: ADICIONAR PRODUTO ---
function adicionarAoCarrinho(nome, preco, imagem) {
    let itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        // Guarda a imagem também (se não passar imagem, usa cafe1.png como padrão)
        carrinho.push({ 
            nome: nome, 
            preco: preco, 
            imagem: imagem || 'cafe1.png', 
            quantidade: 1 
        });
    }

    total += preco;

    // Atualiza o contador vermelho
    let totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    let contador = document.getElementById("contador-carrinho");
    if (contador) contador.innerText = totalItens;

    atualizarVisualCarrinho();
}

// --- FUNÇÃO 2: ATUALIZAR O VISUAL DO CARRINHO (COM LIXEIRA 🗑️) ---
function atualizarVisualCarrinho() {
    let containerItens = document.getElementById("itens-do-carrinho");
    if (!containerItens) return;

    containerItens.innerHTML = ""; // Limpa a lista antes de desenhar

    carrinho.forEach((item, index) => {
        let divItem = document.createElement("div");
        divItem.className = "item-lista-carrinho";

        // Adicionada a LIXEIRA e as fotos pequenas no carrinho
        divItem.innerHTML = `
            <div class="produto-info-carrinho" style="display: flex; align-items: center; gap: 8px;">
                <img src="${item.imagem}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;" alt="${item.nome}">
                <div>
                    <strong style="font-size: 14px; display: block;">${item.nome}</strong>
                    <small style="color: #666;">(x${item.quantidade})</small>
                </div>
            </div>

            <div class="controles-quantidade" style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="btn-menos" onclick="alterarQuantidade(${index}, -1)">-</button>
                <button type="button" class="btn-mais" onclick="alterarQuantidade(${index}, 1)">+</button>
                
                <!-- BOTÃO DA LIXEIRA (Apaga todas as unidades do produto de uma vez) -->
                <button type="button" class="btn-remover" title="Remover item" onclick="removerItemCompleto(${index})" style="background: none; border: none; cursor: pointer; font-size: 16px; margin-left: 4px;">🗑️</button>
                
                <strong class="preco-subtotal" style="margin-left: 6px;">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </strong>
            </div>
        `;
        containerItens.appendChild(divItem);
    });

    // Atualiza o valor total formatado
    let elementoTotal = document.getElementById("valor-total");
    if (elementoTotal) elementoTotal.innerText = "R$ " + total.toFixed(2).replace('.', ',');
}

// --- FUNÇÃO AUXILIAR: MUDAR QUANTIDADE (+ e -) ---
function alterarQuantidade(index, operacao) {
    let item = carrinho[index];
    if (!item) return;
    
    if (operacao === 1) {
        item.quantidade += 1;
        total += item.preco;
    } else {
        item.quantidade -= 1;
        total -= item.preco;
        
        if (item.quantidade <= 0) {
            carrinho.splice(index, 1);
        }
    }

    if (total < 0) total = 0;

    let totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    let contador = document.getElementById("contador-carrinho");
    if (contador) contador.innerText = totalItens;

    atualizarVisualCarrinho();
}

// --- FUNÇÃO DA LIXEIRA: REMOVE O ITEM INTEIRO DO CARRINHO ---
function removerItemCompleto(index) {
    let item = carrinho[index];
    if (item) {
        total -= (item.preco * item.quantidade);
        carrinho.splice(index, 1);
    }

    if (total < 0) total = 0;

    let totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    let contador = document.getElementById("contador-carrinho");
    if (contador) contador.innerText = totalItens;

    atualizarVisualCarrinho();
}

// --- FUNÇÃO 3: ABRIR / FECHAR ABA LATERAL ---
function abrirFecharCarrinho() {
    let carrinhoLateral = document.getElementById("carrinho-lateral");
    if (carrinhoLateral) {
        carrinhoLateral.classList.toggle("aberto");
    }
}

// --- FUNÇÃO 4: CADASTRO / LOGIN SIMULADO ---
function simularLogin() {
    console.log("O botão de cadastrar foi acionado com sucesso!");
    let nome = prompt("Digite seu nome para acessar o clube fidelidade:");
    
    if (nome && nome.trim() !== "") {
        usuarioLogado = true;
        
        let campoNome = document.getElementById("nome-user");
        if (campoNome) campoNome.innerText = nome;
        
        let botao = document.getElementById("btn-cadastro");
        if (botao) botao.style.display = "none";
        
        alert("Que bom ter você aqui, " + nome + "! Sua barra de fidelidade está pronta! 🍫✨");
    }
}

// --- FUNÇÃO 5: FINALIZAR PEDIDO E ACOPLAR IMAGEM DA BARRA DE CHOCOLATE ---
function finalizarPedidoComPontos() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione alguma delícia antes de finalizar. ☕");
        return;
    }

    if (!usuarioLogado) {
        alert("Pedido enviado para a cozinha! 🎉 (Faça login clicando em 'Entrar / Cadastrar' para acumular pontos de fidelidade na próxima!)");
    } else {
        // Ganha 125 pontos por pedido (8 compras fecham 1000 pontos)
        pontosAcumulados += 125; 
        if (pontosAcumulados > 1000) pontosAcumulados = 1000;

        let elPontos = document.getElementById("qtd-pontos");
        if (elPontos) elPontos.innerText = pontosAcumulados;

        // Calcula qual gomo (de 1 a 8) deve ser exibido
        let gomoAtual = Math.floor(pontosAcumulados / 125);
        if (gomoAtual < 1) gomoAtual = 1;
        if (gomoAtual > 8) gomoAtual = 8;

        // Atualiza a imagem real da barra de chocolate no HTML
        let imgBarra = document.getElementById("barra-fidelidade-img");
        if (imgBarra) {
            imgBarra.src = `gomo${gomoAtual}.png`;
        }

        if (pontosAcumulados >= 1000) {
            alert("🎉 SENSACIONAL! Sua barra de chocolate está 100% cheia! Você ganhou R$ 20,00 de desconto!");
            
            pontosAcumulados = 0;
            if (elPontos) elPontos.innerText = "0";
            if (imgBarra) imgBarra.src = "gomo1.png";
        } else {
            alert("Pedido enviado com sucesso! Um novo quadradinho da sua barra de chocolate acabou de acender! 🍫🔥");
        }
    }

    // Reseta o carrinho após finalizar
    carrinho = [];
    total = 0;
    
    let contador = document.getElementById("contador-carrinho");
    if (contador) contador.innerText = "0";
    
    atualizarVisualCarrinho();
    abrirFecharCarrinho();
}

// --- FUNÇÃO 6: FILTRO DE CATEGORIAS ---
function filtrarCategoria(categoria) {
    let produtos = document.getElementsByClassName("item-cardapio");
    
    for (let i = 0; i < produtos.length; i++) {
        if (categoria === "todos" || produtos[i].classList.contains(categoria)) {
            produtos[i].style.display = ""; // Usa o display padrão do CSS
        } else {
            produtos[i].style.display = "none";
        }
    }

    // Deixa o botão clicado com destaque visual (.active)
    let botoes = document.getElementsByClassName("btn-categoria");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove("active");
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }
}

// --- FUNÇÃO 7: FILTRAR CARDÁPIO PELA BARRA DE PESQUISA ---
function filtrarProdutos() {
    let termo = document.getElementById("campo-pesquisa").value.toLowerCase();
    let cards = document.querySelectorAll(".item-cardapio");

    cards.forEach(card => {
        let tituloElemento = card.querySelector("h3");
        if (tituloElemento) {
            let nomeProduto = tituloElemento.innerText.toLowerCase();
            if (nomeProduto.includes(termo)) {
                card.style.display = ""; 
            } else {
                card.style.display = "none"; 
            }
        }
    });
}