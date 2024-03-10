<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event)
    {
        DB::table('login_attempts')->insert([
            'id' => Str::uuid(),
            'user_id' => $event->user->id,
            'success' => 'yes',
            'ip' => request()->ip(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
