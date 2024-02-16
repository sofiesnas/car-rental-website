<?php
$carIds = json_decode(file_get_contents('php://input'), true);

$data = json_decode(file_get_contents('cars.json'), true);

foreach ($data as &$car) {
    if (in_array($car['carId'], $carIds)) {
        $car['Availability'] = 0;
    }
}

file_put_contents('cars.json', json_encode($data, JSON_PRETTY_PRINT));
?>
