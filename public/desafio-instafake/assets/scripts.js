//Declara variable de página de la API
var apiIdRegister = 0

//Acceso a la API
const consult = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        //Almacenamiento local del token
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)

        if (token) {
            //Mostrar menú Feed-Logout y Botón "Ver más..."
            $('#feedLogout').removeClass('d-none').addClass('d-block')
            $('#idAddBtn').removeClass('d-none').addClass('d-block')
            return token
        } else {
            alert(`Usuario y/o password incorrecto(s)`)
        }
    }
    catch (error) {
        console.log(`Usuario y/o password incorrecto(s) [catch]: ${error}`)
        alert(`Usuario y/o password incorrecto(s): ${error}`)
    }
}

//Obtener datos de fotografías de la API
const getPhotos = async (jwt) => {
    try {
        console.log(apiIdRegister)
        const response = await fetch('http://localhost:3000/api/photos', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const { data } = await response.json()
        //Control de registros accesados
        console.log(data)
        //Prueba personal
        //console.log(data[id = 1].author)

        if (data) {
            fillCards(data)
        } else {
            //Elimina el JWT almacenado y vuelva la  aplicación a su estado inicial.
            localStorage.clear()
            console.log(`Se ha producido un error en fillCards: ${error}`)
        }
        return data
    }
    catch (error) {
        //Elimina el JWT almacenado y vuelva la  aplicación a su estado inicial.
        localStorage.clear()
        console.log(`Se ha producido un error en getPhotos [catch]: ${error}`)
    }
}

//Agrega fotografías y autor a Cards individuales
const fillCards = (dataCard) => {
    document.getElementById("js-form-wrapper").className = "col-md-6 d-none"

    for (let index = apiIdRegister; index <= apiIdRegister + 3; index++) {
        document.getElementById('photoCardsId').innerHTML += `

            <div class="card mt-3">
              <img src="${dataCard[id = index].download_url}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Autor: ${dataCard[id = index].author}</h5>
              </div>
            </div>`
    }
    document.getElementById("feedLogout").className = "col-md-8 my-3"
    //Actualiza elemento de control de flujo de fotografías
    apiIdRegister = apiIdRegister + 4
    //Control en consola
    console.log(`apiIdRegister: ${apiIdRegister}`)
}

//Elimina el JWT almacenado, vuelve la aplicación a su estado inicial y recarga la página
btnLogout.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})

//Agregar más fotos
btnAddPhoto.addEventListener('click', () => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
        getPhotos(token)
        console.log(`Accediendo a registros ${apiIdRegister} al ${apiIdRegister + 3}`)
    }
})

// Validando que existe JWT
const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        const data = await getPhotos(token)
    }
}
init()

$('#jsForm').submit(async (event) => {
    event.preventDefault()

    const email = document.getElementById('exampleInputEmail1').value
    const pass = document.getElementById('exampleInputPassword1').value

    //Control preventivo de acceso con email y password
    if (email != "" || pass != "") {
        const token = await consult(email, pass)
        const data = await getPhotos(token)
        console.log(token)
    } else {
        alert(`Debe ingresar su dirección de correo elecrónico y password.`)
    }
})
