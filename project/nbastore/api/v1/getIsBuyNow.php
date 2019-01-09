<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
 //前端 data : {proId,title,newPrice,oldPrice,picSrc,size,number},
$proId =$_POST['proId'];

$sql = "select * from isbuynow WHERE proid = '$proId' ";

$res = mysql_query($sql);
$arr = array();
while($row = mysql_fetch_assoc($res)){
	array_push($arr, $row);
}
if($res){
	$res_arr = array(
			'res_code' => 1, 
			'res_message' => '成功',
			'res_body' => $arr
		);
    echo json_encode($res_arr);
}


?>