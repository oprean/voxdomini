<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/events1', function (Request $request, Response $response, $args) {
    $data = file_get_contents(__DIR__.'/../../data/demo.json');
    $data = json_decode($data);
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
  $event = R::load( EVENT_BEAN, $id );
  $event->participants = R::getAll('select *, (SELECT name FROM user WHERE id = event_user.user_id) as name, 
  (SELECT name FROM role WHERE id = event_user.role_id) as role from '.EVENT_USER_BEAN.' WHERE event_id = ?',[$id]);
  $event = R::exportAll($event);
  $resources = array_values(R::findAll(RESOURCE_BEAN));
  $resources = R::exportAll($resources);
  $groups = array_values(R::findAll(EVENT_GROUP_BEAN));
  $groups = R::exportAll($groups);
  $types = array_values(R::findAll(EVENT_TYPE_BEAN));
  $types = R::exportAll($types);
  $users = getEventUsers($id);
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

function getEventUsers($eventId, $bAll = true) {
  $event_users = [];
  if (is_int($eventId)) {
    $event_users = R::getAll('select id, event_id as eventId, user_id as userId, role_id as roleId from '.EVENT_USER_BEAN.' WHERE event_id = ?',[$eventId]);
    $ids = implode(',', array_map(function ($u) { $u = (object)$u; return $u->userId; }, $event_users));
    $sql = 'SELECT 0 as id, '.$eventId.' as eventId, id as userId, 0 as roleId from user where id not in ('.$ids.')';
    $all_users = R::getAll($sql);
  } else {
    $sql = 'SELECT 0 as id, 0 as eventId, id as userId, 0 as roleId from user';
    $all_users = R::getAll($sql);
  }

  if (!$bAll) $all_users = [];

  $users = array_merge($event_users,$all_users);
  $users = array_map(function ($u) { 
      $u = (object)$u; 
      $u->name = R::getCell('SELECT name from user where id = ?', [$u->userId]); return $u; 
      $u->role = R::getCell('SELECT name from role where id = ?', [$u->roleId]); return $u; 
    }
    , $users);

  return $users;
}

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
  if (is_array($body->participants)) {
    $ids = implode(',',array_map(function ($u) { $u = (object)$u; return $u->userId; }, $body->participants));
    $users = R::findAll(USER_BEAN, 'id in (?)', [$ids]);
    $event->sharedUserList = $users;
  }

  $id = R::store( $event );
  updateEventUsersRole($body->participants, $id);

  $response->getBody()->write($event->id);

  return $response->withHeader('Content-Type', 'application/json');
});

$app->put('/event', function (Request $request, Response $response, $args) {
  $body = $request->getBody()->getContents();
  $body = json_decode($body);
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
  if (is_array($body->participants)) {
    $userIDs = join(',',array_map(function ($u) { return $u->userId; }, $body->participants));
    $users = R::findAll(USER_BEAN, 'id in ('.$userIDs.')');
    $event->sharedUserList = $users;
  }
  $id = R::store( $event );
  updateEventUsersRole($body->participants, $id);
  $response->getBody()->write('ok');

  return $response->withHeader('Content-Type', 'application/json');
});

function updateEventUsersRole($users, $eventId) {
  foreach($users as $user) {
    R::exec('UPDATE event_user SET role_id = ? WHERE event_id = ? and user_id = ?',[$user->roleId, $eventId, $user->userId]);
  }
}

$app->delete('/event/{id}', function (Request $request, Response $response, $args) {
  $id = $request->getAttribute('id');
  R::hunt(EVENT_BEAN, ' id = ?', [$id]);
  $response->getBody()->write('ok');

  return $response->withHeader('Content-Type', 'application/json');
});