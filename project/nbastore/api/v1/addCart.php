<?php
header("Access-Control-Allow-Origin:*");
include("../db.php");
 $id = $_POST["id"];
 $title = $_POST["title"];
 $picSrc = $_POST["picSrc"];
 $newPrice = $_POST["newPrice"];
 $oldPrice = $_POST["oldPrice"];
 $size = $_POST["size"];
 $number = $_POST["number"];

//查id 如果有就添加数量 没有就添加一天新的
$sql = "select * from cart where proid = '$id'";
$res = mysql_query($sql);
$res1 = mysql_num_rows($res);//获取匹配的条数 > 0 说明数据库有相同id


if($res1 > 0){
	//增加数量即可 更新数据库操作
	// $res2 =  json_encode(mysql_fetch_assoc($res)); 获取具体的符合id的那条数据
	// 没有判断尺码一不一样 
    $sql1 = "select number  from cart where proid = '$id'";
	$res2 = mysql_query($sql1);
	$arr = array();
	while($row = mysql_fetch_assoc($res2)){
		array_push($arr, $row);
	}
	 $num = $arr[0]["number"] + $number;
	// echo $arr[0]["number"];
	    $sql2 = "update cart set number='$num'  where  proid = '$id'";
	   
	    $isSucc = mysql_query($sql2);

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





		 if($isSucc){
			$resarr = array(
				'res_code' => 1, 
				'res_message' => '累计添加成功',
				'res_body' => array(
					'id' => $id,
					'title' => $title,
				    "number" => $num,
					"allNum" => $allNum

				 )
		    	);
			}else{
				$resarr = array(
					'res_code' => 0, 
					'res_message' => "数据库操作失败",
					'res_body' => array(
						'id' => $id,
						'title' => $title,
						"number" => $num,
						"allNum" => $allNum
					)
				);
		    }
    echo json_encode($resarr);
 }else{

 	//表示数据库（购物车）中没有 该商品 就添加进数据库
 	$sqlAdd = "insert into cart (proid,title,picSrc,newPrice,oldPrice,size,number) values ('$id','$title','$picSrc','$newPrice','$oldPrice','$size','$number')";
    
	if(mysql_query($sqlAdd)){
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
		$arr = array('res_code' => 1, 'res_message' => "初次添加成功",'res_body' => array(
						'id' => $id,
						'title' => $title,
						"allNum" => $allNum
					));
	  }else{
		$arr = array('res_code' => 0, 'res_message' => "数据库操作失败",'res_body' => array(
						'id' => $id,
						'title' => $title,
						"allNum" => $allNum
					));
	}

	echo json_encode($arr);
 	
   }



    
?>