<!DOCTYPE html>
<html>
<head>
    <title>Bienvenid@ Octagono</title>
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
            <h1>Bienvenido, {{ $user->primer_nombre }}!</h1>
            <p>Hemos realizado tu registro como {{ $role->name }}  en la plataforma de {{ $institucion->tipo }} {{ $institucion->nombre }}.</p>
            <p>Por tu seguridad, se te obligará a cambiar esta contraseña al iniciar sesión por primera vez.</p>
            <a href="{{ $institucion->url }}/login/code/{{ $token }}">Ir a la plataforma</a>
        </div>
        <div class="footer">
            <p>Si tienes alguna pregunta, no dudes en contactarnos. Email: {{ $institucion->email }} - Teléfono: {{ $institucion->telefono }} </p>
            <p>¡Gracias por ser parte de nuestra comunidad educativa!</p>
        </div>
    </div>
</body>
</html>
