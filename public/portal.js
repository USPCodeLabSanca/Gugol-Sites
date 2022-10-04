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

/*
function setAttributes(element, attrs){
    (for let attr in attrs){
        element.setAttribute(attr, attrs.attr)

    }

    return
}
*/

function carregarSites(sites) {
    div_pai = document.getElementByClass("card-section")
    for(let site of sites){
        let card = document.createElement("div")
        card.class="card"
        let card_inner = document.createElement("div")
        //card front
        let card_front = document.createElement("div")
        card_front.class="card-front"
        let card_front_p = document.createElement("p")
        card_front_p.innerText = site.name
        card_front.appendChild(card_front_p)
        card_inner.appendChild(card_front)
        //card back
        card_back = document.createElement("div")
        card_back.class="card-back"
        //label
        label = document.createElement("label")
        label.setAttribute("for", "site-name")
        label.innerText = "Change name"
        card_back.appendChild(label)
        //align row
        align_row = document.createElement("div")
        align_row.setAttribute("class", "alignRow")
        change_name_input = document.createElement("input")
        setAttributes(change_name_input, {
            type: "text",
            name: "site-name",
            placeholder: site.name
        })
        let change_name_button = document.createElement("button")
        change_name_button.innerText = "Change!"
        change_name_button.setAttribute("class", "changeButton")
        align_row.appendChild(change_name_input)
        align_row.appendChild(change_name_button)
        card_back.appendChild(align_row)
        //del download switch
        del = document.createElement("button")
        del.setAttribute("class", "smallButtons")
        del.innerText("Delete site")
        down = document.createElement("button")
        down.setAttribute("class", "smallButtons")
        down.innerText("Download site")
        card_back.appendChild(del)
        card_back.appendChild(down)
    }

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