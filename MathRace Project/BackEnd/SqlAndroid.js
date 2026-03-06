module.exports = {getUsuarisLoginAndroid,registrarUsuariAndroid,getClases,updateClaseProfe,insertClase};

//Login
async function getUsuarisLoginAndroid(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT idUsuari, nomUsuari, passwd FROM Usuari');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}

//Registrar
async function registrarUsuariAndroid(connection, usuari){
    try {
        // INSERT
        console.log(usuari)
        const { nomUsuari, nomCogonoms, correu, passwd, rol } = usuari;
        const [result] = await connection.execute(
            'INSERT INTO Usuari (nomUsuari, nomCogonoms, correu, passwd, rol) VALUES (?,?,?,?,?)',
            [nomUsuari, nomCogonoms, correu, passwd, rol]
        );

        // Casos Error
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al insertar usuari:', error.message);
        throw error;
    }
}

async function getClases(connection) {
    try {
        const [clases] = await connection.execute('SELECT nom_classe FROM Classe');
        return clases.map(clase => ({ nom_classe: clase.nom_classe }));
    } catch (error) {
        console.error('Error al obtener clases:', error.message);
        throw error;
    }
}


async function insertClase(connection, nomClase) {
    try {
        // Verificar si la clase ya existe
        const [existingClasseResult] = await connection.execute('SELECT id_classe FROM Classe WHERE nom_classe = ?', [nomClase]);

        if (existingClasseResult.length > 0) {
            console.log(`La clase ${nomClase} ya existe en la base de datos`);
            return { success: false, message: `La clase ${nomClase} ya existe en la base de datos` };
        }

        // Insertar la nueva clase
        const [insertResult] = await connection.execute('INSERT INTO Classe (nom_classe) VALUES (?)', [nomClase]);

        // Verificar si la inserción se realizó con éxito
        if (insertResult.affectedRows !== 1) {
            throw new Error(`No se pudo insertar la clase ${nomClase} en la base de datos`);
        }

        console.log(`Se insertó correctamente la clase ${nomClase} en la base de datos`);

        return { success: true };
    } catch (error) {
        console.error('Error al insertar la clase en la base de datos:', error.message);
        throw error;
    }
}



async function updateClaseProfe(connection, idUsuario, nomNuevaClase) {
    try {
        const idUsuari = idUsuario;

        const [classeActualResult] = await connection.execute('SELECT id_classe FROM Classe WHERE nom_classe = ?', [nomNuevaClase]);

        // Desasignar la clase actual (si la tiene)
        if (classeActualResult.length === 1) {
            await connection.execute('UPDATE Classe SET id_professor = NULL WHERE id_professor = ?', [idUsuari]);
        }

        // Obtener el id_classe correspondiente al nomNuevaClase
        const [nuevaClaseResult] = await connection.execute('SELECT id_classe FROM Classe WHERE nom_classe = ?', [nomNuevaClase]);

        // Verificar si se encontró la nueva clase con el nombre dado
        if (nuevaClaseResult.length === 0) {
            throw new Error(`No se encontró ninguna clase con el nombre ${nomNuevaClase}`);
        }

        const idNuevaClase = nuevaClaseResult[0].id_classe;

        // Asignar la nueva clase al profesor
        await connection.execute('UPDATE Classe SET id_professor = ? WHERE id_classe = ?', [idUsuari, idNuevaClase]);

        console.log(`Se cambió correctamente la clase para el usuario ${idUsuari} a ${nomNuevaClase}`);

        return { success: true };
    } catch (error) {
        console.error('Error al cambiar la clase del usuario:', error.message);
        throw error;
    }
}




