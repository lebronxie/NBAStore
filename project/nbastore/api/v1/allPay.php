<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
 //前端 allPayStr : insert into allPay (proid,title,picSrc,newPrice,oldPrice,size,number) values 
                            // ('$proId','$title','$picSrc','$newPrice','$oldPrice','$size','$number')
 //前端传过来的是一个mysql执行语句  将该语句执行就能批量添加数据库
 
 $allPayStr = $_GET['allPayStr'];
 //添加之前先清空原来的数据
 mysql_query("delete from allPay");
 $allPayStr = str_replace("\\","",$allPayStr);
 // echo $allPayStr;
 $res = mysql_query($allPayStr);


if($res){
	$arr = array(
			'res_code' => 1, 
			'res_message' => '添加数据库成功可以到支付界面了',
			'res_body' => array(
				
			)
		);
    echo json_encode($arr);
}


?>