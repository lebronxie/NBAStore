<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
 //前端 data : {proId,title,newPrice,oldPrice,picSrc,size,number},
$proId =$_GET['proid'];
$title =$_GET['title'];
$oldPrice =$_GET['oldPrice'];
$picSrc =$_GET['picSrc'];
$size =$_GET['size'];
$number =$_GET['number'];
$newPrice =$_GET["newPrice"];


//拿着前端传过来的 商品编号proId 修改对应的number值
$sqlAdd = "insert into allPay (proid,title,picSrc,newPrice,oldPrice,size,number) values ('$proId','$title','$picSrc','$newPrice','$oldPrice','$size','$number')";

$res = mysql_query($sqlAdd);
if($res){
	$arr = array(
			'res_code' => 1, 
			'res_message' => '成功',
			'res_body' => array(
				'proId' => $proId,
				
			)
		);
    echo json_encode($arr);
}


?>