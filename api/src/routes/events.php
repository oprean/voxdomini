<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/events1', function (Request $request, Response $response, $args) {
    $data = file_get_contents(__DIR__.'/../../data/demo.json');
    $data = json_decode($data);
    //$data = $data->events;
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/events[/{for}]', function (Request $request, Response $response, $args) {
  $for = $request->getAttribute('for');
  R::useExportCase('camel');
  $events = R::findAll(EVENT_BEAN, ' ORDER BY start');
  $resources = array_values(R::findAll(RESOURCE_BEAN));
  $events = R::exportAll($events);
  $resources = R::exportAll($resources);
  if ($for == 'cal') {
    $data =  $events;
  } else {
    $data = [
      'events' => $events,
      'resources' => $resources
    ];
  }

  $response->getBody()->write(json_encode($data));
  return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/event/{id}', function (Request $request, Response $response, $args) {
  $id = $request->getAttribute('id');
  R::useExportCase('camel');
  $event = R::load( EVENT_BEAN, $id ); //reloads our book
    //$event->participants = $event->sharedUserList;
  //$event->participants = $event->ownEventUser;
  $event = R::exportAll($event);
  $resources = array_values(R::findAll(RESOURCE_BEAN));
  $resources = R::exportAll($resources);
  $groups = array_values(R::findAll(EVENT_GROUP_BEAN));
  $groups = R::exportAll($groups);
  $types = array_values(R::findAll(EVENT_TYPE_BEAN));
  $types = R::exportAll($types);
  $users = array_values(R::findAll(USER_BEAN));
  $users = R::exportAll($users);
  $data = [
    'event' => $event[0],
    'resources' => $resources,
    'groups' => $groups,
    'types' => $types,
    'users' => $users
  ];

  $response->getBody()->write(json_encode($data));
  return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/event', function (Request $request, Response $response, $args) {
  $body = $request->getBody()->getContents();
  $body = json_decode($body);

  $event = R::dispense(EVENT_BEAN);
  $event->title = $body->title;
  $event->description = $body->description;
  $event->start = $body->start;
  $event->end = $body->end;
  $event->resourceId = $body->resourceId;
  $event->bgColor = $body->bgColor;
  /*if (is_array($body->participants)) {
    $users = R::findAll(USER_BEAN, 'id in (?)', [$body->participants]);
    $event->sharedUserList = $users;
  }*/

  $id = R::store( $event );

  $response->getBody()->write($event->id);

  return $response->withHeader('Content-Type', 'application/json');
});

$app->put('/event', function (Request $request, Response $response, $args) {
  $body = $request->getBody()->getContents();
  $body = json_decode($body);
//print_r($body);
  $event = R::findOne(EVENT_BEAN, ' id = ?', [$body->id]);
  $event->title = $body->title;
  $event->description = $body->description;
  $event->start = $body->start;
  $event->end = $body->end;
  $event->resourceId = $body->resourceId;
  $event->bgColor = $body->bgColor;
  $event->groupId = $body->groupId;
  $event->type = $body->type;
  $event->showPopover = $body->showPopover;
  $event->resizable = $body->resizable;
  $event->movable = $body->movable;
  $event->startResizable = $body->startResizable;
  $event->endResizable = $body->endResizable;
  $event->rrule = $body->rrule;
  /*if (is_array($body->participants)) {
    $userIDs = join(',',array_map(function ($u) { return $u->id; }, $body->participants));
    $users = R::findAll(USER_BEAN, 'id in ('.$userIDs.')');
    $event->sharedUserList = $users;
  }*/
  $id = R::store( $event );

  $response->getBody()->write('ok');

  return $response->withHeader('Content-Type', 'application/json');
});

$app->delete('/event/{id}', function (Request $request, Response $response, $args) {
  $id = $request->getAttribute('id');
  R::hunt(EVENT_BEAN, ' id = ?', [$id]);
  $response->getBody()->write('ok');

  return $response->withHeader('Content-Type', 'application/json');
});