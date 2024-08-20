document.addEventListener("DOMContentLoaded", ()=>{
    const item_template = document.querySelector(".menu-item");
    const menu_grid = document.getElementById("menu-grid");
    const order_dd = document.querySelector(`select[name="id"]`);
    const current_item_price = document.getElementById("current_item_price");
    const order_add = document.getElementById("order_add");
    const cust_name = document.querySelector(`input[name="cust_name"]`);
    const order_q = document.querySelector(`input[name="quantity"]`);

    prices = {}

    // update the price calculator based on prices retrieved on DOM load
    function update_price(item, query){
        const item_id = item.value;
        const query_amount = query.value;

        if(item_id.length==0 || query.value.length==0){
            current_item_price.innerText = " ";
        }else{
            const item_price = prices[item_id];
            
            current_item_price.innerText = `$ ${item_price*query_amount}`;
        }
    }
    
    // get menu items
    fetch("/menu")
    .then(x=>x.json())
    .then(data=>{
        for(var item of data["data"]){
            add_menu_item(item["id"], item["name"], item["price"], menu_grid, item_template);
            var dd_elem = document.createElement("option");
            dd_elem.value = item["id"];
            dd_elem.innerText = item["name"];
            order_dd.appendChild(dd_elem);

            prices[item["id"]] = item["price"];
        }
    });

    //redirect form submit and use our own callback
    activate_form(order_add, (data)=>{
        if("error" in data){
            alert(data["error"]);
        }else{
            order_dd.value = "";
            order_q.value = "";
            cust_name.value = "";
            current_item_price.innerText = " ";
            alert("order submitted");
        }
    });

    // update the price calculator whenever ORDER or QUANTITY changes
    order_dd.addEventListener("change", (e)=>{
        update_price(e.target, order_q);
    });

    order_q.addEventListener("input", (e)=>{
        update_price(order_dd, e.target);
    });
    
});