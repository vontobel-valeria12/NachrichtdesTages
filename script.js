let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let produtoAtual = null;

// Atualizar carrinho
function atualizarCarrinho() {
    document.getElementById('contador-itens').textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const lista = document.getElementById('lista-carrinho');
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        const li = document.createElement('li');
        li.textContent = `\( {item.nome} ( \){item.personalizacao ? 'Personalizado' : 'Padrão'}) x \( {item.quantidade} - R \) ${(item.preco * item.quantidade).toFixed(2)}`;
        lista.appendChild(li);
    });
    document.getElementById('total-carrinho').textContent = total.toFixed(2);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Abrir modal personalização
document.querySelectorAll('.btn-personalizar').forEach(btn => {
    btn.addEventListener('click', () => {
        produtoAtual = btn.parentElement;
        document.getElementById('nome-produto-modal').textContent = produtoAtual.querySelector('h3').textContent;
        document.getElementById('modal-personalizar').classList.remove('escondido');
        document.getElementById('texto-custom').value = '';
        document.getElementById('previa-foto').classList.add('escondido');
    });
});

// Upload foto prévia
document.getElementById('upload-foto').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.getElementById('previa-foto');
            img.src = reader.result;
            img.classList.remove('escondido');
        };
        reader.readAsDataURL(file);
    }
});

// Aplicar e adicionar
document.getElementById('btn-aplicar-personalizacao').addEventListener('click', () => {
    const texto = document.getElementById('texto-custom').value;
    const foto = document.getElementById('previa-foto').src;
    const personalizacao = { texto, foto: foto || null };

    const id = parseInt(produtoAtual.dataset.id);
    const nome = produtoAtual.dataset.nome + (texto ? ` - ${texto}` : '');
    const preco = parseFloat(produtoAtual.dataset.preco);

    const existente = carrinho.find(item => item.id === id && JSON.stringify(item.personalizacao) === JSON.stringify(personalizacao));
    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1, personalizacao });
    }

    fecharModal();
    atualizarCarrinho();
});

// Fechar modal
document.querySelector('.fechar').addEventListener('click', fecharModal);
function fecharModal() {
    document.getElementById('modal-personalizar').classList.add('escondido');
}

// Dropdown carrinho
document.querySelector('.carrinho-icon').addEventListener('click', () => {
    document.getElementById('carrinho-dropdown').classList.toggle('escondido');
});

// Limpar e pagamento (igual ao anterior)
document.getElementById('btn-limpar').addEventListener('click', () => { carrinho = []; atualizarCarrinho(); });
// Pagamento PayPal similar ao código anterior

atualizarCarrinho();
let canvas = document.getElementById('canvas-previa');
let ctx = canvas.getContext('2d');
let mockupImg = new Image();
mockupImg.src = 'imagens/mockup-caneca.png'; // Troque conforme o produto

let produtoAtual = null;
let configuracaoAtual = {
    texto: '',
    cor: '#000000',
    tamanho: 40
};

// Função para desenhar a prévia
function desenharPrevia() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o mockup
    ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

    // Configura texto
    if (configuracaoAtual.texto.trim() === '') return;

    ctx.font = `${configuracaoAtual.tamanho}px Playfair Display`;
    ctx.fillStyle = configuracaoAtual.cor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Posição do texto (ajuste conforme seu mockup)
    // Exemplo: centro da área de impressão (geralmente entre y=150 e y=350)
    ctx.fillText(configuracaoAtual.texto, canvas.width / 2, canvas.height / 2 + 20);

    // Opcional: sombra para destacar
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(configuracaoAtual.texto, canvas.width / 2, canvas.height / 2 + 20);
    ctx.shadowBlur = 0; // reseta sombra
}

// Carrega o mockup e desenha vazio inicialmente
mockupImg.onload = () => {
    desenharPrevia();
};

// Atualiza em tempo real
document.getElementById('texto-custom').addEventListener('input', (e) => {
    configuracaoAtual.texto = e.target.value.toUpperCase(); // ou .trim()
    desenharPrevia();
});

document.getElementById('cor-texto').addEventListener('change', (e) => {
    configuracaoAtual.cor = e.target.value;
    desenharPrevia();
});

document.getElementById('tamanho-fonte').addEventListener('input', (e) => {
    configuracaoAtual.tamanho = parseInt(e.target.value);
    desenharPrevia();
});

// Ao abrir o modal (ajuste conforme o produto)
document.querySelectorAll('.btn-personalizar').forEach(btn => {
    btn.addEventListener('click', () => {
        produtoAtual = btn.parentElement;

        // Mude o mockup conforme o produto (exemplo simples)
        const id = produtoAtual.dataset.id;
        if (id === '1') {
            mockupImg.src = 'imagens/mockup-caneca.png';
        } else if (id === '2') {
            mockupImg.src = 'imagens/mockup-poster.png'; // para pôster
        }

        document.getElementById('nome-produto-modal').textContent = produtoAtual.querySelector('h3').textContent;
        document.getElementById('texto-custom').value = '';
        configuracaoAtual = { texto: '', cor: '#000000', tamanho: 40 };
        mockupImg.onload = () => desenharPrevia(); // redraw ao trocar imagem

        document.getElementById('modal-personalizar').classList.remove('escondido');
    });
});

// Botão aplicar (mesmo código anterior, mas salva a config)
document.getElementById('btn-aplicar-personalizacao').addEventListener('click', () => {
    if (configuracaoAtual.texto.trim() === '' && configuracaoAtual.foto === undefined) {
        alert('Adicione pelo menos um texto!');
        return;
    }

    const id = parseInt(produtoAtual.dataset.id);
    const nomeBase = produtoAtual.dataset.nome;
    const nome = nomeBase + (configuracaoAtual.texto ? ` - "${configuracaoAtual.texto}"` : '');
    const preco = parseFloat(produtoAtual.dataset.preco);

    const personalizacao = {
        texto: configuracaoAtual.texto,
        cor: configuracaoAtual.cor,
        tamanho: configuracaoAtual.tamanho
        // foto: futura
    };

    const chaveUnica = JSON.stringify(personalizacao); // para identificar itens iguais
    const existente = carrinho.find(item => item.id === id && item.chave === chaveUnica);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1, personalizacao, chave: chaveUnica });
    }

    fecharModal();
    atualizarCarrinho();
});