<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/roles', function (Request $request, Response $response, $args) {
  
  $roles = R::findAll(ROLE_BEAN, ' ORDER BY name');
  $roles = R::exportAll($roles);
  
  $response->getBody()->write(json_encode($roles));
  return $response->withHeader('Content-Type', 'application/json');
});