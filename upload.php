<?php
$target_dir = "uploads/" . $_POST["customName"] . '/';
if (!file_exists($target_dir)) {
  mkdir($target_dir);
}
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($_FILES["fileToUpload"]["name"], PATHINFO_EXTENSION));
$target_file = $target_dir . basename($_POST["customName"]) . '.' . $imageFileType;
$request = [];

$request['status'] = 200;
$request['text'] = '';
$request['type'] = $imageFileType;

$imageDimensions = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
if($imageDimensions === false) {
    $uploadOk = 0;
    $request['text'] = $request['text'] . " Sorry, file is not an image.";
}

// Check if file already exists
if (file_exists($target_file)) {
    $request['text'] = $request['text'] . " Sorry, file already exists.";
    $uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 5347738) {
    $request['text'] = $request['text'] . " Sorry, your file is too large.";
    $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
    $uploadOk = 0;
    $request['text'] = $request['text'] . " Sorry, bad file format.";
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk === 0) {
    $request['status'] = 300;
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        $request['status'] = 200;
        $request['text'] = "ok";
        $request['image'] = "https://serwer1738894.home.pl/uploads/" . $_POST["customName"] . '/' . $_POST["customName"] . '.' . $imageFileType;
        $request['imageSmall'] = "https://serwer1738894.home.pl/uploads/" . $_POST["customName"] . '/' . $_POST["customName"] . '_small.' . $imageFileType;
        $request['imageMedium'] = "https://serwer1738894.home.pl/uploads/" . $_POST["customName"] . '/' . $_POST["customName"] . '_medium.' . $imageFileType;
        echo json_encode($request);

        $target_file_small = $target_dir . basename($_POST["customName"]) . '_small.' . $imageFileType;
        $target_file_medium = $target_dir . basename($_POST["customName"]) . '_medium.' . $imageFileType;
        list($width, $height) = $imageDimensions;
        createSmallImage ($target_file, $target_file_small, $width, $height, $imageFileType, 420);
        createSmallImage ($target_file, $target_file_medium, $width, $height, $imageFileType, 1024);  

    } else {
        $request['status'] = 300;
        $request['text'] = $request['text'] . "Sorry, error due to save.";
        echo json_encode($request);
    }
    
}

function createSmallImage($src, $dst, $width_orig, $height_orig, $type, $dimension) {
  $new_width = $dimension;
  $new_height = $dimension;

  $ratio_orig = $width_orig/$height_orig;
  
  if ($width_orig / $height_orig > $ratio_orig) {
     $new_width = $new_height * $ratio_orig;
  } else {
     $new_height = $new_width / $ratio_orig;
  }

  $new = imagecreatetruecolor($new_width, $new_height);
  if($type == 'jpeg') $type = 'jpg';
  switch($type){
    case 'bmp': $img = imagecreatefromwbmp($src); break;
    case 'gif': $img = imagecreatefromgif($src); break;
    case 'jpg': $img = imagecreatefromjpeg($src); break;
    case 'png': $img = imagecreatefrompng($src); break;
    default : return "Unsupported picture type!";
  }

  $x = 0;
  imagecopyresampled($new, $img, 0, 0, $x, 0, $new_width, $new_height, $width_orig, $height_orig);

  switch($type){
    case 'bmp': imagewbmp($new, $dst); break;
    case 'gif': imagegif($new, $dst); break;
    case 'jpg': imagejpeg($new, $dst); break;
    case 'png': imagepng($new, $dst); break;
  }
}
?>