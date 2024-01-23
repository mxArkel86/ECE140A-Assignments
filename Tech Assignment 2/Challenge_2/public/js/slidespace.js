document.addEventListener('DOMContentLoaded', function() {
    //select the button and add a click event
    var theBtn=document.querySelector('.btn');
    theBtn.addEventListener('click',function(event) {
        event.preventDefault();

        var theForm = event.target.closest('form');
        const theData = Object.fromEntries(new FormData(theForm).entries());
        console.log('data ', theData);

        // make a put request
        fetch(theForm.action, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(theData)
        })
        .then(response => response.json())
        .then(function(response) {
            console.log('Success:', response); //set the text to the response (which is json)
            document.querySelector('.results').innerHTML=response.results;
        })
        .catch(error => console.error('Error:', error));
    });
});