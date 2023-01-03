const ClientError = require('../../exceptions/ClientError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsHandler {
    constructor(playlistSongsService, songsService, playlistsService, validator) {
        this._playlistSongsService = playlistSongsService;
        this._songsService = songsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
        this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    }

    async postPlaylistSongHandler(request, h) {
        try {
            this._validator.validatePlaylistSongPayload(request.payload);
            const { id: playlistId } = request.params;
            const { songId } = request.payload;
            const { id } = request.auth.credentials;

            await this._songsService.getSongById(songId);
            const owner = await this._playlistsService.getOwnerPlaylistById(playlistId);
            if (owner !== id) {
                throw new AuthorizationError('Anda tidak berhak menambahkan playlist');
            }
            // eslint-disable-next-line max-len
            const playlistSongId = await this._playlistSongsService.addPlaylistSong(playlistId, songId);

            const response = h.response({
                status: 'success',
                message: 'berhasil menambahkan lagu ke playlist',
                data: {
                  playlistSongId,
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

    async getPlaylistSongHandler(request, h) {
        try {
            const { id: playlistId } = request.params;
            const { id: owner } = request.auth.credentials;
            await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
            const playlists = await this._playlistsService.getPlaylistById(owner, playlistId);
            const songs = await this._songsService.getSongsByPlaylistId(playlistId);
            playlists.songs = songs;

            return {
                status: 'success',
                data: {
                    playlist: playlists,
                },
            };
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

    async deletePlaylistSongHandler(request, h) {
        try {
            this._validator.validatePlaylistSongPayload(request.payload);
            const { id: playlistId } = request.params;
            const { songId } = request.payload;
            const { id } = request.auth.credentials;

            await this._songsService.getSongById(songId);
            const owner = await this._playlistsService.getOwnerPlaylistById(playlistId);
            if (owner !== id) {
                throw new AuthorizationError('Anda tidak berhak menghapus lagu di playlist');
            }

            await this._playlistSongsService.deletePlaylistSong(songId);
            return {
                status: 'success',
                message: 'Lagu pada playlist berhasil dihapus',
            };
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
}

module.exports = PlaylistSongsHandler;