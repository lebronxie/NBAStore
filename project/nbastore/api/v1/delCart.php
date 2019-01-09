<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
$proId = $_POST['proId'];
//拿着前端传过来的 商品编号proId 修改对应的number值
$sql = "delete from cart where proid='$proId' ";
$isSucc = mysql_query($sql);


if($isSucc){
     //获取所有数量 返回给前端
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

		$arr = array(
			'res_code' => 1, 
			'res_message' => '成功',
			'res_body' => array(
				'proId' => $proId,
				"allNum" => $allNum
			)
		);
}else{
	$arr = array(
		'res_code' => 0, 
		'res_message' => "数据库操作失败",
		'res_body' => array(
			'proId' => $proId,
		)
	);
}

echo json_encode($arr);



?>