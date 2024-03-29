<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\UploadedFile;

$app->get('/resources/{filter}/{type}', function (Request $request, Response $response, $args) {
  R::useExportCase('camel');
  $filter = $request->getAttribute('filter');
  $type = $request->getAttribute('type');
  $order = "ifnull((select min(start) from ".EVENT_BEAN." where resource_id = ".RESOURCE_BEAN.".id and start > date('now')),date('now', '+100 year')) asc, name asc";
  if (empty($filter)) {
    $resources = array_values(R::findAll(RESOURCE_BEAN, 'WHERE group_only = 0 AND type = '.$type.' ORDER BY '.$order));
  } else {
    $resources = array_values(R::findAll(RESOURCE_BEAN, 'WHERE group_only = 0 AND parent_id = ? AND type = '.$type.' ORDER BY '.$order, [$filter]));
  }
  $resources = R::exportAll($resources);
  $groups = array_values(R::findAll(RESOURCE_BEAN, 'WHERE group_only = 1 ORDER BY name asc'));

  $data = [
    'resources' => $resources,
    'groups' => $groups
  ];
  
  $response->getBody()->write(json_encode($data));

  return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/resource/{id}[/{filter}]', function (Request $request, Response $response, $args) {
  $id = $request->getAttribute('id');
  $filter = $request->getAttribute('filter');
  $resources = [];
  R::useExportCase('camel');
  $resource = R::findOne(RESOURCE_BEAN, 'id = ? or permlink = ?',[$id, $id]);
  $cond = '';
  switch ($filter) {
    case 'today':
        $cond = "date(start) == DATE('now')";      
        break;
    case 'past':
        $cond = "start < DATE('now')";
        break;
    case 'week':
        //$cond = "DATE(start) BETWEEN DATE('now', 'weekday 0', '-7 days') AND DATE('now', 'weekday 1', '-1 days')";
        $cond = "DATE(start) BETWEEN strftime('%Y-%m-%d', 'now', 'localtime', 'weekday 0', '-6 days') AND strftime('%Y-%m-%d', 'now', 'localtime', 'weekday 0')";
        break;
    case 'all':
        $cond = "start >= DATE('now')";
        break;
    case 'none':
        $cond = "1=2";
        $resources = R::getAll('SELECT id, name as title from '.RESOURCE_BEAN.' order by name');
        break;

    default:
      $cond = '';
  };
  $cond .= ' ORDER BY start ASC';

  $resource->withCondition($cond)->ownEvent;

  $resource = R::exportAll($resource);
  if (count($resource)) {
    $data = [
      'resource' => $resource[0],
      'resources' => $resources,
    ];
  }

  if (is_array($data['resource']['ownEvent'])) {
    foreach($data['resource']['ownEvent'] as $i => $ev) {
      $data['resource']['ownEvent'][$i]['responsible'] = R::findOne(USER_BEAN,'id=?',[$data['resource']['ownEvent'][$i]['responsibleId']]);
      $data['resource']['ownEvent'][$i]['assistant'] = R::findOne(USER_BEAN,'id=?',[$data['resource']['ownEvent'][$i]['assistantId']]);
      if (array_key_exists('ownEventUser', $data['resource']['ownEvent'][$i])) {
        foreach($data['resource']['ownEvent'][$i]['ownEventUser'] as $j => $eu) {
          $data['resource']['ownEvent'][$i]['ownEventUser'][$j] = 
            decorateEventUser($data['resource']['ownEvent'][$i]['ownEventUser'][$j]);
        }
      }
    }  
  }

  $response->getBody()->write(json_encode($data));

  return $response->withHeader('Content-Type', 'application/json');
});

function decorateEventUser($aEventUser) {
  $o = (object)$aEventUser;
  $o->name = R::getCell('SELECT name FROM user WHERE id = ?', [$o->userId]);
  $o->role = R::getCell('SELECT name FROM role WHERE id = ?', [$o->roleId]);
  return $o;
}

$app->put('/resource', function (Request $request, Response $response, $args) {
  $body = $request->getBody()->getContents();
  $body = json_decode($body);
//print_r($body);
  $resource = R::findOne(RESOURCE_BEAN, ' id = ?', [$body->id]);
  $resource->name = $body->name;
  $resource->description = $body->description;
  $resource->permlink = $body->permlink;
  $resource->groupOnly = $body->groupOnly;
  $resource->parentId = $body->parentId;
  $resource->type = $body->type;

  $id = R::store( $resource );

  $response->getBody()->write('ok');
  return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/upload', function (Request $request, Response $response, $args) {
  $uploadedFiles = $request->getUploadedFiles();
  $uploadedFile = $uploadedFiles['file'];
  $post = (Object)$request->getParsedBody();
  $filename = PUBLIC_PATH.DS.'resources'.DS.$post->id.'.jpg';
  //$uploadedFile->moveTo($filename);
  file_put_contents($filename, $uploadedFile->getStream());
  $response->getBody()->write('ok');
  return $response->withHeader('Content-Type', 'application/json');
});