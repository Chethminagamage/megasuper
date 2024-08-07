document.addEventListener('DOMContentLoaded', () => {
    const orderTableBody = document.getElementById('order-table-body');
    const totalPriceElement = document.getElementById('total-price');
    const saveFavoriteButton = document.getElementById('save-favorite');
    const applyFavoriteButton = document.getElementById('apply-favorite');
    const favoriteKey = 'favoriteOrder';

    // List of items that should display "kg" in the order summary
    const itemsWithKg = ['papaya', 'apple', 'anoda', 'banana', 'delum', 'dragon fruit', 'durian', 'grapes', 'tomato', 'red onions', 'beetroot', 'bell pepper', 'bread fruit', 'cabbage', 'carrot', 'green chillies', 'chicken breast', 'pork sausages', 'chicken meatballs', 'cuttlefish', 'octopus', 'prawns', 'tuna'];

    // Function to update the order table and total price
    function updateOrder() {
        let total = 0;
        orderTableBody.innerHTML = '';
        document.querySelectorAll('.product-items').forEach(item => {
            const quantity = parseFloat(item.querySelector('input').value);
            if (quantity > 0) {
                const name = item.querySelector('h3').textContent.toLowerCase().trim();
                const price = parseFloat(item.querySelector('.price').textContent.replace('Rs. ', ''));
                const imageSrc = item.querySelector('img').src;
                let quantityText;

                // Determine the unit based on the item name
                if (itemsWithKg.includes(name)) {
                    quantityText = `${quantity} kg`;
                } else {
                    quantityText = `${quantity}`; // No unit for other items
                }

                total += quantity * price;
                const row = `
                    <tr>
                        <td><img src="${imageSrc}" alt="${name}" style="width: 50px; height: 50px;">${name}</td>
                        <td>${quantityText}</td>
                        <td>Rs. ${(quantity * price).toFixed(2)}</td>
                    </tr>`;
                orderTableBody.innerHTML += row;
            }
        });
        totalPriceElement.textContent = total.toFixed(2);
    }

    // Event listener for quantity input changes
    document.querySelectorAll('.product-items input').forEach(input => {
        input.addEventListener('change', updateOrder);
    });

    // Function to save the current order as a favorite
    function saveFavoriteOrder() {
        const favoriteOrder = [];
        document.querySelectorAll('.product-items').forEach(item => {
            const quantity = parseFloat(item.querySelector('input').value);
            if (quantity > 0) {
                const name = item.querySelector('h3').textContent;
                favoriteOrder.push({ name, quantity });
            }
        });
        localStorage.setItem(favoriteKey, JSON.stringify(favoriteOrder));
        alert('Order saved as favorite!');
    }

    // Function to apply the favorite order
    function applyFavoriteOrder() {
        const favoriteOrder = JSON.parse(localStorage.getItem(favoriteKey));
        if (favoriteOrder) {
            document.querySelectorAll('.product-items').forEach(item => {
                const name = item.querySelector('h3').textContent;
                const favoriteItem = favoriteOrder.find(fav => fav.name === name);
                if (favoriteItem) {
                    item.querySelector('input').value = favoriteItem.quantity;
                } else {
                    item.querySelector('input').value = 0;
                }
            });
            updateOrder();
            alert('Favorite order applied!');
        } else {
            alert('No favorite order found!');
        }
    }

    // Event listeners for save and apply favorite buttons
    saveFavoriteButton.addEventListener('click', saveFavoriteOrder);
    applyFavoriteButton.addEventListener('click', applyFavoriteOrder);
});

// Event listener for checkout button
document.getElementById('checkout-button').addEventListener('click', function(event) {
    event.preventDefault();

    // Calculate the total price from the table
    let totalPrice = document.getElementById('total-price').innerText;

    // Store the total price in localStorage
    localStorage.setItem('totalOrderPrice', totalPrice);

    // Redirect to the payment page
    window.location.href = 'payment.html';
});

document.getElementById('checkout-button').addEventListener('click', function(event) {
    event.preventDefault();

    // Calculate the total price from the table
    let totalPrice = document.getElementById('total-price').innerText;

    // Store the total price in localStorage
    localStorage.setItem('totalOrderPrice', totalPrice);

    // Gather order details
    const orderDetails = [];
    document.querySelectorAll('.product-items').forEach(item => {
        const quantity = parseFloat(item.querySelector('input').value);
        if (quantity > 0) {
            const name = item.querySelector('h3').textContent;
            const price = parseFloat(item.querySelector('.price').textContent.replace('Rs. ', ''));
            const imageSrc = item.querySelector('img').src;
            orderDetails.push({ name, quantity, price, image: imageSrc });
        }
    });

    // Store order details in localStorage
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    // Redirect to the payment page
    window.location.href = 'payment.html';
});



