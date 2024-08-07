document.addEventListener('DOMContentLoaded', () => {
    const orderDetailsElement = document.getElementById('order-details');
    const totalAmountElement = document.getElementById('total-amount');
    const modal = document.getElementById('thank-you-modal');
    const closeModalButton = document.getElementById('close-modal');
    const deliveryMessageElement = document.getElementById('delivery-message');

    // List of items that should display "Kg" in the order summary
    const itemsWithKg = ['Papaya', 'Apple', 'Anoda', 'Banana', 'Delum', 'Dragon fruit', 'Durian', 'Grapes'];

    // Retrieve order details and total amount from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    const totalAmount = localStorage.getItem('totalOrderPrice');

    // Display order details
    if (orderDetails && orderDetails.length > 0) {
        orderDetails.forEach(item => {
            const itemTotalPrice = item.quantity * item.price;
            const unit = itemsWithKg.includes(item.name) ? 'Kg' : '';
            const row = `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">${item.name}</td>
                    <td>${item.quantity} ${unit}</td>
                    <td>Rs. ${itemTotalPrice.toFixed(2)}</td>
                </tr>`;
            orderDetailsElement.innerHTML += row;
        });
    }

    // Display total amount
    totalAmountElement.innerText = `Rs. ${totalAmount}`;

    // Function to show modal
    function showModal(message) {
        deliveryMessageElement.textContent = message;
        modal.style.display = 'block';
    }

    // Add event listener for the submit button
    const form = document.querySelector('.payment-container form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Calculate delivery date (e.g., 3 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = deliveryDate.toLocaleDateString('en-US', options);

        // Show thank you message in modal
        showModal(`Your items will be delivered on ${formattedDate}.`);
    });

    // Event listener for closing the modal
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

