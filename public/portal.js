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

function adicionarSites(sites) {
    div_pai = document.getElementsByClassName("cardSection")[0]
    let count = div_pai.childElementCount
    for (let site of sites) {
        
        let card = document.createElement("div")
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <p>${site.name}</p>
                </div>
                <div class="card-back">
                    <label for="site-name">Change name</label>
                    <div class="alignRow">
                        <input type="text" name="site-name" id="nomeMudar${count}" placeholder="${site.name}"></input>
                        <button class="changeButton" id="botaoMudar${count}">Change!</button>
                    </div>
                <button class="smallButton" id="botaoDelete${count}" >Delete site</button>
                    <button class="smallButton">Download site</button>
                    <label class="switch">
                        <input id = "hostSwitch${count}" type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>`
        card.className = "card"
        div_pai.appendChild(card)
        console.log(site)
        document.getElementById(`botaoDelete${count}`).addEventListener('click', () => {
            let confirmar = confirm(`Deseja deletar o site ${site.name}?`);
            if (!confirmar) {
                return;
            }
            
            const token = get_token()
            fetch(`/site/${site.user}/${site._id}/delete`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (!res.ok) {
                    window.alert("Erro ao deletar o site!");
                }
                else {
                    window.alert(`Site ${site.name} deletado com sucesso.`);
                    div_pai.removeChild(card)
                }
            });
        });

        let nome_input = document.getElementById(`nomeMudar${count}`);

        document.getElementById(`botaoMudar${count}`).addEventListener('click', () => {
            const novo_nome = nome_input.value;

            let confirmar = confirm(`Deseja mudar o site ${site.name} para ${novo_nome}?`);
            
            if (!confirmar) {
                return;
            }
            
            const token = get_token()
            fetch(`/site/${site.user}/${site._id}/edit_name`, {
                method: 'PUT',
                body: JSON.stringify({"name": novo_nome}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (!res.ok) {
                    window.alert("Erro ao mudar o nome do site!");
                }
                else {
                    window.alert(`Nome mudado para ${novo_nome}.`);
                }
            });
        });
        
        document.getElementById(`hostSwitch${count}`).addEventListener('change', event => {
            console.log(event.target.checked);
            const token = get_token()
            const body = {"host": event.target.checked}
            console.log(body)
            fetch(`/site/${site.user}/${site._id}/edit_host`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (!res.ok) {
                    window.alert("Erro ao hostear o site!");
                }
            });
        });
        
        count++;

    }

    return
}

function promptCriar() {
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
    }).then( async res => {
        if(res.ok){
            //TODO: redirect pra pagina de edição
            adicionarSites([await res.json()]);
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

async function load_current_user_sites(){
   const sites = await get_sites();
   adicionarSites(sites)
}
load_current_user_sites();