

const money = n => "₦" + n.toLocaleString("en-NG");
function getCart(){
    return JSON.parse(localStorage.getItem("novara-cart")||"[]")
}
    

function saveCart(c){
    localStorage.setItem("novara-cart",JSON.stringify(c));
    updateBadge()
}


function updateBadge(){
    const n=getCart().reduce((s,x)=>s+x.qty,0);
    document.querySelectorAll(".cart-count").forEach(e=>e.textContent=n)
}


function toast(msg){
    let t=document.querySelector(".toast");
    if(!t)return;
    t.textContent=msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2200)
}


function productCard(p){
 return `<article class="product-card reveal"><a href="product.html?id=${p.id}"><div class="product-image"><img src="${p.img}" alt="${p.name}"><span class="tag">${p.tag}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.category}</p><div class="price">${money(p.price)}</div></div></a></article>`
}
function renderFeatured(){
 const el=document.querySelector("#featured"); if(el) el.innerHTML=PRODUCTS.slice(0,4).map(productCard).join("");
}
function renderShop(){
 const el=document.querySelector("#shop-grid"); if(!el)return;
 let active="All";
 const draw=()=>{
    let list=active==="All"?PRODUCTS:PRODUCTS.filter(p=>p.category===active);el.innerHTML=list.map(productCard).join("");
     observe();};


 document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
    document.querySelector(".filter.active")?.classList.remove("active");
    b.classList.add("active");
    active=b.dataset.filter;
    draw()}));

 document.querySelector("#sort")?.addEventListener("change",e=>{let list=active==="All"?[...PRODUCTS]:PRODUCTS.filter(p=>p.category===active);
    if(e.target.value==="low")list.sort((a,b)=>a.price-b.price);
    if(e.target.value==="high")list.sort((a,b)=>b.price-a.price);
    el.innerHTML=list.map(productCard).join("");
    observe()});
 draw();
}


const PRODUCTS = [
 {id:1,name:"Linen Relaxed Shirt",category:"Men",price:39000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgBU7TAyhqSIK37-GUyrLBLYnQymJW7xtRcHaL3r4d9w&s=85",tag:"New"},
 {id:2,name:"Sculpted Shoulder Bag",category:"Accessories",price:45000,img:"https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D=85",tag:"Edit"},
 {id:3,name:"Soft Knit Cardigan",category:"Women",price:41000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuhTfeJ3pdIEWfJHrBpVgshsNiXUCJjT2jYU4yNEoNw&s=85",tag:"Popular"},
 {id:4,name:"Everyday Leather Loafers",category:"Shoes",price:82000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS94-W6X_3S2wXPr09aIyeleFRxsynq-oX7KYpBRwOzpQ&s=85",tag:"New"},
 {id:5,name:"Pleated Midi Skirt",category:"Women",price:52000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRagOhe134Qpd5A7MwNiKw-1DxWLyoxwUCrozjiqx1Smw&s=85",tag:"Edit"},
 {id:6,name:"Classic Cotton Tee",category:"Men",price:35000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9HSPJ6ieZ8Ffzc3R6xn3owCErCjdl2UHESgklcKp9kA&s=85",tag:"Essential"},
 {id:7,name:"Minimalist Watch",category:"Accessories",price:74000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR08AlU5yQNwStDO4ujNdWfEC6Pqr8Pf3zxVf9uHsoV-A&s=85",tag:"New"},
 {id:8,name:"Structured Blazer",category:"Women",price:74000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV-Ol6C7mMy8ab6cWspdzvn0zXCYeyPM-KZSw8H1xcMw&s=85",tag:"Edit"}
];

function renderProduct(){
 const id=Number(new URLSearchParams(location.search).get("id"))||1,p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];

 const el=document.querySelector("#product-detail");
 if(!el)return;

 el.innerHTML=`<div class="detail-images"><div><img src="${p.img}" alt="${p.name}"></div><div><img src="${PRODUCTS[(id)%PRODUCTS.length].img}" alt=""></div></div>
 <div class="detail-info"><div class="eyebrow">${p.category} / ${p.tag}</div><h1>${p.name}</h1><div class="price">${money(p.price)}</div><p>A considered everyday piece made to be worn often. Clean lines, tactile materials and an easy silhouette make it a quiet addition to your wardrobe.</p>
 <div class="option"><label>Size</label><div class="sizes">${["XS","S","M","L","XL"].map((s,i)=>`<button class="size ${i===2?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div></div>
 <div class="qty"><button id="minus">−</button><span id="qty">1</span><button id="plus">+</button></div><button class="btn" id="add">Add to bag</button></div>`;
 document.querySelectorAll(".size").forEach(b=>b.onclick=()=>{document.querySelector(".size.selected")?.classList.remove("selected");b.classList.add("selected")});
 let q=1;document.querySelector("#plus").onclick=()=>{q++;document.querySelector("#qty").textContent=q};document.querySelector("#minus").onclick=()=>{if(q>1)q--;document.querySelector("#qty").textContent=q};
 document.querySelector("#add").onclick=()=>{let c=getCart(),item=c.find(x=>x.id===p.id);item?item.qty+=q:c.push({id:p.id,qty:q});saveCart(c);toast("Added to your bag");};
}
function renderCart(){
 const el=document.querySelector("#cart");if(!el)return;let c=getCart();

 if(!c.length){
    el.innerHTML=`<div class="cart-empty"><div class="eye">Your bag</div>
    <h2>Nothing here yet.</h2><p style="color:var(--muted);
    margin:15px 0 25px">Find something you love and it will appear here.</p>
    <a class="btn" href="shop.html">Shop the collection</a></div>`;
    return}

 const items=c.map(x=>({
    ...PRODUCTS.find(p=>p.id===x.id),qty:x.qty
}

));const subtotal=items.reduce((s,x)=>s+x.price*x.qty,0);

 el.innerHTML=`<div class="cart-layout"><div class="cart-items">${
    items.map(x=>`<div class="cart-row"><img src="${x.img}" alt="${x.name}
        
        "><div><h3>${x.name}</h3><p style="color:var(--muted)">${x.category}</p><p>${money(x.price)}
        </p><button class="remove" data-id="${x.id}">Remove</button></div><strong>${money(x.price*x.qty)}
        </strong></div>`).join("")}
        </div><aside class="summary"><h3>Order summary</h3><div>
        <span>Subtotal</span><span>${money(subtotal)}
        </span></div><div><span>Delivery</span><span>Calculated at checkout</span>
        </div><div class="total"><span>Total</span><span>${money(subtotal)}
        </span></div><button class="btn" style="width:100%;margin-top:19px" id="checkout">Checkout</button></aside></div>`;
 document.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{saveCart(c.filter(x=>x.id!==Number(b.dataset.id)));renderCart()});
 document.querySelector("#checkout").onclick=()=>last("Demo checkout — connect your payment gateway here.");
}


function observe(){
    
    const io=new IntersectionObserver(es=>es.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add("visible");
            io.unobserve(e.target)}}),{threshold:.08});
            document.querySelectorAll(".reveal:not(.visible)").forEach(e=>io.observe(e))
        }


document.addEventListener("DOMContentLoaded",()=>{renderFeatured();
    renderShop();
    renderProduct();
    renderCart();
    updateBadge();
    observe();

 document.querySelectorAll(".newsletter form").forEach(f=>f.onsubmit=e=>{
    e.preventDefault();last("You're on the list. Welcome to NOVARA.")});
});
