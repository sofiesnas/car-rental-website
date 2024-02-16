document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the total cost from session storage
    var totalCost = sessionStorage.getItem("totalCost");

    // Get the element to display the total cost on the checkout page
    var totalCostElement = document.getElementById("total-cost");

    // Update the total cost element with the retrieved value
    totalCostElement.textContent = "Cost: $" + totalCost;

    // Get the checkout form element
    var checkoutForm = document.getElementById("checkoutForm");

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