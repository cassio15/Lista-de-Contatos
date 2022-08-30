class Contato {
    constructor(nome, celular, fixo, email, observacao){
        this.nome = nome
        this.celular = celular
        this.fixo = fixo
        this.email = email
        this.observacao = observacao
    }

    //Metodo que valida se todos os campos foram preenchidos
	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) { //Se ao menos um campo não foi preenchido corretamente, retorne false
				return false
			}
		}
		return true
	}
}

//Gravando os dados do contato no localStorage do navegador
class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

    //Criando logica para incrimentar o id + 1 a cada novo contato cadastrado
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

    //Salvando no localStorage
	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

    //Armazenando os atributos do contato em um array
	recuperarTodosRegistros() {

		//array de despesas
		let contatos = Array()

		let id = localStorage.getItem('id') //capturando o id em uma variavel

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			let contato = JSON.parse(localStorage.getItem(i)) //Pego todos os itens que compõe um contato cadastrado

            //Se houver algum indice que são nulos, irei pular ele atraves do 'continue'
			if(contato === null) {
				continue
			}
			contato.id = i
			contatos.push(contato)
		}

		return contatos
	}


    //Aplica filtro nos campos (consultar.html)
	pesquisar(contato){

		let contatosFiltrados = this.recuperarTodosRegistros()

		//regex observacao
		if (contato.observacao.length > 0) {
			const regex = new RegExp('^' + contato.observacao);
			contatosFiltrados = contatosFiltrados.filter( item => {
				return item.observacao.match(regex);
			});
		}


        //regex nome
        if (contato.nome.length > 0) {
			const regex = new RegExp('^' + contato.nome);
			contatosFiltrados = contatosFiltrados.filter( item => {
				return item.nome.match(regex);
			});
		}

		

		//regex celular
		if (contato.celular.length > 0) {
			const regex = new RegExp('^' + contato.celular);
			contatosFiltrados = contatosFiltrados.filter( item => {
				return item.celular.match(regex);
			});
		}

	

		//regex fixo
		if (contato.fixo.length > 0) {
			const regex = new RegExp('^' + contato.fixo);
			contatosFiltrados = contatosFiltrados.filter( item => {
				return item.fixo.match(regex);
			});
		}


		//regex email
		if (contato.email.length > 0) {
			const regex = new RegExp('^' + contato.email);
			contatosFiltrados = contatosFiltrados.filter( item => {
				return item.email.match(regex);
			});
		}

		return contatosFiltrados
	}

    //Usarei esse método no botão de excluir contato (em consultar.html)
	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarContatos() { //Aqui não posso capturar o value

	let nome = document.getElementById('nome')
    let celular = document.getElementById('celular')
    let fixo = document.getElementById('fixo')
    let email = document.getElementById('email')
    let observacao = document.getElementById('observacao')


	let contato = new Contato (nome.value, celular.value, fixo.value, email.value, observacao.value)

    //Alterando o modal para mensagem de sucesso caso todos os campos forem informados quando cadastrar contato.
	if(contato.validarDados()) {
		bd.gravar(contato)

		document.getElementById('modal_titulo').innerHTML = 'Cadastro Realizado'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Contato cadastrado com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className ='btn btn-success'

		//dialog de sucesso
		$('#modalRegistraContato').modal('show')  //É necessario essa linha de JQuery para o modal funcionar

        //Aqui sim eu posso usar o value para limpar o que foi digitado após salvar o contato cadastrado
		nome.value = ''
        celular.value = ''
        fixo.value = ''
        email.value = ''
        observacao.value = ''
        
    //Alterando o modal para mensagem de erro caso eu deixar algum campo em branoc na tela de cadastra contato
	} else{
        document.getElementById('modal_titulo').innerHTML = 'Erro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Um ou mais campos ficaram em branco ou não foram preenchidos incorretamente'
        document.getElementById('modal_btn').innerHTML = 'Voltar e Corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalRegistraContato').modal('show') //É necessario essa linha de JQuery para o modal funcionar
    }
}

//Mostrando os contatos criados (consultar.html)
function carregaListaContatos (contatos = Array(), filtro = false) {

    if(contatos.length == 0 && filtro == false){
		contatos = bd.recuperarTodosRegistros() 
	}
	

	let listaContatos = document.getElementById("listaContatos")
    listaContatos.innerHTML = ''
	contatos.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaContatos.insertRow();

		//Criando as colunas (td)
        linha.insertCell(0).innerHTML = d.nome
        linha.insertCell(1).innerHTML = d.celular
        linha.insertCell(2).innerHTML = d.fixo
        linha.insertCell(3).innerHTML = d.email
        linha.insertCell(4).innerHTML = d.observacao

		//Criando botão para excluir contatos já cadastrados
		let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = 'X'
        btn.id = `id_contato_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_contato_','')
            bd.remover(id)
            window.location.reload() //Após clicar no botão de excluir, irei atualizar a tela para que os contatos exibidos seja atualizado
        }

        linha.insertCell(5).append(btn)
    })

 }

 
 function pesquisarContato(){
	 
	let nome = document.getElementById('nome').value
    let celular = document.getElementById('celular').value
    let fixo = document.getElementById('fixo').value
    let email = document.getElementById('email').value
    let  observacao= document.getElementById('observacao').value

    let contato = new Contato(nome, celular, fixo, email, observacao)
    let contatos = bd.pesquisar(contato)
    this.carregaListaContatos(contatos, true)

 }

 function limpar(){
        nome.value = ''
        celular.value = ''
        fixo.value = ''
        email.value = ''
        observacao.value = ''
 }


//Acionando o botão com o Enter
document.addEventListener("keypress", function(e){
    let btnSalvar = document.querySelector("#btnSalvar")
    let btnPesquisar = document.querySelector("#btnPesquisar")
    let modal = document.querySelector("#modal_btn")
    if (e.key === 'Enter'){
        if(modal != null){ //Se o modal aparecer, aciono o botão dele primeiro (porque ele é um alert)
            modal.click()
        }
        if(btnSalvar != null){ //Se eu esitver na pagina de Cadastars
            return cadastrarContatos()
        }if (btnPesquisar != null){ //Se eu estiver na pagina de Pesquisar
            return pesquisarContato()
        }
    }
})



