const BASE_URL = "http://localhost:3788";
export async function getUsuarios() {
  try {
      const response = await fetch(BASE_URL + '/usuaris');
      const usuarios = await response.json();
      return usuarios;
  } catch (error) {
      console.error(`Error al obtener la lista de usuarios: ${error}`);
  }
}

export async function registrarUsuarioLogin(newUser, id) {
  try {
      const response = await fetch(BASE_URL + '/registrar', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newUser, id }),
      });
      const result = await response.json();
      return result;
  } catch (error) {
      console.error(`Error al registrar usuario: ${error}`);
  }
}


export async function getPreguntes() {
    const response = await fetch(BASE_URL + '/getPreguntas');
    const result = await response.json();
    return result;
}

export async function getGraficos() {
  try {
      const response = await fetch(BASE_URL + '/getPython');
      const graficos = await response.json();
      return graficos;
  } catch (error) {
      console.error(`Error al obtener los gráficos: ${error}`);
  }
}

export async function updateUsuarioInfo(usuarioInfo) {
    try {
      console.log('Actualizar información del usuario:', usuarioInfo);
      const response = await fetch(BASE_URL + '/editarUsuario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioInfo),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error.message);
    }
  }
  export async function getClases() {
    try {
      const response = await fetch(BASE_URL + '/clases');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const usuarios = await response.json();
      return usuarios;
    } catch (error) {
      console.error('Error al obtener la lista de clases:', error.message);
    }
  }
  export async function getUsuaris() {
    try {
      const response = await fetch(BASE_URL + '/usuaris');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const usuarios = await response.json();
      return usuarios;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error.message);
    }
  }
  
  export async function registrarUsuario(usuarioInfo) {
    try {
      const response = await fetch(BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioInfo),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      if (result.success) {
        console.log('Usuario registrado exitosamente');
      } else {
        console.error('Error al registrar usuario');
      }
      return result; // Añade esta línea
    } catch (error) {
      console.error('Error en el servidor:', error.message);
    }
  }
  
  export async function getDadesUsuari(username, rol) {
    try {
      const response = await fetch(`${BASE_URL}/dadesUsuari/${username}/${rol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error.message);
    }
  }
  
  export async function getRolUsuario(username) {
    try {
      const response = await fetch(`${BASE_URL}/obtenerRol/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.rol;
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error.message);
    }
  }
  
  export async function updatePreguntaAcertada(id, acertada) {
    try {
      const response = await fetch(`${BASE_URL}/updatePreguntasAcertar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acertada }), // Enviar el booleano como objeto JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar la pregunta:', error.message);
    }
  }