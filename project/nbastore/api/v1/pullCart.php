<?php
  header("Access-Control-Allow-Origin:*");
  include("../db.php");
  
  $sql = "select * from cart";
  $res = mysql_query($sql);

  $arr = array();
	while($row = mysql_fetch_assoc($res)){
		array_push($arr, $row);
	}
 $resArr  = array('res_code' => 1, 'res_body' => $arr);
  echo json_encode($resArr);
?>