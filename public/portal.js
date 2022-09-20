const sair = document.getElementById('sair');
sair.addEventListener('click', () => {
    window.location.replace("./index.html")
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function promptCriar() {
    console.log("Tenta criar");
    const name = prompt("Defina o nome do site:", "Novo Site");
    if (name == null || name == "") {
        console.log("Cancelei a criação do site");
        return;
    }

    token = getCookie('token')
    fetch('/site', {
        method: 'POST',
        body: JSON.stringify({'name' : name, 'token' : token}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then( res => {
        if(res.ok){
            //TODO: redirect pra pagina de edição
            return;
        }

        if (res.status === 409){
            window.alert("Nome de site já existe");
        }
        else {
            window.alert("Problema ao criar site!");
        }
        
    });
}