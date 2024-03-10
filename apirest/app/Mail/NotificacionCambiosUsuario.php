<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificacionCambiosUsuario extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $institucion;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $institucion)
    {
        $this->user = $user;
        $this->institucion = $institucion;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notificacion Cambios Usuario',
        );
    }


    public function build()
    {
      return $this->from('info@gi2t.org', 'Plataforma Octagono')
                ->subject('Cambios en tu Cuenta')
                ->view('emails.cambiosCuenta') // Asegúrate de tener esta vista
                ->with([
                        'user' => $this->user,
                        'institucion' => $this->institucion,
                    ]);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.cambiosCuenta',
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
