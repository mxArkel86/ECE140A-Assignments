function valid_name(txt){
    if (txt.length == 0)
        return false;
    
    const pattern = /^[a-zA-Z]{3,32}$/;
    return pattern.test(txt);
}

function valid_id(txt){
    if (txt.length == 0)
    return false;

    const pattern = /^[0-9]{3,32}$/;
    return pattern.test(txt);
}

function verify_submit(){
    const v1 = valid_name(first_name.value);
    const v2 = valid_name(first_name.value);
    const v3 = valid_id(first_name.value);

    if (v1 && v2 && v3){
        return true;
    }
    
    if (!v1){
        console.log("error1");
        error1.innerText = "Invalid Name";
    }
    if (!v2){
        console.log("error2");
        error2.innerText = "Invalid Name";
    }
    if (!v3){
        console.log("error3");
        error3.innerText = "Invalid ID";
    }

    return false;
}

function verify_submit_2(){
    const v1 = valid_name(first_name_2.value);
    const v2 = valid_name(first_name_2.value);
    const v3 = valid_id(first_name_2.value);

    if (v1 && v2 && v3){
        return true;
    }

    if (!v1){
        console.log("error1");
        error1_2.innerText = "Invalid Name";
    }
    if (!v2){
        console.log("error2");
        error2_2.innerText = "Invalid Name";
    }
    if (!v3){
        console.log("error3");
        error3_2.innerText = "Invalid ID";
    }

    return false;
}