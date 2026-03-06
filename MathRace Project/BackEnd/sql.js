const mysql = require('mysql2/promise');
module.exports = { getUsuariInfoForLogin, registrarUsuari, getUsuariInfo, getAllAlumneClasse,getAllAlumneClassebyProfesor, obtenerRolUsuario, getProfessorInfo, getAlumneInfo, editarUsuario, GetUsuarios  };
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'math_race'
});


async function GetUsuarios(nomUsuari) {
    try {
        const query = `
            SELECT U.*, C.nom_classe
            FROM Usuari U
            LEFT JOIN Alumne_Classe AC ON U.idUsuari = AC.id_alumne
            LEFT JOIN Classe C ON AC.id_classe = C.id_classe OR U.idUsuari = C.id_professor
            WHERE U.nomUsuari = ?
        `;
        const [rows, fields] = await connection.execute(query, [nomUsuari]);
        console.log("Usuario y su clase encontrados:", JSON.stringify(rows));
        // Dado que nom_usuari es único, solo debe haber un resultado
        return rows[0];
    } catch (error) {
        console.error('Error al obtener información del usuario y su clase:', error.message);
        throw error;
    }
}

async function getUsuariInfoForLogin(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Usuari');
        const usuariosJSON = JSON.stringify(rows);
        console.log("Usuarios encontrados:", usuariosJSON);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener información de usuarios:', error.message);
        throw error;
    }
}
async function getUsuariInfo(connection, user) {
    try {
        const [rows, fields] = await connection.execute(`
            SELECT U.*, C.nom_classe
            FROM Usuari U
            LEFT JOIN Alumne_Classe AC ON U.idUsuari = AC.id_alumne
            LEFT JOIN Classe C ON AC.id_classe = C.id_classe
            WHERE U.nomUsuari = ?;
        `, [user]);
        const usuariosJSON = JSON.stringify(rows);
        console.log("a:" + usuariosJSON)
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}
async function obtenerRolUsuario(connection, username) {
    try {
        const [rows, fields] = await connection.execute(
            'SELECT rol FROM Usuari WHERE nomUsuari = ?',
            [username]
        );
        const rol = rows.length > 0 ? rows[0].rol : null;
        console.log("Rol:" + rol);
        return rol;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}
async function getProfessorInfo(connection, user) {
    try {
        const [rows, fields] = await connection.execute(`
        SELECT U.*, C.nom_classe
        FROM Usuari U
        LEFT JOIN Classe C ON U.idUsuari = C.id_professor
        WHERE U.nomUsuari = ? AND U.rol = 'Professor';
      `, [user]);
        const professors = JSON.stringify(rows);
        console.log("Professor Info:", rows);
        return professors; 
    } catch (error) {
        console.error('Error al obtener profesores:', error.message);
        throw error;
    }
}
async function getAlumneInfo(connection, user) {
    try {
        const [rows, fields] = await connection.execute(`
        SELECT U.*, C.nom_classe
        FROM Usuari U
        LEFT JOIN Alumne_Classe AC ON U.idUsuari = AC.id_alumne
        LEFT JOIN Classe C ON AC.id_classe = C.id_classe
        WHERE U.nomUsuari = ?;
      `, [user]);

        const alumnes = JSON.stringify(rows);
        console.log("Alumne Info:", rows);
        return alumnes; 
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}
async function getAllAlumneClasse(connection, user) {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Classe');
        const classes = JSON.stringify(rows);
        console.log(classes)
        return classes;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}

async function getAllAlumneClassebyProfesor(connection, nomUsuari) {
    try {
        const query = `
            SELECT U.nomUsuari, U.nomCogonoms, U.correu, C.nom_classe as nomClasse
            FROM Usuari U
            JOIN Alumne_Classe AC ON U.idUsuari = AC.id_alumne
            JOIN Classe C ON AC.id_classe = C.id_classe
            WHERE C.id_professor = (SELECT idUsuari FROM Usuari WHERE nomUsuari = ?);
        `;
        const [rows, fields] = await connection.execute(query, [nomUsuari]);

        const alumnos = rows.map(row => ({
            nomUsuari: row.nomUsuari,
            nomCogonoms: row.nomCogonoms,
            correu: row.correu,
            nomClasse: row.nomClasse
        }));

        console.log(alumnos);

        return alumnos;
    } catch (error) {
        console.error('Error al obtener alumnos:', error.message);
        throw error;
    }
}


async function editarUsuario(connection, usuario) {
    try {
        const { idUsuari, nomUsuari, nomCogonoms, correu, passwd, rol, nom_classe } = usuario;
        const [rows, fields] = await connection.execute(`
            UPDATE Usuari
            SET nomUsuari = ?, nomCogonoms = ?, correu = ?, passwd = ?, rol = ?
            WHERE idUsuari = ?;
        `, [nomUsuari || null, nomCogonoms || null, correu || null, passwd || null, rol || null, idUsuari]);
        console.log('Filas afectadas:', rows.affectedRows);

        if (rol === 'Alumne') {
            await connection.execute(`
                UPDATE Alumne_Classe
                SET id_classe = (SELECT id_classe FROM Classe WHERE nom_classe = ?)
                WHERE id_alumne = ?;
            `, [nom_classe, idUsuari]);
        } else if (rol === 'Professor') {
            await connection.execute(`
                UPDATE Classe
                SET id_professor = ?
                WHERE nom_classe = ?;
            `, [idUsuari, nom_classe]);
        }

        console.log(`Usuario ${idUsuari} actualizado con éxito.`);
    } catch (error) {
        console.error('Error al editar usuario:', error.message);
        throw error;
    }
}
async function registrarUsuari(connection, usuari, idClasse) {
    try {
        const { nomUsuari, nomCogonoms, correu, passwd, rol } = usuari;
        const [result] = await connection.execute(
            'INSERT INTO Usuari (nomUsuari, nomCogonoms, correu, passwd, rol) VALUES (?, ?, ?, ?, ?)',
            [nomUsuari, nomCogonoms, correu, passwd, rol]
        );
        if (result.affectedRows === 1) {
            const idUsuari = result.insertId;
            if (rol === 'Alumne') {
                const [insertResult] = await connection.execute(
                    'INSERT INTO Alumne_Classe (id_alumne, id_classe) VALUES (?, ?)',
                    [idUsuari, idClasse]
                );
                if (insertResult.affectedRows !== 1) {
                    console.error('Error al insertar en Alumne_Classe:', insertResult.message);
                }
            }
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al insertar usuari:', error.message);
        throw error;
    }
}



