<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
$proId = $_POST['proId'];
//拿着前端传过来的 商品编号proId 修改对应的number值
$sql = "delete from cart where proid='$proId' ";
$isSucc = mysql_query($sql);


if($isSucc){
		$arr = array(
			'res_code' => 1, 
			'res_message' => '成功',
			'res_body' => array(
				'proId' => $proId,
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