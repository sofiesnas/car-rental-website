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

// Retrieve totalCost and email from the POST data
$email = $_POST['email'];
$totalCost = $_POST['totalCost'];

// SQL query to check if the user has rented a car in the past three months
$sql = "SELECT * FROM Renting_History WHERE user_email = ? AND rent_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";

// Prepare the SQL statement
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $email); 
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Initialize bondAmount
$bondAmount = 200;

if ($result->num_rows > 0) {
    // The user has rented a car in the past three months
    $bondAmount = 0;
}

// Calculate grandTotal
$grandTotal = $totalCost + $bondAmount;

// Output bondAmount and grandTotal as a JSON object
echo json_encode(array('bondAmount' => $bondAmount, 'grandTotal' => $grandTotal));

// Close the statement and connection
$stmt->close();
$mysqli->close();
?>