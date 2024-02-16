
/* ----- Header ----- */
// Function to scroll to Rent Our Cars section when button is clicked
document.getElementById("scrollButton").addEventListener("click", function() {
    document.getElementById("cars-section").scrollIntoView({ behavior: 'smooth' });
    
});
/* ----- End of Header ----- */


/* ----- Cars Display ----- */
// Function to make an AJAX request
function loadJSON(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "cars.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

// Function to display the cars 
function displayCars(cars) {
    var productsContainer = document.querySelector(".products-center");

    // Clear existing car elements
    productsContainer.innerHTML = "";

    cars.forEach(function (car) {
      // Create a new product element
        var product = document.createElement("article");
        product.classList.add("product");

      // Create the inner HTML of the product element
        var productContent = `
        <div class="img-container">
            <img src="${car.Image}" alt="product" class="product-img">
            <button class="bag-btn" data-id="${car.carId}">
            <i class="fas fa-shopping-cart"></i>
            add to cart
            </button>
        </div>
        <h3>${car.Brand} ${car.Model} ${car.Year}</h3>
        <h4>$${car["Price/day"]} / day</h4>
        <div class="more-info">
            <div class="details">
                <h5><b>Seats</b>: ${car.Seats}</h5>
                <h5><b>Fuel</b>: ${car.Fuel}</h5>
                <h5><b>Mileage</b>: ${car.Mileage}</h5>
            </div>
            <div class="description">
                <h5>${car.Description}</h5>
            </div>
        </div>
        `;

        // Set the inner HTML of the product element
        product.innerHTML = productContent;

        // Append the product element to the container
        productsContainer.appendChild(product);

        var addToCartBtn = product.querySelector(".bag-btn");
        addToCartBtn.addEventListener("click", function () {
            if (car.Availability === 1) {
                addToCart(car);
            } else {
                alert("Sorry, the car is not available now. Please try other cars.");
            }
        });
    });
}

// Load JSON data and display the cars
loadJSON(displayCars);

// Function to add car to the cart
function addToCart(car) {
    // Get the existing cart items from the session
    var cartItems = sessionStorage.getItem("cartItems");
    var cart = [];
    var totalCost = 0; // Initialize total cost

    if (cartItems) {
      // If cart items exist, parse the JSON string and assign it to the cart array
        cart = JSON.parse(cartItems);
      // Calculate the existing total cost
        totalCost = calculateCartTotal(cart);
    }

    // Check if the car is already in the cart
    var isCarInCart = cart.some(function (cartItem) {
        return cartItem.carId === car.carId;
    });

    if (isCarInCart) {
      // Alert the user that the car is already in the cart
        alert("This car is already in your cart.");
    } else {
      // Add the car to the cart array with initial rental days value of 1
        car.rentalDays = 1;
        cart.push(car);

      // Update the total cost
        totalCost += car["Price/day"];

      // Save the updated cart array and total cost to the session storage
        sessionStorage.setItem("cartItems", JSON.stringify(cart));
        sessionStorage.setItem("totalCost", totalCost);

      // Update the cart UI
        updateCartUI();

      // Alert the user that the car has been added to the cart
        alert("Car added to cart successfully!");
    }
}
/* ----- End of Cars Display ----- */


/* ----- Cart ----- */
// Variables
const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const cartDOM = document.querySelector('.cart');
const closeCartBtn = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

// Function to update the cart UI
function updateCartUI() {
    // Get the existing cart items from the session
    var cartItems = sessionStorage.getItem("cartItems");
    var cartContent = document.querySelector(".cart-content");

    if (cartItems && cartContent) {
        // Parse the JSON string and assign it to the cart array
        var cart = JSON.parse(cartItems);

        // Clear existing cart items
        cartContent.innerHTML = "";

        // Iterate over the cart items and create HTML elements for each item
        cart.forEach(function (car) {
            // Create a new cart item element
            var cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            // Create the inner HTML of the cart item element
            var cartItemContent = `
            <img src="${car.Image}" alt="product">
            <div>
                <h4>${car.Brand} ${car.Model} ${car.Year}</h4>
                <h5>$${car["Price/day"]} / day</h5>
                <span class="remove-item" data-id="${car.carId}">remove</span>
            </div>
            <div>
                <input type="number" class="rental-days" min="1" max="40" value="1">
            </div>
            <div class="error-message"></div>
            `;

            // Set the inner HTML of the cart item element
            cartItem.innerHTML = cartItemContent;

            // Append the cart item element to the cart content
            cartContent.appendChild(cartItem);

            // Add event listener to rental-days input
            var rentalDaysInput = cartItem.querySelector(".rental-days");
            rentalDaysInput.value = car.rentalDays; // Set the initial value

            rentalDaysInput.addEventListener("input", function () {
                var days = parseInt(this.value);
                var errorMessage = cartItem.querySelector(".error-message");

                if (!isNaN(days) && days >= 1 && days <= 40) {
                    // Clear the error message
                    errorMessage.textContent = "";
                    
                    // Update the rental days property of the car
                    car.rentalDays = days; 

                    // Update the price based on the rental days
                    var price = car["Price/day"] * days;
                    var priceElement = cartItem.querySelector("h5");
                    priceElement.textContent = `$${price} / ${days} days`;

                    // Update the cart in the session storage
                    sessionStorage.setItem("cartItems", JSON.stringify(cart));

                    // Recalculate the total cost and update it in the session storage
                    var totalCost = calculateCartTotal(cart);
                    sessionStorage.setItem("totalCost", totalCost);

                    // Update the cart UI
                    updateCartUI();
                } else {
                    errorMessage.textContent = "Rental days should be between 1 and 40.";
                }
            });

            // Add event listener to remove-item button
            var removeItemBtn = cartItem.querySelector(".remove-item");
            removeItemBtn.addEventListener("click", function () {
                removeFromCart(car.carId);
            });

            // Calculate the initial price based on the rental days
            var price = car["Price/day"] * car.rentalDays;
            totalCost += price; // Add to the total cost
        });

        // Calculate and update the cart total
        var cartTotal = document.querySelector(".cart-total");
        var totalCost = calculateCartTotal(cart);
        cartTotal.textContent = totalCost;

        // Update the cart items count
        var cartItemsCount = document.querySelector('.cart-items');
        cartItemsCount.textContent = cart.length;
    }
}

// Function to remove car from the cart
function removeFromCart(carId) {
    // Get the existing cart items from the session
    var cartItems = sessionStorage.getItem("cartItems");

    if (cartItems) {
      // Parse the JSON string and assign it to the cart array
        var cart = JSON.parse(cartItems);

      // Find the index of the car with the specified carId
        var carIndex = cart.findIndex(function (car) {
            return car.carId === carId;
        });

        if (carIndex !== -1) {
        // Remove the car from the cart array
        cart.splice(carIndex, 1);

        // Save the updated cart array to the session
        sessionStorage.setItem("cartItems", JSON.stringify(cart));

        // Recalculate the total cost and update it in the session storage
        var totalCost = calculateCartTotal(cart);
        sessionStorage.setItem("totalCost", totalCost);

        // Update the cart UI
        updateCartUI();
        }
    }
}

// Function to calculate the cart total
function calculateCartTotal(cart) {
    var total = 0;

    cart.forEach(function (car) {
        var price = car["Price/day"] * car.rentalDays;
        total += price;
    });

    return total;
}

// Add a click event listener to the cart button
cartBtn.addEventListener('click', function() {
    // Toggle the 'showCart' class on the cart overlay and cart elements
    cartOverlay.classList.toggle('showCart');
    cartDOM.classList.toggle('showCart');
});

// Add a click event listener to the close cart button
closeCartBtn.addEventListener('click', function() {
    // Toggle the 'showCart' class on the cart overlay and cart elements
    cartOverlay.classList.toggle('showCart');
    cartDOM.classList.toggle('showCart');
});

// Add a click event listener to the checkout button
checkoutBtn.addEventListener('click', function() {
    // Check if any rental-days error message is present
    var errorMessages = document.querySelectorAll('.error-message');
    var hasErrorMessage = Array.from(errorMessages).some(function(errorMessage) {
        return errorMessage.textContent !== '';
    });

    if (hasErrorMessage) {
        // Show an alert message and prevent navigation to the checkout page
        alert("Please fix the rental days errors before proceeding to checkout.");
    } else {
        // Get the existing cart items from the session
        var cartItems = sessionStorage.getItem("cartItems");

        // If cartItems is null or empty, alert and return
        if (!cartItems || JSON.parse(cartItems).length === 0) {
            alert("No car has been reserved.");
            // Jump to the browsing page
            document.getElementById("cars-section").scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // At this point, cartItems is not null or empty. Parse it.
        var cart = JSON.parse(cartItems);

        // Navigate to the checkout page
        window.location.href = "checkout.html";
    }
});

/* ----- End of Cart ----- */

// Update the cart UI when the page loads
window.addEventListener('load', function() {
    updateCartUI();
});

/* ----- Checkout ----- */

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the total cost from session storage
    var totalCost = sessionStorage.getItem("totalCost");

    // Get the element to display the total cost on the checkout page
    var totalCostElement = document.getElementById("total-cost");

    // Update the total cost element with the retrieved value
    totalCostElement.textContent = "Cost: $" + totalCost;

    // Get the email field
    var emailField = document.querySelector("input[name='email']");

    // Listen for the input event on the email field
    emailField.addEventListener('input', function(e) {
        var email = e.target.value;

      // Check if the email is valid before sending the request
        if (email.includes('@') && email.includes('.')) {
            var totalCost = sessionStorage.getItem("totalCost");

            // Prepare data to be sent
            var formData = new FormData();
            formData.append('email', email);
            formData.append('totalCost', totalCost);

            fetch('fetchRentalData.php', {
            method: 'POST',
            body: formData
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById("bond-amount").textContent = "Bond Amount: $" + data.bondAmount;
                document.getElementById("grand-total").textContent = "Total Cost: $" + data.grandTotal;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });

    // Get the checkout form element
    var checkoutForm = document.getElementById("checkoutForm");

    // Add a submit event listener to the checkout form
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Retrieve the form field values
        var firstName = document.querySelector("input[name='firstName']").value;
        var lastName = document.querySelector("input[name='lastName']").value;
        var email = document.querySelector("input[name='email']").value;
        var addressLine1 = document.querySelector("input[name='addressLine1']").value;
        var addressLine2 = document.querySelector("input[name='addressLine2']").value;
        var suburb = document.querySelector("input[name='suburb']").value;
        var state = document.querySelector("input[name='state']").value;
        var postcode = document.querySelector("input[name='postcode']").value;
        var paymentType = document.getElementById("paymentType").value;
        var bondAmount = document.getElementById("bond-amount").textContent.split("$")[1];
        var grandTotal = document.getElementById("grand-total").textContent.split("$")[1];

        // Prepare data to be sent
        var formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('addressLine1', addressLine1);
        formData.append('addressLine2', addressLine2);
        formData.append('suburb', suburb);
        formData.append('state', state);
        formData.append('postcode', postcode);
        formData.append('paymentType', paymentType);
        formData.append('bondAmount', bondAmount);
        formData.append('totalCost', grandTotal);

        // Get the car IDs from the cart items
        var cartItems = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
        var carIds = cartItems.map(function(car) {
            return car.carId;
        });

        // Add the car IDs to the form data
        formData.append('carIds', JSON.stringify(carIds));

        fetch('saveRentalData.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Send a request to update the cars.json file
                fetch('updateCars.php', {
                    method: 'POST',
                    body: JSON.stringify(carIds)
                })
                // Reset the form fields
                checkoutForm.reset();

                // Clear the cart items from session storage
                sessionStorage.removeItem("cartItems");
                sessionStorage.removeItem("totalCost");

                // Redirect or perform further processing as needed
                alert("Thank you for your booking!");

                // Redirect to the home page
                window.location.href = "index.html";
            } else {
                alert("There was a problem processing your booking. Please try again.");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

/* ----- End of Checkout ----- */



