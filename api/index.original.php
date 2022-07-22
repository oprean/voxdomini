<?php
use Slim\Exception\HttpNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/vendor/rb.php';

$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);
$app->setBasePath("/voxdomini/api");

$app->options('/{routes:.+}', function ($request, $response, $args) {
  return $response;
});

$app->add(function ($request, $handler) {
  $response = $handler->handle($request);
  return $response
          ->withHeader('Access-Control-Allow-Origin', '*')
          //->withHeader('Access-Control-Request-Origin', '*')
          //->withHeader('Access-Control-Request-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
          //->withHeader('Access-Control-Request-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
          ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
          ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});


$app->get('/events', function (Request $request, Response $response, $args) {
    $data = file_get_contents(__DIR__.'/data/demo.json');
    $data = json_decode($data);
    $data = $data->events;
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/resources', function (Request $request, Response $response, $args) {
  $data = file_get_contents(__DIR__.'/data/demo.json');
  
  $response->getBody()->write($data);
  return $response->withHeader('Content-Type', 'application/json');
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
  throw new HttpNotFoundException($request);
});

try {
    $app->run();     
} catch (Exception $e) {    
  // We display a error message
  die( json_encode(array("status" => "failed", "message" => "This action is not allowed"))); 
}
