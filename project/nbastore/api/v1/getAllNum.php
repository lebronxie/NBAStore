<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
     //获取所有数量和
	 //获得所有number商品的总数
	$allNumber = mysql_query("select number from cart");
	//这是一个结果集
	$arr = array();
	while($row = mysql_fetch_assoc($allNumber)){
		array_push($arr, $row);
	}

	$allNum = 0;
	foreach ($arr as $key => $value) {
	      $allNum += $value["number"];
	}

	$resarr = array(
				'res_code' => 1, 
				'res_message' => '数量总和',
				'res_body' => array(
				"allNum" => $allNum ));
	echo json_encode($resarr);
?>