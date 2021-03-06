<?php
/*
http://blog.revivalx.com/2014/11/14/implement-push-notifications-for-android-and-ios-phonegap-part-3/
*/
//enable it
//$deviceType = 'ios';
$deviceType = 'android';
 
//operation begin
if($deviceType == 'ios'){
	 
	$deviceToken = 'xxxxx';
	// Put your device token here (without spaces):
	 
	// Put your private key's passphrase here:
	$passphrase = '';
	 
	// Put your alert message here:
	$message = 'Bakkaldan Push TEST!';
	 
	////////////////////////////////////////////////////////////////////////////////
	 
	$ctx = stream_context_create();
	stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck.pem');
	stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
	 
	// Open a connection to the APNS server
	$fp = stream_socket_client(
		'ssl://gateway.sandbox.push.apple.com:2195', $err,
		$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
	 
	if (!$fp)
		exit("Failed to connect: $err $errstr" . PHP_EOL);
	 
	echo 'Connected to APNS' . PHP_EOL;
	 
	// Create the payload body
	$body['aps'] = array(
		'alert' => $message,
		'sound' => 'default',
		'badge' => 1
		);
	 
	// Encode the payload as JSON
	$payload = json_encode($body);
	 
	// Build the binary notification
	$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
	 
	// Send it to the server
	$result = fwrite($fp, $msg, strlen($msg));
	 
	if (!$result)
		echo 'Message not delivered' . PHP_EOL;
	else
		echo 'Message successfully delivered' . PHP_EOL;
	 
	// Close the connection to the server
	fclose($fp);
}
else if($deviceType == 'android'){
 
	$deviceToken = '32d5b39006e26dcc';
	 
	$registrationIds = array($deviceToken);
	 
	// prep the bundle
	$msg = array
	(
		'message'       => 'Bakkaldan Push Test',
		'title'         => '[Testing]',
		'subtitle'      => 'Alt text testi',
		'tickerText'    => 'Ticker text testi',
		'vibrate'   => 1,
		'sound'     => 1
	);
	 
	$fields = array
	(
		'registration_ids'  => $registrationIds,
		'data'              => $msg
	);
	 
	$headers = array
	(
		'Authorization: key=' . 'AIzaSyDoluU96V277shSY9qbsgxiq44aaYA1Ja8',
		'Content-Type: application/json'
	);
	 
	$ch = curl_init();
	curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
	curl_setopt( $ch,CURLOPT_POST, true );
	curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
	curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
	$result = curl_exec($ch );
	curl_close( $ch );
	 
	echo $result;
}
else {
    echo "Error";
}