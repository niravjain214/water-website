// =====================
// Existing Shopping Cart Code
// =====================

let cart = [];
let cartCount = 0;
let totalAmount = 0;

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.total-amount');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const checkoutButton = document.querySelector('.checkout-button');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Color Selection
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        const color = this.getAttribute('data-color');
        updateProductImage(color);
    });
});

function updateProductImage(color) {
    const mainImage = document.getElementById('main-product-image');
    mainImage.style.filter = `hue-rotate(${getHueRotation(color)}deg)`;
}

function getHueRotation(color) {
    const rotations = {
        'black': 0,
        'blue': 200,
        'green': 100,
        'pink': 300,
        'white': 0
    };
    return rotations[color] || 0;
}

// Testimonial Carousel
const testimonials = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonials[index].classList.add('active');
    currentTestimonial = index;
}

prevButton.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
});

nextButton.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
});

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Cart Functions
function updateCart() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    document.querySelector('.cart-count').textContent = cartCount;
    cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
    
    renderCartItems();
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <span class="item-price">$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeFromCart(itemId);
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now().toString(),
            name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    updateCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
});

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        const price = this.getAttribute('data-price');
        addToCart(product, price);
        
        // Show feedback
        this.textContent = 'Added!';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
        }, 2000);
    });
});

checkoutButton.addEventListener('click', () => {
    alert(`Proceeding to checkout with total: $${totalAmount.toFixed(2)}`);
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// =====================
// Chatbot Implementation
// =====================

const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWidget = document.querySelector('.chatbot-widget');
const closeChatbot = document.querySelector('.close-chatbot');
const chatMessages = document.querySelector('.chatbot-messages');
const chatInput = document.querySelector('.chatbot-query');
const sendButton = document.querySelector('.send-message');

// Product knowledge base
const productInfo = {
    "SmartHydrate 500ml": {
        description: "Our 500ml SmartHydrate bottle is perfect for everyday use with all the smart features in a compact size.",
        price: "$49.99",
        features: ["500ml capacity", "AI hydration tracking", "Smart reminders", "App integration", "5 color options"],
        colors: ["Onyx Black", "Ocean Blue", "Emerald Green", "Rose Pink", "Pearl White"]
    },
    "SmartHydrate 750ml": {
        description: "The 750ml size is our most popular option, ideal for active lifestyles with all smart features included.",
        price: "$59.99",
        features: ["750ml capacity", "AI hydration tracking", "Smart reminders", "App integration", "8 color options", "Includes carrying strap"],
        colors: ["Onyx Black", "Ocean Blue", "Emerald Green", "Rose Pink", "Pearl White", "Sunset Orange", "Lavender Purple", "Graphite Gray"]
    },
    "SmartHydrate 1L": {
        description: "For serious hydration needs, our 1L bottle keeps you going longer with all smart features.",
        price: "$69.99",
        features: ["1L capacity", "AI hydration tracking", "Smart reminders", "App integration", "6 color options", "Includes carrying strap and extra lid"],
        colors: ["Onyx Black", "Ocean Blue", "Emerald Green", "Pearl White", "Graphite Gray", "Ruby Red"]
    },
    "features": {
        "AI Hydration Tracking": "Our advanced algorithm learns your drinking habits and adjusts reminders based on your activity level and environment.",
        "Smart Reminders": "Gentle LED notifications remind you when it's time to drink without being intrusive.",
        "App Integration": "Sync with our mobile app to track your hydration history and set personal goals.",
        "Temperature Control": "Double-walled insulation keeps drinks cold for 24 hours or hot for 12 hours.",
        "Battery Life": "30-day battery life with USB-C fast charging.",
        "Eco-Friendly": "Made from 100% recyclable stainless steel with no harmful plastics."
    },
    "shipping": {
        standard: "3-5 business days ($4.99)",
        express: "2 business days ($9.99)",
        overnight: "Next business day ($14.99)"
    },
    "returns": "We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, you can return it for a full refund."
};

// Common questions and responses
const commonQuestions = {
    "hello": "Hello! How can I help you with SmartHydrate today?",
    "hi": "Hi there! What would you like to know about our products?",
    "help": "I can help you with product information, features, pricing, shipping, and returns. What would you like to know?",
    "price": "Our prices range from $49.99 to $69.99 depending on size. The 500ml is $49.99, 750ml is $59.99, and 1L is $69.99.",
    "colors": "We offer different colors for each size. 500ml has 5 colors, 750ml has 8 colors, and 1L has 6 colors. Which size are you interested in?",
    "ship": "We offer standard (3-5 days), express (2 days), and overnight shipping. Where would you like it shipped?",
    "return": "We have a 30-day satisfaction guarantee. You can return any unused product for a full refund.",
    "track": "The SmartHydrate tracks your water intake using precision sensors and syncs with our app to show your hydration history.",
    "battery": "The battery lasts up to 30 days on a single charge and uses USB-C fast charging.",
    "warranty": "All SmartHydrate bottles come with a 1-year limited warranty against defects."
};

// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => {
    chatbotWidget.classList.toggle('active');
});

closeChatbot.addEventListener('click', () => {
    chatbotWidget.classList.remove('active');
});

// Send message function
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        setTimeout(() => {
            handleUserMessage(message);
        }, 500);
    }
}

// Handle input via button click or enter key
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chatbot-message', sender);
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add quick reply buttons
function addQuickReplies(replies) {
    const quickRepliesDiv = document.createElement('div');
    quickRepliesDiv.classList.add('quick-replies');
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.classList.add('quick-reply');
        button.textContent = reply;
        button.addEventListener('click', () => {
            addMessage(reply, 'user');
            quickRepliesDiv.remove();
            setTimeout(() => {
                handleUserMessage(reply);
            }, 500);
        });
        quickRepliesDiv.appendChild(button);
    });
    
    chatMessages.appendChild(quickRepliesDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add product suggestion
function addProductSuggestion(product) {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.classList.add('product-suggestion');
    
    suggestionDiv.innerHTML = `
        <h5>${product}</h5>
        <p>${productInfo[product].description}</p>
        <p class="price">${productInfo[product].price}</p>
        <button class="quick-reply add-to-cart-btn" data-product="${product}" data-price="${productInfo[product].price.replace('$', '')}">
            Add to Cart
        </button>
    `;
    
    chatMessages.appendChild(suggestionDiv);
    
    // Add event listener to the Add to Cart button
    suggestionDiv.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        const price = this.getAttribute('data-price');
        addToCart(product, price);
        addMessage(`Added ${product} to cart!`, 'bot');
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message and generate response
function handleUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";
    let quickReplies = [];
    let productSuggestion = null;

    // Check for product names
    if (lowerMessage.includes('500ml') || lowerMessage.includes('500')) {
        productSuggestion = "SmartHydrate 500ml";
    } else if (lowerMessage.includes('750ml') || lowerMessage.includes('750')) {
        productSuggestion = "SmartHydrate 750ml";
    } else if (lowerMessage.includes('1l') || lowerMessage.includes('1 l') || lowerMessage.includes('1000ml')) {
        productSuggestion = "SmartHydrate 1L";
    }

    // Check for common questions
    for (const [keyword, reply] of Object.entries(commonQuestions)) {
        if (lowerMessage.includes(keyword)) {
            response = reply;
            break;
        }
    }

    // Check for product features
    for (const [feature, description] of Object.entries(productInfo.features)) {
        if (lowerMessage.includes(feature.toLowerCase())) {
            response = `${feature}: ${description}`;
            break;
        }
    }

    // Check for shipping questions
    if (lowerMessage.includes('ship') || lowerMessage.includes('deliver')) {
        response = "We offer several shipping options: ";
        for (const [type, info] of Object.entries(productInfo.shipping)) {
            response += `${type} (${info}), `;
        }
        response = response.slice(0, -2) + ".";
    }

    // If no specific response, provide general help
    if (!response) {
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            response = "You're welcome! Is there anything else I can help you with?";
        } else {
            response = "I can help you with information about our SmartHydrate bottles. Would you like to know about:";
            quickReplies = ["Features", "Pricing", "Colors", "Shipping", "Returns"];
        }
    }

    // Add the bot's response
    addMessage(response, 'bot');

    // Add product suggestion if relevant
    if (productSuggestion) {
        addProductSuggestion(productSuggestion);
    }

    // Add quick replies if we have them
    if (quickReplies.length > 0) {
        addQuickReplies(quickReplies);
    }
}

// Initialize with quick replies
addQuickReplies(["Features", "Pricing", "Best seller"]);

// Initialize
showTestimonial(0);
updateCart();