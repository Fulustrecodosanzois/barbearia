
// document.addEventListener('DOMContentLoaded', function () {
//     const cartItemsContainer = document.getElementById('cart-items');
//     const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
//     const offcanvasTotalElement = document.getElementById('offcanvasTotal');
//     const confirmationBalloon = document.getElementById('confirmation-balloon');

//     // Carregar itens do carrinho do armazenamento local, se existirem
//     loadCartItems();

//     addToCartButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             const card = this.closest('.card');
//             const title = card.querySelector('.card-title').textContent;
//             const price = card.querySelector('.card-text.fw-bold').textContent;
//             addItemToCart(title, price);
//             showConfirmationBalloon();
//         });
//     });

//     function showConfirmationBalloon() {
//         confirmationBalloon.classList.add('show');
//         setTimeout(() => {
//             confirmationBalloon.classList.remove('show');
//         }, 3000);
//     }

//     function addItemToCart(title, price) {
//         const existingCartItem = [...cartItemsContainer.children].find(item =>
//             item.querySelector('.cart-item-title').textContent === title
//         );

//         if (existingCartItem) {
//             const quantityElement = existingCartItem.querySelector('.cart-item-quantity');
//             const quantity = parseInt(quantityElement.textContent.split('x')[0]) + 1;
//             quantityElement.textContent = `${quantity}x`;
//         } else {
//             const cartItem = document.createElement('div');
//             cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
//             cartItem.innerHTML = `
//                 <div>
//                     <h6 class="mb-0 cart-item-title">${title}</h6>
//                     <p class="mb-0 cart-item-price">${price}</p>
//                 </div>
//                 <small class="cart-item-quantity fs-4 fw-bold">1x</small>
//                 <button class="btn btn-sm btn-danger remove-item-btn"><i class="fas fa-trash"></i></button>
//             `;
//             cartItemsContainer.appendChild(cartItem);

//             const removeButton = cartItem.querySelector('.remove-item-btn');
//             removeButton.addEventListener('click', function () {
//                 cartItem.remove();
//                 updateTotal();
//                 saveCartItems(); // Salvar os itens do carrinho após remover um item
//             });
//         }

//         updateTotal();
//         saveCartItems(); // Salvar os itens do carrinho após adicionar um item
//     }

//     function saveCartItems() {
//         const cartItems = [];
//         [...cartItemsContainer.children].forEach(item => {
//             const title = item.querySelector('.cart-item-title').textContent;
//             const price = item.querySelector('.cart-item-price').textContent;
//             const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent.split('x')[0]);
//             cartItems.push({ title, price, quantity });
//         });
//         localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     }

//     function loadCartItems() {
//         const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
//         if (savedCartItems) {
//             savedCartItems.forEach(item => {
//                 addItemToCart(item.title, item.price);
//                 const existingCartItem = [...cartItemsContainer.children].find(cartItem =>
//                     cartItem.querySelector('.cart-item-title').textContent === item.title
//                 );
//                 if (existingCartItem) {
//                     existingCartItem.querySelector('.cart-item-quantity').textContent = `${item.quantity}x`;
//                 }
//             });
//         }
//         updateTotal();
//     }

//     function updateTotal() {
//         let total = 0;
//         [...cartItemsContainer.children].forEach(item => {
//             const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('R$ ', ''));
//             const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent.split('x')[0]);
//             total += price * quantity;
//         });
//         offcanvasTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
//     }
// });







document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const offcanvasTotalElement = document.getElementById('offcanvasTotal');
    const confirmationBalloon = document.getElementById('confirmation-balloon');

    // Carregar itens do carrinho do armazenamento local, se existirem
    loadCartItems();

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const price = card.querySelector('.card-text.fw-bold').textContent;
            addItemToCart(title, price);
            showConfirmationBalloon();
        });
    });

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
});
