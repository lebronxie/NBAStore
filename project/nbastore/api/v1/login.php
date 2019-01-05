<?php
//CORS服务器端允许跨域访问
header("Access-Control-Allow-Origin:*");
include("../db.php");

$phone = $_POST['phone'];
$password = $_POST['password'];

$sql = "select * from user where phone='$phone' and password='$password'";

$res = mysql_query($sql);

//如果$res有结果，那么只有一条
if($row = mysql_fetch_assoc($res)){
	$arr = array('res_code' => 1, 'res_body' => $row);
}else{
	$arr = array('res_code' => 0, 'res_body' => '用户名或密码错误');
}

echo json_encode($arr);
?>