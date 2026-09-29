<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\SellerMiddleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'seller' => SellerMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Send all exceptions to Sentry for real-time error tracking
        $exceptions->reportable(function (\Throwable $e) {
            if (app()->bound('sentry')) {
                // Attach the authenticated user so Sentry shows WHO was affected
                /** @var \App\Models\User|null $user */
                $user = request()->user();
                if ($user) {
                    \Sentry\configureScope(function (\Sentry\State\Scope $scope) use ($user): void {
                        $scope->setUser([
                            'id' => $user->id,
                            'email' => $user->email,
                            'username' => $user->name,
                        ]);
                    });
                }

                \Sentry\captureException($e);
            }
        });
    })->create();
