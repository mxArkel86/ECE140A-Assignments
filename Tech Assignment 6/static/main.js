function activate_form(form, callback){
    form.addEventListener('submit', (event) => {
        // stop the default form behavior
        event.preventDefault();
        
        //generate form data from existing form
        var form_data = new URLSearchParams(new FormData(form).entries());

        var action = form.getAttribute('action');
        const method = form.getAttribute('method');
        //modify route for PUT and DELETE
        if(action.includes("%n")){
            action = action.replace("%n", form_data.get("id"));
            form_data.delete("id");
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        var requestOptions = {
            method: method,
            headers: myHeaders,
            body: form_data
            };

        fetch(action, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(callback){
                callback(result);
            }
        })
        .catch(error => console.log('error', error));
});
}

// add UI menu item
function add_menu_item(id, name, price, grid, template){
    var elem = template.cloneNode(true);
    const item_id = elem.querySelector(".item_id");
    const item_name = elem.querySelector(".item_name");
    const item_price = elem.querySelector(".item_price");
    item_name.innerText = name;
    item_price.innerText = price;
    if(item_id)
        item_id.innerText = id;
    
    elem.removeAttribute("hidden");
    grid.appendChild(elem);
}
//find UI menu item as a DOM element from ID
function get_menu_elem_by_id(grid, id){
    for(var elem of grid.children){
        const item_id = elem.querySelector(".item_id").innerText;
        if(item_id == id){
            return elem;
        }
    }
    return null;
}
// delete UI element
function remove_menu_item(id, grid){
    var elem = get_menu_elem_by_id(grid, id);
    if(elem){
        grid.removeChild(elem);
    }
}
// edit UI element
function edit_menu_item(id, nname, nprice, grid){
    var elem = get_menu_elem_by_id(grid, id);
    if(elem){
        const item_name = elem.querySelector(".item_name");
        const item_price = elem.querySelector(".item_price");
        item_name.innerText = nname;
        item_price.innerText = nprice;
    }
}