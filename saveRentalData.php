<?php
// Database connection variables
$db_host = 'localhost'; // Provide your host name
$db_user = 'root'; // Provide your username
$db_pass = ''; // Provide your password
$db_name = 'carrental_db'; // Provide your database name

// Create a new MySQLi instance
$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check the connection
if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}

// Retrieve field values from the POST data
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$addressLine1 = $_POST['addressLine1'];
$addressLine2 = $_POST['addressLine2'];
$suburb = $_POST['suburb'];
$state = $_POST['state'];
$postcode = (int)$_POST['postcode'];
$paymentType = $_POST['paymentType'];
$bondAmount = (int)$_POST['bondAmount'];
$totalCost = (int)$_POST['totalCost'];

// SQL query to insert the user's booking details into the Renting_History table
$sql = "INSERT INTO Renting_History (first_name, last_name, user_email, address, address_two, suburb, state, postcode, payment_type, rent_date, bond_amount, total_cost) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)";

// Prepare the SQL statement
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sssssssisii", $firstName, $lastName, $email, $addressLine1, $addressLine2, $suburb, $state, $postcode, $paymentType, $bondAmount, $totalCost); // "s" means the database expects a string

// Execute the SQL statement
if ($stmt->execute()) {
// If the query was successful, output a success message
echo json_encode(array('success' => true));
} else {
// If the query failed, output an error message
echo json_encode(array('success' => false, 'error' => $mysqli->error));
}

// Close the statement and connection
$stmt->close();
$mysqli->close();
?>
