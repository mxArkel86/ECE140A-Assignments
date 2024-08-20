function set_elem_time(elem){
    var tz_time = elem.querySelector("p");
    var tz_diff = parseInt(tz_time.innerText);

    var modified = new Date(Date.now() + tz_diff*3600*1000);
    var hour = modified.getUTCHours();
    var suffix = "AM";
    if(hour>12){
        hour-=12;
        suffix = "PM";
    }else if(hour==0){
        hour = 12;
    }
    elem.querySelector("time").innerText = `${modified.getUTCMonth()+1}/${modified.getUTCDate()}/${modified.getUTCFullYear()} ${hour}:${modified.getUTCMinutes()}:${modified.getUTCSeconds()} ${suffix}`;
}

document.addEventListener("DOMContentLoaded", ()=>{
    const og_time_template = document.querySelector(".time-template");
    const tz_txt = document.getElementById("tz_txt");
    const tz_txt_btn = document.getElementById("tz_txt_btn");
    const tz_index = document.getElementById("tz_index");
    const tz_index_btn = document.getElementById("tz_index_btn");
    const clock_grid = document.getElementById("clock-grid");

    var timezones = null;
    fetch("/static/timezones.json")
    .then(response => {
        return response.json();
    }).then(json => {timezones = json;});

    // ADD TIMEZONE
    tz_txt_btn.addEventListener("click", (e)=>{
        if(timezones != null && tz_txt.value in timezones){
            const time_diff = timezones[tz_txt.value];
            console.log("time diff=" + time_diff);

            const elem = og_time_template.cloneNode(true);
            elem.querySelector("h1").innerText = tz_txt.value.trim().toUpperCase();
            elem.querySelector("p").innerText = time_diff > 0? "+" + time_diff: time_diff;

            set_elem_time(elem);
            setInterval(()=>{
                set_elem_time(elem);
            }, 1000);

            elem.style.display = "";
            clock_grid.appendChild(elem);
        }else{
            console.log("timezone does not exist");
        }
    });

    // DELETE TIMEZONE
    tz_index_btn.addEventListener("click", (e)=>{
        const index = parseInt(tz_index.value);
        console.log("index=" + index);
        if(index >= 0 && index<clock_grid.children.length){
            clock_grid.removeChild(clock_grid.children[index]);
        }
    });


});