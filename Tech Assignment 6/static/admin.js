document.addEventListener("DOMContentLoaded", ()=>{
    const menu_add = document.getElementById("menu-add");
    const menu_edit = document.getElementById("menu-edit");
    const menu_del = document.getElementById("menu-del");
    const item_template = document.querySelector(".menu-item");
    const order_template = document.querySelector(".order-item");
    const menu_grid = document.getElementById("menu-grid");
    const order_grid = document.getElementById("order-grid");

    // add a UI order item to the order grid
    function add_order_item(id, itemid, on, cn, q, s){
        const id_ = id;
        var elem = order_template.cloneNode(true);
        const item_id = elem.querySelector(".item_id");
        const item_name = elem.querySelector(".item_name");
        const cust_name = elem.querySelector(".cust_name");
        const quantity = elem.querySelector(".quantity");
        const status = elem.querySelector(".status");
        const del_btn = elem.querySelector(".del-order");
        item_name.innerText = on;
        cust_name.innerText = cn;
        quantity.innerText = q;
        item_id.innerText = itemid;
        
        if(s==0){
            status.innerText = "Pending";
            status.style.backgroundColor = "#dba137";
        }else{
            status.innerText = "Completed";
            status.style.backgroundColor = "green";
        }

        

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // delete order
        del_btn.addEventListener("click", ()=>{
            fetch(`/order/${id_}`, {
                "method": "DELETE",
                "headers": myHeaders
                })
                .then(x=>x.json())
                .then(data=>{
                    order_grid.removeChild(elem);
            });
        });

        // update status when status button clicked
        status.addEventListener("click", ()=>{
            if(status.innerText == "Pending"){
                fetch(`/order/${id_}`, {
                    "method": "PUT",
                    "headers": myHeaders,
                    "body":JSON.stringify({
                        "status":1
                    })})
                    .then(x=>x.json())
                    .then(data=>{
                        status.innerText = "Completed";
                        status.style.backgroundColor = "green";
                });
            }else{
                fetch(`/order/${id_}`, {
                    "method": "PUT",
                    "headers": myHeaders,
                    "body":JSON.stringify({
                        "status":0
                    })}
                )
                .then(x=>x.json())
                .then(data=>{
                    status.innerText = "Pending";
                    status.style.backgroundColor = "#dba137";
                });
            }
        });
        
        
        elem.removeAttribute("hidden");
        order_grid.appendChild(elem);
    }

    //get menu on DOM loaded
    fetch("/menu")
    .then(x=>x.json())
    .then(data1=>{
        // get orders
        fetch("/orders")
        .then(x=>x.json())
        .then(data2=>{
            if("data" in data2){
                for(var item of data2["data"]){
                    add_order_item(item["id"], item["item_id"], item["item_name"], item["cust_name"], item["quantity"], item["status"]);
                }
            }
        })
        if("data" in data1){
            for(var item of data1["data"]){
                add_menu_item(item["id"], item["name"], item["price"], menu_grid, item_template);
            }
        }
    });

    // redirect POST form
    activate_form(menu_add, (data)=>{
        if("data" in data){
            const name = menu_add.querySelector(`input[name="name"]`);
            const price = menu_add.querySelector(`input[name="price"]`);

            const id = data["data"]["id"];
            add_menu_item(id, name.value, price.value, menu_grid, item_template);
            name.value = "";
            price.value = "";
        }else{
            alert(data["error"]);
        }
    });
    
    // redirect PUT form
    activate_form(menu_edit, (data)=>{
        if("error" in data){
            alert(data["error"]);
        }else{
            const name = menu_edit.querySelector(`input[name="name"]`);
            const price = menu_edit.querySelector(`input[name="price"]`);
            const id = menu_edit.querySelector(`input[name="id"]`);
            edit_menu_item(id.value, name.value, price.value, menu_grid);

            id.value = "";
            price.value = "";
            name.value = "";
        }
    });

    // redirect DELETE form
    activate_form(menu_del, (data)=>{
        console.log("error" in data);
        if("error" in data){
            alert(data["error"]);
        }else{
            const id = menu_del.querySelector(`input[name="id"]`);

            remove_menu_item(id.value, menu_grid);

            
            for(var elem of order_grid.children){
                const item_id = elem.querySelector(".item_id").innerText;
                console.log(`${item_id}==${id.value}`)
                if(item_id == id.value){
                    order_grid.removeChild(elem);
                }
            }

            id.value = "";
        }
        });
});