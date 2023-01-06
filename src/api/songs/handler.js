const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongsByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongsByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongsByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongsPayload(request.payload);
            const {title = 'untitled', year, genre, performer,duration,albumId,} = request.payload;
            const songId = await this._service.addSongs({title,year, genre, performer, duration,albumId, });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                  songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            console.log(error);
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

    async getSongsHandler() {
        const {title ='',performer = '',} = query  
        const songs = await this._service.getSongs({title,performer});
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async getSongsByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const songs = await this._service.getSongsById(id);
            songs.year = parseInt(songs.year);
            songs.duration = parseInt(songs.duration);
            return {
                status: 'success',
                data: {
                    songs,
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

    async putSongsByIdHandler(request, h) {
        try {
            this._validator.validateSongsPayload(request.payload);
            const { id } = request.params;

            await this._service.editSongsById(id, request.payload);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
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

    async deleteSongsByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteSongsById(id);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
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

module.exports = SongsHandler;