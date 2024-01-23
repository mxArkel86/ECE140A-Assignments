document.addEventListener('DOMContentLoaded', function() {
    var theBtn=document.querySelector('.btn');
    theBtn.addEventListener('click',function(event) {
        event.preventDefault();

        var theForm = event.target.closest('form');
        const theData = Object.fromEntries(new FormData(theForm).entries());
        console.log('data ', theData);

        fetch(theForm.action, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(theData)
        })
        .then(response => response.json())
        .then(function(response) {
            console.log('Success:', response);
            document.querySelector('.results').innerHTML=response.results;
        })
        .catch(error => console.error('Error:', error));
    });
});