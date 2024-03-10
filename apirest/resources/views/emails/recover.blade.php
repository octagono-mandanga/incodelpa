<!DOCTYPE html>
<html>
<head>
    <title>Recuperación de Contraseña</title>
    <!-- Incluye tus estilos aquí -->
    <style type="text/css">
        body {
            font-family: 'Arial', sans-serif;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f7f7f7;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: block;
            margin: 0 auto 20px auto;
            width: 100px;
        }
        .content {
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8em;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="{{ url('/images/logo.png') }}" alt="Logo" class="logo">
        <div class="content">
            <h1>Hola, {{ $user->primer_nombre }}!</h1>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Por favor, utiliza el siguiente enlace para establecer una nueva contraseña</p>
            <a href="{{ $institucion->url }}/login/code/{{ $token }}">Ir a la plataforma</a>
            <p>Si no has solicitado esto, por favor ignora este correo electrónico.</p>
        </div>
        <div class="footer">
            <p>Si tienes alguna pregunta, no dudes en contactarnos. Email: {{ $institucion->email }} - Teléfono: {{ $institucion->telefono }}</p>
            <p>¡Gracias por ser parte de nuestra comunidad!</p>
        </div>
    </div>
</body>
</html>
