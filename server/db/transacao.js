/**
 * Executar um comando SQL numa conexão definida.
 * @author Edizon
 */

exports.executarTransacao = function(pool, cmd, onError) {
    pool.getConnection(function(err, conn) {
        try {
            conn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                cmd(conn);
                conn.commit(function (err) {
                    if (err) {
                        return conn.rollback(function () {
                            throw err;
                        });
                    }
                });
            });

        } catch (err) {
            if (onError != null) {
                onError(err);
            }
            return conn.rollback(function() {
               throw err;
            });
        }
        conn.release();
    });
};
