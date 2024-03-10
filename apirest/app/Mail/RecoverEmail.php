<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class RecoverEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token; // Usaremos un token en lugar de una contraseña
    public $institucion;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $token, $institucion)
    {
        $this->user = $user;
        $this->token = $token;
        $this->institucion = $institucion;
    }

    public function build()
    {
        return $this->from('info@gi2t.org', 'Plataforma Octagono')
                    ->subject('Recuperación de Contraseña')
                    ->view('emails.recover') // Asegúrate de tener esta vista
                    ->with([
                        'user' => $this->user,
                        'token' => $this->token,
                        'institucion' => $this->institucion,
                    ]);
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recuperación de Contraseña',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.recover',
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
