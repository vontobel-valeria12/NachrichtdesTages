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