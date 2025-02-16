let cartOverlay = document.getElementById("cartDetails");
cartOverlay.addEventListener("click", updateQuantity);

if (!localStorage.getItem("Promo")) {
    localStorage.setItem("Promo", JSON.stringify({
        "ostad10": false,
        "ostad5": false
    }));
}


document.addEventListener('DOMContentLoaded', loadData);



function loadData() {
    loadProducts();
    updateCounter();
}


function loadProducts() {
    fetch("data.json")
        .then(response => response.json())
        .then(jsondata => {
            // test(data);
            data = jsondata;
            showProducts(data);
        })
}


function showProducts(data) {
    let list = document.getElementById("productList");
    data.forEach(product => {
        let item = document.createElement("div");
        item.classList.add("card");
        item.innerHTML = `
            <img src="${product.img}" class="card-img-top p-2 border mt-2 object-fit-contain" alt="${product.title} image">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">৳ ${product.price}</span>
                        <span onclick="addToCart(${product.id}, '${product.title}', '${product.img}', ${product.price})" class="btn btn-danger">Add to cart</span>
                    </div>
                </div>
        `
        list.appendChild(item);
    });
}








function addToCart(id, title, img, price){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let found = false;
    let newCart = [];
    let newQuantity = 1;
    cart.forEach(item => {
        if(item.id == id){
            found = true;
            newQuantity = Number(item.quantity)+1;
        }
        else{
            newCart.push(item);
        }
    });

    newCart.unshift({id: id, title:title, img:img, price:price, quantity: newQuantity});
    localStorage.setItem("cart", JSON.stringify(newCart));
    updateCounter();

    openCart();
}


function exitCart(){
    let blur = document.getElementById("blur");
    blur.classList.add("hidden");
    let cartDetails = document.getElementById("cartDetails");
    cartDetails.classList.add("hidden");
}





function openCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartList = document.getElementById("cartList");

    let cartDetails = document.getElementById("cartDetails");
    let blur = document.getElementById("blur");
    blur.classList.remove("hidden");
    cartList.innerHTML = '';
    cartDetails.classList.remove("hidden");
    
    cart.forEach(item => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("border-top", "w-100", "d-flex");
        cartItem.innerHTML = `
        <div class="col-3 cartImg d-flex justify-content-center align-items-center">
        <img class="img-fluid rounded-3" src="${item.img}" alt="">
        </div>
        <div class="col-3 d-flex align-items-center justify-content-center"><span class="cartCol">${item.title}</span></div>
                <div class="col-2 d-flex align-items-center justify-content-center">
                    <input type="number" oninput="updateQuantity(this, ${item.id})" min="1" class="text-center rounded-3 quantityInput" value="${item.quantity}">
                </div>
                <div class="col-3 d-flex align-items-center justify-content-center"><span class="cartCol">৳ ${item.price}</span></div>
                <div class="col-1 d-flex align-items-center"><i onclick="deleteFromCart(${item.id}, this)" class="fa-solid fa-trash p-2 rounded-3 text-danger"></i></div>
        `     
        cartList.appendChild(cartItem);  
    });
}




function deleteFromCart(id, element){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let newCart = [];
    cart.forEach(item => {
        if(item.id == id){}
        else{
            newCart.push(item);
        }
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    let cartItem = element.parentElement.parentElement;
    cartItem.remove();
    if(newCart.length<1){
        
    }
}




function updateQuantity(input, id){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let newCart = [];

    if(input.value<1){
        input.value = 1;
    }
    for(let i=0;i<cart.length;i++){
        if(cart[i].id == id) cart[i].quantity = input.value;
        newCart.push(cart[i]);
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    updateCounter();
}



// function updateCounter(){
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];
//     let counter = 0;
//     let price = 0;
//     cart.forEach(item => {
//         counter += Number(item.quantity);
//         price+= (Number(item.price)*Number(item.quantity));
//     });

//     // let count = document.getElementById("cartItemCounter");
//     // let totalQuantity = document.getElementById("totalQuantity");
//     // // let totalPrice = document.getElementById("totalPrice");
//     // // count.innerText = counter;
//     // // totalQuantity.innerText = counter;
//     // // let discount = applyDiscount();
//     // let totalPrice = applyDiscount();
//     // totalPrice.innerText = "৳"+price;

//     let count = document.getElementById("cartItemCounter");
//     let totalQuantity = document.getElementById("totalQuantity");
//     let totalPrice = document.getElementById("totalPrice");
//     count.innerText = counter;
//     totalQuantity.innerText = counter;
//     totalPrice.innerText = "৳"+price;
// }

function updateCounter() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let counter = 0;
    let price = 0;

    cart.forEach(item => {
        counter += Number(item.quantity);
        price += (Number(item.price) * Number(item.quantity));
    });

    let count = document.getElementById("cartItemCounter");
    let totalQuantity = document.getElementById("totalQuantity");
    let totalPrice = document.getElementById("totalPrice");
    let discountedPrice = document.getElementById("discountedPrice");

    count.innerText = counter;
    totalQuantity.innerText = counter;

    // Apply discount and update price
    
    let newPrice = applyDiscount(price);
    totalPrice.innerText = "৳" + price;
    discountedPrice.innerText = "৳" + newPrice;
}





function clearCart(){
    localStorage.setItem("cart", "[]")
    let cartList = document.getElementById("cartList");
    cartList.innerHTML = "";
}





function promoValidation() {
    let promos = JSON.parse(localStorage.getItem("Promo")) || {};
    let input = document.getElementById("promocode");
    let value = input.value.trim(); // Trim spaces for extra safety
    let discount = 0;

    if (!(value in promos)) {
        alert("Invalid promo code");
        return;
    }

    if (promos[value] === true) {
        alert("Promo code already used");
        return;
    }

    if (value === "ostad10") {
        discount = 10;
    } else if (value === "ostad5") {
        discount = 5;
    }

    promos[value] = true; // Mark promo as used
    localStorage.setItem("Promo", JSON.stringify(promos));

    alert(`Promo code applied! You get ${discount}% off.`);
    updateCounter(); // Update cart totals immediately
}


function applyDiscount(subtotal) {
    let promos = JSON.parse(localStorage.getItem("Promo")) || [];
    let discount = 0;
    if(promos.ostad10 == true) discount+=10;
    if(promos.ostad5 == true) discount+=5;
    
    let total = subtotal-(subtotal*discount/100);
    if(total<0) total = 0;
    return total;
}
