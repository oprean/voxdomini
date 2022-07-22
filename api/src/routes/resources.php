<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/resources', function (Request $request, Response $response, $args) {
  R::useExportCase('camel');
  $resources = array_values(R::findAll(RESOURCE_BEAN, 'WHERE group_only = 0 ORDER BY group_only asc, name asc'));
  $resources = R::exportAll($resources);
  
  $response->getBody()->write(json_encode($resources));
  return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/resource/{id}[/{filter}]', function (Request $request, Response $response, $args) {
  $id = $request->getAttribute('id');
  $filter = $request->getAttribute('filter');
  $resources = [];
  R::useExportCase('camel');
  $resource = R::findOne(RESOURCE_BEAN, 'id=?',[$id]);
  $cond = '';
  switch ($filter) {
    case 'today':
        $cond = "date(start) == DATE('now')";      
        break;
    case 'past':
        $cond = "start < DATE('now')";
        break;
    case 'week':
        $cond = "DATE(start) BETWEEN DATE('now', 'weekday 0', '-7 days') AND DATE('now', 'weekday 1', '-1 days')";
        break;
    case 'all':
        $cond = "start >= DATE('now')";
        break;
    case 'none':
        $cond = "1=2";
        $resources = R::getAll('SELECT id, name as title from '.RESOURCE_BEAN);
        break;

    default:
      $cond = '';
  };
  $cond .= ' ORDER BY start ASC';

  $resource->withCondition($cond)->ownEvent;


  $resource = R::exportAll($resource);
  if (count($resource)) {
    $resource = [
      'resource' => $resource[0],
      'resources' => $resources
    ];
  }
  $response->getBody()->write(json_encode($resource));

  return $response->withHeader('Content-Type', 'application/json');
});

$app->put('/resource', function (Request $request, Response $response, $args) {
  $body = $request->getBody()->getContents();
  $body = json_decode($body);
//print_r($body);
  $resource = R::findOne(RESOURCE_BEAN, ' id = ?', [$body->id]);
  $resource->name = $body->name;
  $resource->description = $body->description;
  $resource->groupOnly = $body->groupOnly;
  $resource->parentId = $body->parentId;

  $id = R::store( $resource );

  $response->getBody()->write('ok');
  return $response->withHeader('Content-Type', 'application/json');
});