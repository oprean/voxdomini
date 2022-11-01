<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/test', function (Request $request, Response $response, $args) {

  // save
  $event = R::dispense(EVENT_BEAN);
  $event->title = 'title';
  $event->start = 'start';
  $event->end = 'end';
  $event->resourceId = 1;
  $event->bgColor = 'red';
  $id = R::store( $event );

  $data = R::getAll("SELECT * FROM event");
  $data = json_encode($data);

  $response->getBody()->write($data);
  return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/qmweb', function (Request $request, Response $response, $args) {

  // save
  $dir = 'c:\Temp\qbweb\all';
  $files = scandir($dir);
  $errors = [];
  $success = [];
  foreach($files as $file) {
    if (!is_file($dir.'\\'.$file)) continue;
    $path_parts = pathinfo($dir.'\\'.$file);
    $basename = $path_parts['filename'];
    $specificFolder = 'c:\Temp\qbweb\prepared\\'.$basename;
    mkdir($specificFolder);
    $from = 'c:\Temp\qbweb\all\\'.$file;
    $to = $specificFolder.'\\'.$file;
    if (copy($from,$to)) {
      $success[] = $file;
    } else {
      $errors[] = $file;
    };
  }

  $data = [
    'errors' => $errors,
    'success' => $success
  ];

  $data = json_encode($data);

  $response->getBody()->write($data);
  return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/test/init', function (Request $request, Response $response, $args) {

  R::wipe(RESOURCE_BEAN);
  $res = R::dispense(RESOURCE_BEAN);
  $res->name = 'Sala mare';
  $id = R::store( $res );
  
  $res = R::dispense(RESOURCE_BEAN);
  $res->name = 'MXM';
  $id = R::store( $res );
  
  $res = R::dispense(RESOURCE_BEAN);
  $res->name = 'Bucatarie';
  $id = R::store( $res );
  
  $res = R::dispense(RESOURCE_BEAN);
  $res->name = 'Prescolari';
  $id = R::store( $res );

  $res = R::dispense(RESOURCE_BEAN);
  $res->name = 'Copii';
  $id = R::store( $res );

  $data = R::getAll("SELECT * FROM resource");
  $data = json_encode($data);

  $response->getBody()->write($data);
  return $response->withHeader('Content-Type', 'application/json');
});
