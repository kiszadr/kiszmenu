<?php 
	
		function connection() { 
			// serwer 
			$mysql_server = "localhost"; 
			// admin 
			$mysql_admin = "23207620_kiszadr"; 
			// hasło 
			$mysql_pass = "marian21"; 
			// nazwa baza 
			$mysql_db = "23207620_kiszadr"; 
			// nawiązujemy połączenie z serwerem MySQL 
			@mysql_connect($mysql_server, $mysql_admin, $mysql_pass) 
			or die('Brak połączenia z serwerem MySQL.'); 
			// łączymy się z bazą danych 
			@mysql_select_db($mysql_db) 
			or die('Błąd wyboru bazy danych.'); 
			
		} 
	 
?>
