<?php
use Slim\Factory\AppFactory;
use Slim\Exception\HttpNotFoundException;

error_reporting(E_ALL);
set_error_handler(function ($severity, $message, $file, $line) {
    if (error_reporting() & $severity) {
        throw new \ErrorException($message, 0, $severity, $file, $line);
    }
});


if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

require __DIR__ . '/vendor/autoload.php';

session_start();

// Instantiate the app
require __DIR__ . '/src/config.php';
$settings = require __DIR__ . '/src/settings.php';

$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);
$app->setBasePath("/voxdomini/api");

// Set up dependencies
require __DIR__ . '/src/dependencies.php';

// Register middleware
require __DIR__ . '/src/middleware.php';

// Models
require __DIR__ . '/src/models/event_user.php';

// Register routes
require __DIR__ . '/src/routes/tests.php';
require __DIR__ . '/src/routes/events.php';
require __DIR__ . '/src/routes/resources.php';
require __DIR__ . '/src/routes/users.php';
require __DIR__ . '/src/routes/roles.php';

// Catch-all route to serve a 404 Not Found page if none of the routes match
// NOTE: make sure this route is defined last
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
  });

// Run app
$app->run();
