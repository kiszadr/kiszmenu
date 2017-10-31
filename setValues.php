
<?php 
	// podłączamy plik  connection.php 
	require "connection.php"; 
	// wywołujemy funkcję connection() 
	connection();
	mysql_set_charset('UTF8');
				
	$result = mysql_query("SELECT * FROM `kiszadr`");
	$vueList = [];
		while( $row = $result){
			$bufor = mysql_fetch_array($row);

			if( is_null($bufor['value']) ){
				break;
			} else{
				array_push($vueList,$bufor['value']);
			}
		}

		echo json_encode($vueList);
?>
