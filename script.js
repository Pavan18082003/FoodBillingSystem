// Menu data
const menuItems = [
    {
        id: 1,
        name: "Classic Burger",
        description: "Juicy beef patty with fresh vegetables",
        price: 8.99,
        image: "burger.jpg"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato and mozzarella",
        price: 12.99,
        image: "pizza.jpg"
    },
    {
        id: 3,
        name: "Creamy Pasta",
        description: "Pasta in a rich creamy sauce",
        price: 10.99,
        image: "pasta.jpg"
    },
    {
        id: 4,
        name: "Fresh Salad",
        description: "Mixed greens with dressing",
        price: 7.99,
        image: "salad.jpg"
    },
    {
        id: 5,
        name: "Crispy Fries",
        description: "Golden crispy potato fries",
        price: 4.99,
        image: "fries.jpg"
    },
    {
        id: 6,
        name: "Refreshing Drink",
        description: "Choice of soda or juice",
        price: 2.99,
        image: "drink.jpg"
    }
];

// Current order
let order = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateOrderDisplay();
    
    // Add event listener for checkout button
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
});

// Render menu items
function renderMenu() {
    const menuContainer = document.getElementById('menuItems');
    
    menuItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.classList.add('menu-item');
        
        menuItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-price">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" data-id="${item.id}">Add to Order</button>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(menuItemElement);
    });
    
    // Add event listeners to all add buttons
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            addToOrder(itemId);
        });
    });
}

// Add item to order
function addToOrder(itemId) {
    const menuItem = menuItems.find(item => item.id === itemId);
    
    if (!menuItem) return;
    
    // Check if item already exists in order
    const existingOrderItem = order.find(item => item.id === itemId);
    
    if (existingOrderItem) {
        existingOrderItem.quantity += 1;
    } else {
        order.push({
            ...menuItem,
            quantity: 1
        });
    }
    
    updateOrderDisplay();
}

// Remove item from order
function removeFromOrder(itemId) {
    order = order.filter(item => item.id !== itemId);
    updateOrderDisplay();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const orderItem = order.find(item => item.id === itemId);
    
    if (orderItem) {
        orderItem.quantity += change;
        
        if (orderItem.quantity <= 0) {
            removeFromOrder(itemId);
        } else {
            updateOrderDisplay();
        }
    }
}

// Update order display
function updateOrderDisplay() {
    const orderContainer = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Clear order container
    orderContainer.innerHTML = '';
    
    if (order.length === 0) {
        orderContainer.innerHTML = '<div class="empty-order">Your order is empty</div>';
        subtotalElement.textContent = '$0.00';
        taxElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    
    order.forEach(item => {
        subtotal += item.price * item.quantity;
        
        const orderItemElement = document.createElement('div');
        orderItemElement.classList.add('order-item');
        
        orderItemElement.innerHTML = `
            <div class="order-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <div>${item.name}</div>
                    <div>$${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
            </div>
            <div class="order-item-controls">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        orderContainer.appendChild(orderItemElement);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(itemId, 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            removeFromOrder(itemId);
        });
    });
    
    // Calculate and display totals
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Checkout function
function checkout() {
    if (order.length === 0) {
        alert('Your order is empty. Please add some items before checkout.');
        return;
    }
    
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    
    alert(`Thank you for your order! Your total is $${total.toFixed(2)}. This is a demo application.`);
    
    // Reset order
    order = [];
    updateOrderDisplay();
}