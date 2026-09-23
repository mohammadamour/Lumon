<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * The Order model is passed in so the email template
     * can display line items, totals, and shipping info.
     */
    public function __construct(
        public User $user,
        public Order $order,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Lumon Order #' . $this->order->id . ' is Confirmed!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.order-confirmed',
            with: [
                'user' => $this->user,
                'order' => $this->order,
                'items' => $this->order->items,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
