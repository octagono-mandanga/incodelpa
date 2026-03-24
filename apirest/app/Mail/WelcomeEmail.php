<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token;
    public $institucion;
    public $role;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $token, $institucion, $role)
    {
        $this->user = $user;
        $this->token = $token;
        $this->institucion = $institucion;
        $this->role = $role;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address(
                config('services.resend.from_email', config('mail.from.address')),
                config('services.resend.from_name', config('mail.from.name'))
            ),
            subject: 'Bienvenido a Nuestra Aplicación',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
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
