<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/auth/token', function (Request $request, Response $response, $args) {
    //$response->getBody()->write(json_encode(__DIR__));
    $token = file_get_contents(__DIR__.DS.'..'.DS.'..'.DS.'data'.DS.'token.txt');
    $response->getBody()->write(json_encode($token));
    return $response->withHeader('Content-Type', 'application/json');

});

$app->get('/user/{id}', function (Request $request, Response $response, $args) {
    $id = $request->getAttribute('id');
    R::useExportCase('camel');
    $user = R::findOne( USER_BEAN, 'id = ? or email = ? or auth0_user_id = ?', [$id,$id,$id]);
    $response->getBody()->write(json_encode($user));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/users', function (Request $request, Response $response, $args) {
    $body = $request->getBody()->getContents();
    $aAuth0Users = json_decode($body);
  
/*    $event = R::dispense(USER_BEAN);
    $event->title = $body->title;
    $event->description = $body->description;
    $event->start = $body->start;
    $event->end = $body->end;
    $event->resourceId = $body->resourceId;
    $event->bgColor = $body->bgColor;
    $id = R::store( $event );*/
    if (is_array($aAuth0Users)) {
        foreach($aAuth0Users as $auth0User) {
            $user = R::findOne(USER_BEAN, 'auth0_user_id = ?',[$auth0User->user_id]);
            if ($user) {
                //print_r($auth0User);
                //print_r($user);
                $user->email = $auth0User->email;
                $user->name = $auth0User->name;
                $user->nickname = $auth0User->nickname;
                $user->picture = $auth0User->picture;
                R::store( $user );
            } else {
                $user = R::dispense(USER_BEAN);
                $user->auth0_user_id = $auth0User->user_id;
                $user->email = $auth0User->email;
                $user->name = $auth0User->name;
                $user->nickname = $auth0User->nickname;
                $user->picture = $auth0User->picture;
                R::store( $user );
            }

        }
    }

    $response->getBody()->write($body);
  
    return $response->withHeader('Content-Type', 'application/json');
  });