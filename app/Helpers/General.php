<?php

if (! function_exists('flashSuccess')) {
    function flashSuccess($message): void
    {
        session()->flash('notify', [
            'type' => 'success',
            'message' => $message,
        ]);
    }
}

if (! function_exists('flashDanger')) {
    function flashDanger($message): void
    {
        session()->flash('notify', [
            'type' => 'danger',
            'message' => $message,
        ]);
    }
}

if (! function_exists('flashWarning')) {
    function flashWarning($message): void
    {
        session()->flash('notify', [
            'type' => 'warning',
            'message' => $message,
        ]);
    }
}

if (! function_exists('flashInfo')) {
    function flashInfo($message): void
    {
        session()->flash('notify', [
            'type' => 'info',
            'message' => $message,
        ]);
    }
}
