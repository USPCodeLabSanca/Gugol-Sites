const sair = document.getElementById('sair');
sair.addEventListener('click', () => {
    window.location.replace("./index.html")
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
});

function get_token() {
     if (document.cookie != "") {
        const token = document.cookie.split('token=')[1];
        return token;
    }

    return undefined;
}

function get_user_from_token(token) {
    if (document.cookie != "") {
        const user = JSON.parse(atob(token.split('.')[1]));
        return user;
    }

    return undefined;
}

async function get_sites(){
    if (document.cookie != "") {
        token = get_token()
        user = get_user_from_token(token)

        const res = await fetch(`/user/${user.user}/site`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        
        return await res.json();
    }
}

(function(){
    if (document.cookie != "") {
        token = get_token() 
        user = get_user_from_token(token);
        
        fetch(`/user/${user.user}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}` 
            }
        }).then(res => {
            if(!res.ok){
                window.alert("Usuario nao aturorizado");
                window.location.replace("./index.html");
            } else {
                console.log("Deu certo");
            }
        });
    } else {
        window.alert("Usuário não autorizado.");
        window.location.replace("./index.html");
    }
})();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/*
function setAttributes(element, attrs){
    (for let attr in attrs){
        element.setAttribute(attr, attrs.attr)

    }

    return
}
*/

function adicionarSites(sites) {
    div_pai = document.getElementsByClassName("cardSection")[0]
    for(let site of sites){
        let card = document.createElement("div")
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <p>${site.name}</p>
                </div>
                <div class="card-back">
                    <label for="site-name">Change name</label>
                    <div class="alignRow">
                        <input type="text" name="site-name" id="site-name" placeholder="${site.name}">
                        <button class="changeButton">Change!</button>
                    </div>
                    <button class="smallButton">Delete site</button>
                    <button class="smallButton">Download site</button>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            `
        card.className = "card"
        div_pai.appendChild(card)
    }
    return
}

function promptCriar() {
    console.log("Tenta criar");
    const name = prompt("Defina o nome do site:", "Novo Site");
    if (name == null || name == "") {
        console.log("Cancelei a criação do site");
        return;
    }

    token2 = getCookie('token')
    token = get_token();
    user = get_user_from_token(token);
    
    fetch(`/site/${user.user}/create`, {
        method: 'POST',
        body: JSON.stringify({'name' : name, 'token' : token2}),
        headers: {
            authorization: `Bearer ${token}`,
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

// get_sites().then(
//     (sites) => {
//         adicionarSites(sites)
//     }
// )

async function load_current_user_sites(){
   const sites = await get_sites();
   adicionarSites(sites)
}
load_current_user_sites();