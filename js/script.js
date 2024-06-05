import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const offcanvasTotalElement = document.getElementById('offcanvasTotal');
    const confirmationBalloon = document.getElementById('confirmation-balloon');

    // Carregar itens do carrinho do armazenamento local, se existirem
    loadCartItems();

    // Carregar produtos e serviços do Firebase ao carregar a página
    loadProducts('produtos');
    loadProducts('servicos');

    function addItemToCart(title, price) {
        const existingCartItem = [...cartItemsContainer.children].find(item =>
            item.querySelector('.cart-item-title').textContent === title
        );

        if (existingCartItem) {
            const quantityElement = existingCartItem.querySelector('.cart-item-quantity');
            const quantity = parseInt(quantityElement.textContent.split('x')[0]) + 1;
            quantityElement.textContent = `${quantity}x`;
        } else {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
            cartItem.innerHTML = `
                <div>
                    <h6 class="mb-0 cart-item-title">${title}</h6>
                    <p class="mb-0 cart-item-price">${price}</p>
                </div>
                <small class="cart-item-quantity fs-4 fw-bold">1x</small>
                <button class="btn btn-sm btn-danger remove-item-btn"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);

            const removeButton = cartItem.querySelector('.remove-item-btn');
            removeButton.addEventListener('click', function () {
                const quantityElement = cartItem.querySelector('.cart-item-quantity');
                const quantity = parseInt(quantityElement.textContent.split('x')[0]);
                if (quantity > 1) {
                    quantityElement.textContent = `${quantity - 1}x`;
                } else {
                    cartItem.remove();
                }
                updateTotal();
                saveCartItems();
            });
        }

        updateTotal();
        saveCartItems();
    }


    function showConfirmationBalloon() {
        confirmationBalloon.classList.add('show');
        setTimeout(() => {
            confirmationBalloon.classList.remove('show');
        }, 3000);
    }

    function saveCartItems() {
        const cartItems = [];
        [...cartItemsContainer.children].forEach(item => {
            const title = item.querySelector('.cart-item-title').textContent;
            const price = item.querySelector('.cart-item-price').textContent;
            const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent.split('x')[0]);
            cartItems.push({ title, price, quantity });
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function loadCartItems() {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (savedCartItems) {
            savedCartItems.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    addItemToCart(item.title, item.price);
                }
            });
        }
        updateTotal();
    }

    function updateTotal() {
        let total = 0;
        [...cartItemsContainer.children].forEach(item => {
            const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('R$ ', ''));
            const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent.split('x')[0]);
            total += price * quantity;
        });
        offcanvasTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    // Função para carregar os produtos ou serviços do Firebase
    function loadProducts(collection) {
        const productsRef = ref(db, collection);
        get(productsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const items = Object.values(snapshot.val()); // Corrige a estrutura dos dados
                renderProducts(items, collection);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error('Erro ao obter dados:', error);
        });
    }

    // Função para renderizar os produtos ou serviços na página
    function renderProducts(items, category) {
        const sectionId = category === 'produtos' ? '#produtos-section' : '#servicos-section';
        const section = document.querySelector(sectionId);
        section.innerHTML = ''; // Limpar o conteúdo existente antes de renderizar os novos itens
        items.forEach(item => {
            const productCard = `
                <section class="d-flex justify-content-center align-items-center">
                    <div class="card" style="max-width: 95%;">
                        <div class="row g-0">
                            <div class="col-4">
                                <img src="${item.imagem}" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-8">
                                <div class="card-body d-flex align-items-end flex-column">
                                    <h5 class="card-title">${item.titulo}</h5>
                                    <p class="card-text">${item.descricao}</p>
                                    <p class="card-text fw-bold">R$ ${item.preco.toFixed(2)}</p>
                                    <div class="">
                                        <button class="btn btn-primary fw-bold p-3 rounded-pill add-to-cart-btn">
                                            Adicionar <i class="fas fa-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            section.innerHTML += productCard; // Adicionar o card do produto ao conteúdo da seção
        });

        // Adicionar event listeners aos novos botões "Adicionar"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.removeEventListener('click', addToCartHandler);
        });

        // Adicionar event listeners aos novos botões "Adicionar"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCartHandler);
        });
    }

    // Handler para adicionar itens ao carrinho
    function addToCartHandler() {
        const card = this.closest('.card');
        const title = card.querySelector('.card-title').textContent;
        const price = card.querySelector('.card-text.fw-bold').textContent;
        addItemToCart(title, price);
        showConfirmationBalloon();
    }

    // Adicionar event listeners aos botões "Adicionar" iniciais
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
});
