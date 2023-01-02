const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePostPlaylistPayload(request.payload);
            const { name } = request.payload;
            const { id: owner } = request.auth.credentials;

            const playlistId = await this._service.addPlaylist(name, owner);

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                  playlistId,
                },
              });
              response.code(201);
              return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistHandler(request) {
        const { id: owner } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(owner);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }
}

module.exports = PlaylistsHandler;