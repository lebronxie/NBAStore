<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");

//前端传过来的是一个要删除商品proid 数组 
$delArr = $_POST['delArr']; //循环这个数组 拼接成sql 语句
// echo json_encode($delArr);
$sql = "delete from cart where ";

// $sql = "delete from cart where proid='$proId' or proid='$proId'" ;
// 循环拼接sql语句
for ($x=0; $x<count($delArr); $x++) {
  $sql .=  "proid = '$delArr[$x]' or ";
} 
$sql = substr($sql, 0, -3);//去掉最后的 "or"

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