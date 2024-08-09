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
        const orderDetails = [];

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
                        <td>Rs. ${price}</td>
                        <td><span class="remove-item" data-name="${name}" aria-label="Remove item" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </span></td>
                    </tr>
                `;
                orderTableBody.insertAdjacentHTML('beforeend', row);

                // Add item details to the orderDetails array
                orderDetails.push({ name, quantity, price, image: imageSrc });
            }
        });

        totalPriceElement.innerText = total.toFixed(2);

        // Store the current order details in localStorage
        localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
        localStorage.setItem('totalOrderPrice', total.toFixed(2));

        // Add event listeners for remove icons
        document.querySelectorAll('.remove-item').forEach(icon => {
            icon.addEventListener('click', removeItem);
        });
    }

    // Function to load the current order from localStorage
    function loadCurrentOrder() {
        const orderDetails = JSON.parse(localStorage.getItem('currentOrder'));
        const totalOrderPrice = localStorage.getItem('totalOrderPrice');

        if (orderDetails && totalOrderPrice) {
            orderTableBody.innerHTML = '';
            orderDetails.forEach(item => {
                let quantityText;

                // Determine the unit based on the item name
                if (itemsWithKg.includes(item.name.toLowerCase())) {
                    quantityText = `${item.quantity} kg`;
                } else {
                    quantityText = `${item.quantity}`; // No unit for other items
                }

                const row = `
                    <tr>
                        <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">${item.name}</td>
                        <td>${quantityText}</td>
                        <td>Rs. ${item.price}</td>
                        <td><span class="remove-item" data-name="${item.name}" aria-label="Remove item" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </span></td>
                    </tr>
                `;
                orderTableBody.insertAdjacentHTML('beforeend', row);
            });

            totalPriceElement.innerText = totalOrderPrice;

            // Add event listeners for remove icons
            document.querySelectorAll('.remove-item').forEach(icon => {
                icon.addEventListener('click', removeItem);
            });
        }
    }

    // Function to remove an item from the order
    function removeItem(event) {
        const itemName = event.currentTarget.getAttribute('data-name').toLowerCase();
        document.querySelectorAll('.product-items').forEach(item => {
            if (item.querySelector('h3').textContent.toLowerCase().trim() === itemName) {
                item.querySelector('input').value = 0;
            }
        });
        updateOrder();
    }

    loadCurrentOrder();

    // Save the favorite order
    function saveFavoriteOrder() {
        const orderDetails = JSON.parse(localStorage.getItem('currentOrder'));
        if (orderDetails) {
            localStorage.setItem(favoriteKey, JSON.stringify(orderDetails));
            alert('Favorite order saved!');
        } else {
            alert('No items in the current order to save!');
        }
    }

    // Apply the favorite order
    function applyFavoriteOrder() {
        const favoriteOrder = JSON.parse(localStorage.getItem(favoriteKey));
        if (favoriteOrder) {
            document.querySelectorAll('.product-items').forEach(item => {
                const name = item.querySelector('h3').textContent.toLowerCase().trim();
                const favoriteItem = favoriteOrder.find(favItem => favItem.name.toLowerCase() === name);
                if (favoriteItem) {
                    item.querySelector('input').value = favoriteItem.quantity;
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

    // Add event listener for quantity inputs to update order immediately
    document.querySelectorAll('.product-items input').forEach(input => {
        input.addEventListener('input', updateOrder);
    });

    // Event listener for checkout button
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
});
