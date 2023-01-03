const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSong(playlistId, songId) {
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Gagal menambahkan lagu ke playlist');
        }

        return result.rows[0].id;
    }

    async deletePlaylistSong(songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE song_id = $1',
            values: [songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu di playlist gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = PlaylistSongsService;