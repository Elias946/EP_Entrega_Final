//cargamos todo las clases
import { user as User, user } from "./User.js";
import { product as Product } from "./Products.js";
import table from './cart.js'
let users = [];

//precargamos el login
document.addEventListener("DOMContentLoaded", function () {
  // console.log(sessionStorage.getItem('user'))

  if (sessionStorage.getItem("user") != null) {
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("registerButton").style.display = "none";
    let user = `
    <li class="nav-item">
      <a class="nav-link" href="#" id="">
        Bienvenido 
          <b>
            ${JSON.parse(sessionStorage.getItem("user")).email}
          </b>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#" id="ShowCart" >
        Cart
      </a>
    </li>
    `;
   
    document.getElementById("udid").innerHTML = user;

    LoadBody();
    document.getElementById("ShowCart").addEventListener("click", ShowCart);
    
  } else {
    loginForm();
  }
});




document.addEventListener("submit", function (e) {
  e.preventDefault();

  //escuchamos todos los submits luego de que el submit se detiene targeteamos el formulario y creamos un objeto mapeando cada item seleccionado
  const formulario = e.target;
  const formData = new FormData(formulario);

  const Item_Cuantity = formData.get("selector");
  const Id_Item = formulario.querySelector('select[name="selector"]').id;

  AddProductToCart(Id_Item, Item_Cuantity);

});
function ShowCart(){
  document.getElementById("contenido").innerHTML = table;
  let items = JSON.parse(localStorage.getItem("Myshop"));
  let html = ''
  items.forEach((i) =>{
    html += `
            <tr>
              <td><img src="${i.img}"></td>
              <td>${i.name}</td>
              <td>$${i.price}</td>
              <td>
                <form>
                  <input type="number" value="${i.quantity}">
                </form>
              </td>
              <td>
                <button class="btn btn-danger" type="submit" id="${i.id}" >X</button>
              </td>
            </tr>`
  })
  document.getElementById("tablaProductos").innerHTML = html;

  document.getElementById('tablaProductos').addEventListener('click', function(e) {
    // Verificar si el elemento clicado es un botón
    if (e.target.tagName === 'BUTTON') {
        // Obtener el ID del botón clicado
        const idDelBoton = e.target.id;

        let items = JSON.parse(localStorage.getItem("Myshop"))

        items = items.filter(objeto => objeto.id !== Number(idDelBoton));

        localStorage.setItem("Myshop",JSON.stringify(items))

        ShowCart();
       
    }
  });
}


//agregamos el producto al carrito
async function AddProductToCart(id, quantity) {
  let products= [];
  let product = await fetch(`https://dummyjson.com/products/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error on red: ${res.status}`);
      }
      return res.json();
    })
    .then((pr) => {
      return new Product(pr.id, pr.title, pr.price, pr.stock, pr.thumbnail);
    })
    .catch((err) => {
      console.log(err);
    });
    product.quantity = quantity;
    products.push(product);

    //guardamos el item en el local storage
    if(!localStorage.getItem("Myshop")){
      localStorage.setItem("Myshop",JSON.stringify(products))
    }else{
      
      let items = JSON.parse(localStorage.getItem("Myshop")).map((i) => {
        let pr = new Product(i.id,i.name,i.price,i.stock,i.img)
        pr.quantity = i.quantity;
        return pr;
      })

      items.push(product)

      items = items.reduce((arr, obj) => {
        const encontrado = arr.find(item => item.id === obj.id);
      
        if (encontrado) {
          // Sumar las cantidades si ya existe un objeto con el mismo id
          encontrado.quantity = String(Number(encontrado.quantity) + Number(obj.quantity));
        } else {
          // Agregar el objeto si no existe un objeto con el mismo id
          arr.push({ ...obj });
        }
      
        return arr;
      }, []);
      console.log(items)

      localStorage.setItem("Myshop",JSON.stringify(items))
    }

}
//carga un body en funcion de si esta logeado
async function LoadBody() {
  let productos = [];
  await fetch(`https://dummyjson.com/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error on red: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      productos = data.products.map(
        (pr) => new Product(pr.id, pr.title, pr.price, pr.stock, pr.thumbnail)
      );
    })
    .catch((err) => {
      console.log(err);
    });

  let bodyproducts = "";
  productos.forEach((pr) => {
    bodyproducts += `<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <div class="card border-0 rounded-0 shadow ">
              <img src="${pr.img}" class="card-img-top rounded-0" alt="...">
              <div class="card-body mt-3 mb-3">
                  <div class="row">
                      <div class="col-10">
                          <h4 class="card-title">${pr.name}</h4>
                          <p class="card-text">
                              ${pr.name}
                          </p>
                      </div>
                      <div class="col-2">
                          <i class="bi bi-bookmark-plus fs-2"></i>
                      </div>
                  </div>
              </div>
              <div class="row align-items-center text-center g-0">
                  <div class="col-4">
                      <h5>$${pr.price}</h5>
                  </div>
                  <form id="" class="col-8 d-flex align-items-center justify-content-center">
                  <div class="col-6"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M5 8h0m0 4h0m0 4h0"/>
                </svg>
                ${pr.stock}
                <select id="${pr.id}" name="selector"> 
                ${getSelector(pr.stock)}
                </select>
              </div>
              <div class="col-6">
                  <button  type="submit" class="btn btn-dark w-100 p-3 rounded-0 text-warning"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7H7.3"/>
                </svg>
                </button>
              </div>
                  </form>
              </div>
          </div>
        </div>`;
  });
  document.getElementById("contenido").innerHTML = bodyproducts;
}
//Precarga la canitdad de stock de los productos para cada formulario
function getSelector(stock) {
  let options = "";
  if (stock > 10) {
    for (let i = 1; i < 11; i++) {
      options += `<option value="${i}">${i}</option>`;
    }
    return options;
  }

  for (let i = 1; i < stock + 1; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}
/*LOGIN FORM*/
function loginForm() {
  let loginForm = `<form id="forms">
    <div class="mb-3 row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
    <div class="col-sm-10">
        <input type="text" class="form-control" id="inputUser">
    </div>
    </div>
    <div class="mb-3 row">
    <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword">
    </div>
    </div>
    <div class="mb-3 row col-12 mx-auto">
    <button type="submit" id="loginSubmit" class="btn btn-info ">login</button>
    </div>
  </form>`;

  document.getElementById("contenido").innerHTML = loginForm;

  document
    .getElementById("loginSubmit")
    .addEventListener("click", function (e) {
      let form = document.getElementById("forms");
      const InsertError = form.querySelectorAll(".mb-3");

      e.preventDefault();
      let email = document.getElementById("inputUser").value;
      let pw = document.getElementById("inputPassword").value;
      let currentUser = ValidarEmailLogin(email);
      pw = ValidarPassword(pw);

      ///USAMOS JSON Y STORAGE
      if (currentUser == null) {
        messError(
          `No existe  cuenta con el email: ${email} por favor intenta nuevamente `,
          InsertError[0]
        );
      } else if (pw === currentUser.password) {
        sessionStorage.setItem("user", JSON.stringify(currentUser));
        location.reload();
      }
    });
}
//botones de login en navbar
document.getElementById("loginButton").addEventListener("click", loginForm);
document
  .getElementById("registerButton")
  .addEventListener("click", registerForm);

/*register FORM*/
function registerForm() {
  let registerForm = `<form id="forms">
  <div class="mb-3 row">
  <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
  <div class="col-sm-10">
      <input type="text" class="form-control" id="inputUser">
  </div>
  </div>
  <div class="mb-3 row">
  <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
  <div class="col-sm-10">
    <input type="password" class="form-control" id="inputPassword">
  </div>
  </div>
  <div class="mb-3 row col-12 mx-auto">
  <button type="submit" id="registerSubmit" class="btn btn-warning  ">register</button>
  </div></form>`;
  document.getElementById("contenido").innerHTML = registerForm;

  document
    .getElementById("registerSubmit")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let email = document.getElementById("inputUser").value;
      let pw = document.getElementById("inputPassword").value;

      email = ValidarEmail(email);
      pw = ValidarPassword(pw);

      if (email != null && pw != null) {
        const newUser = new User(email, pw);
        users.push(newUser);
        loginForm();
      }
    });
}

//Validamos el Email para el Login
function ValidarEmailLogin(email) {
  let form = document.getElementById("forms");
  const InsertError = form.querySelectorAll(".mb-3");

  if (email.length == 0) {
    messError(
      "el email del usuario no puede estar vacio por favor intente nuevamente",
      InsertError[0]
    );
    return null;
  }
  let userReturn;

  users.forEach((user) => {
    if (email == user.email) {
      userReturn = user;
    }
  });

  return userReturn ?? null;
}

function ValidarEmail(email) {
  ///// busco el primer elemento de mi formulario mediante la clase y a ese elemento si aparece un error le mostrare un mensaje por chat
  let form = document.getElementById("forms");
  const InsertError = form.querySelectorAll(".mb-3");

  if (email.length == 0) {
    messError(
      "el email del usuario no puede estar vacio por favor intente nuevamente",
      InsertError[0]
    );
  } else if (users.length != 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) {
        messError(
          `ya existe una cuenta existente con el email ${email} por favor intente nuevamente`,
          InsertError[0]
        );
        return null;
      }
      return email;
    }
  } else {
    return email;
  }
  return null;
}

function ValidarPassword(pw) {
  let form = document.getElementById("forms");
  const InsertError = form.querySelectorAll(".mb-3");
  if (pw != 0) {
    return pw;
  }
  messError(
    "el password no puede estar vacio \ningrese el password",
    InsertError[0]
  );
}

function messError(msg, element) {
  let Div_err = document.createElement("div");
  Div_err.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  element.insertAdjacentElement("beforebegin", Div_err);
}
