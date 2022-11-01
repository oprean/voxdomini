<?php
header("Content-type: application/json, charset=UTF-8");
require('db.php');

$db = mysqli_connect($host, $username, $password) or die('Could not connect');
mysqli_select_db($db, $db_name) or die('');
$message    = $_GET['message'];
$title      = $_GET['title'];
$day        = $_GET['day'];
$month      = $_GET['month'];
$year       = $_GET['year'];

$server_key = "somekey";
$sql        = 'select fcm_token from fcm_info';
$result     = mysqli_query($db, $sql) or print("Error");
$key        = array();

while ($row = mysqli_fetch_assoc($result)) {
    $key[] = $row;
}

$headers = array(
    'Authorization: key=' . $server_key,
    'Content-Type: application/json'
);
$single  = "";

foreach($key as $value) {
    $single  = $value['fcm_token'];

    $fields  = array(
        'to' => $single,
        'notification' => array(
            'title' => str_replace("_", " ", $title),
            'body' => str_replace("_", " ", $message),
            'vibrate' => 1,
            'sound' => 1
        )
    );
    $payload = json_encode($fields);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    $result = curl_exec($ch);
}

mysqli_query($db, "INSERT INTO notifications (title, body, day, month, year) VALUES ('$title', '$message', '$day', '$month', '$year')");

mysqli_close($db);
echo $result;
?>
