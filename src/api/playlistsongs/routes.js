const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;