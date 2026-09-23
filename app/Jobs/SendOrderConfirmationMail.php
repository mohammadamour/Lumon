<?php

namespace App\Jobs;

use App\Mail\OrderConfirmed;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendOrderConfirmationMail implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     * If the mail server is temporarily down, Laravel will retry
     * up to 3 times before marking the job as "failed".
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     * This prevents hammering a struggling mail server.
     */
    public int $backoff = 30;

    /**
     * Create a new job instance.
     *
     * Laravel automatically serializes these Eloquent models
     * into the queue payload (storing only their IDs), and
     * re-fetches them from the database when the worker
     * picks up the job. This is the "SerializesModels" magic.
     */
    public function __construct(
        public User $user,
        public Order $order,
    ) {}

    /**
     * Execute the job.
     *
     * This method runs in the background, completely separate
     * from the original HTTP request. The user has already
     * received their "order confirmed" response by now.
     */
    public function handle(): void
    {
        Log::info("Processing order confirmation email for Order #{$this->order->id} to {$this->user->email}");

        Mail::to($this->user->email)->send(
            new OrderConfirmed($this->user, $this->order)
        );

        Log::info("Order confirmation email sent successfully for Order #{$this->order->id}");
    }

    /**
     * Handle a job failure.
     *
     * If all retry attempts are exhausted, this method is called.
     * In production, you would alert your team via Slack or a
     * monitoring service like Sentry.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Failed to send order confirmation email for Order #{$this->order->id}: {$exception->getMessage()}");
    }
}
