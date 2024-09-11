const btnNovaTarefa = document.getElementById("nova-tarefa");
const textNovaTarefa = document.getElementById("texto-tarefa");
const listaTarefas = document.getElementById('div-tarefas');
const mensagem = document.getElementById("mensagem");
const textContaTarefas = document.getElementById("conta-tarefas");
const textTotalTarefas = document.getElementById("total-tarefas");
let textTarefaEdit = "";
let contadorTotal = 0;
let contadorTarefas = 0;

window.onload = function () {
    carregaTarefasLocal();
}

function addTarefa (){

    let valorTarefa = textNovaTarefa.value;
    let passouTarefa = false;

    //SE O BUTÃO ESTIVER EM MODO ADICIONAR
    if (btnNovaTarefa.textContent.trim() == "Adicionar")
    {
        //VERIFICA SE O INPUT TEM TEXTO, CASO NÃO TENHA
        if(valorTarefa === "")
        {
            //APRESENTA MENSAGEM DE ERRO
            //OCULTA A MENSAGEM APÓS 2000ms
            mensagem.innerHTML = `<i class="bi bi-x error-message"></i> A tarefa não pode estar vazia`;
            apresentaMensagem(2000);
            return;
        } 

        //CASO TENHA TEXTO ...
        else
        {
            //APRESENTA MENSAGEM DE SUCESSO COM O VALOR DO TEXTO INSERIDO
            //OCULTA A MENSAGEM APÓS 2000ms
            //HABILITA A INSERÇÃO DA TAREFA COM O passouTarefa
            mensagem.innerHTML = `<i class="bi bi-check success-message"></i> Tarefa '${valorTarefa}' inserida com sucesso`;
            apresentaMensagem(2000); 
            passouTarefa = true;
        }
    }

    //SE O BUTÃO ESTIVER EM MODO EDITAR
    else if (btnNovaTarefa.textContent.trim() == "Atualizar")
    {
        //VERIFICA SE O INPUT TEM TEXTO, CASO NÃO TENHA
        if(valorTarefa === "")
        {
            //APRESENTA MENSAGEM DE ERRO E DEPOIS OCULTA A MENSAGEM APÓS 2000ms
            //VOLTA A COLOCAR O TEXTO DA TAREFA QUE ESTAVA A SER EDITADA E DA FOCUS
            mensagem.innerHTML = `<i class="bi bi-x error-message"></i> A tarefa não pode estar vazia, tente novamente`;
            apresentaMensagem(2000);
            textNovaTarefa.value = textTarefaEdit;
            textNovaTarefa.focus();
            return;
        } 

        //VERIFICA SE O INPUT ATUAL É IGUAL AO TEXTO DA TAREFA A SER EDITADA
        else if (valorTarefa === textTarefaEdit)
        {
            //APRESENTA MENSAGEM A INFORMAR QUE NÃO FORAM FEITAS ALTERAÇÕES
            //OCULTA A MENSAGEM APÓS 3000ms
            //HABILITA A INSERÇÃO DA TAREFA COM O passouTarefa
            mensagem.innerHTML = `<i class="bi bi-check success-message"></i> A tarefa foi reposta, não foram feitas alterações`;
            apresentaMensagem(3000);
            passouTarefa = true;
            textTarefaEdit = "";
        }

        //CASO TENHA SIDO FEITA ALGUMA ALTERAÇÃO
        else
        {
            //APRESENTA MENSAGEM DE SUCESSO COM O VALOR DA TAREFA ANTERIOR E O VALOR ATUALIZADO
            //OCULTA A MENSAGEM APÓS 3000ms
            //HABILITA A INSERÇÃO DA TAREFA COM O passouTarefa E REINICIA O TEXTO A EDITAR
            mensagem.innerHTML = `<i class="bi bi-check success-message"></i> Tarefa '${textTarefaEdit}' atualizada com sucesso para '${valorTarefa}'`;
            apresentaMensagem(3000)
            passouTarefa = true;
            textTarefaEdit = "";
        }
    }

    //SE ESTIVER HABILITADA A INSERSÃO DA TAREFA ..
    if (passouTarefa)
    {
        //DESABILITAMOS A INSERÇÃO DA TAREFA PARA FALSE E ATUALIZAMOS O TEXTO DO BUTÃO PARA ADICIONAR
        passouTarefa=false;
        btnNovaTarefa.innerHTML = `Adicionar <i class="bi bi-plus"></i>`

        //CRIAMOS UMA DIV: <div class="tarefa"> </div>
        let div = document.createElement('div');
        div.setAttribute('class', 'tarefa');

        //TAGS E VARIAVEIS QUE VÃO ESTAR DENTRO DO DIV
        div.innerHTML=
        `
        <input type="checkbox" class="verifica-tarefa" name="check-task-${contadorTotal+1}" onclick="verificaEstado(this)"/>
        <span class="valor-tarefa">${valorTarefa}</span>
        <button class="editar" onclick="editarTarefa(this)">
            <i class="bi bi-pencil""></i>
        </button>
        <button class="remover" onclick="apagarTarefa(this)">
            <i class="bi bi-x-circle"></i>
        </button>
        `

        //ADICIONAMOS A DIV À NOSSA LISTA DE TAREFAS E AUMENTAMOS O CONTADOR DE TAREFAS
        //ATUALIZAMOS O TEXTO DAS TAREFAS PENDENTES E O INPUT NO FRONT ENT
        listaTarefas.append(div);
        contadorTarefas ++;
        contadorTotal ++;
        textTotalTarefas.innerText = contadorTotal;
        textContaTarefas.innerText = contadorTarefas;
        textNovaTarefa.value = "";

        //GUARDA AS TAREFAS NO LOCAL
        guardarTarefas();
    }   
}

function apagarTarefa(button) {

    //A tarefa ASSUME A DIV COMPLETA
    const tarefa = button.parentElement;

    //O spanTarefa VAI BUSCAR O TEXTO DA TAREFA: <span>texto da tarefa</span>
    const spanTarefa = tarefa.querySelector('.valor-tarefa');

    //O valorAtual ASSUME O TEXTO SO SPAN
    let valorAtual = spanTarefa.textContent;

    //VERIFICA SE A TAREFA JÁ ESTAVA CONCLUÍDA
    if (!spanTarefa.classList.contains('completed')) {
        //CASO NÃO ESTEJA REDUZ O CONTADOR TAREFAS PENDENTES  
        contadorTarefas --;
    }    

    //REMOVE A DIV DA LISTA DE TAREFAS E REDUZ AO CONTADOR DE TOTAL
    //ATUALIZA O TOTAL DE TAREFAS NO FRONT END E APRESENTA MENSAGEM DE SUCESSO DURANTE 2000ms
    listaTarefas.removeChild(tarefa);
    contadorTotal --;
    textTotalTarefas.innerText = contadorTotal;
    textContaTarefas.innerText = contadorTarefas;
    mensagem.innerHTML = `<i class="bi bi-check success-message"></i> Tarefa '${valorAtual}' removida com sucesso`;
    apresentaMensagem(2000);

    //GUARDA AS TAREFAS NO LOCAL
    guardarTarefas();

}

function editarTarefa(button) {

    //A tarefa ASSUME A DIV COMPLETA
    const tarefa = button.parentElement;

    //O spanTarefa VAI BUSCAR O TEXTO DA TAREFA: <span>texto da tarefa</span>
    const spanTarefa = tarefa.querySelector('.valor-tarefa');

    //O valorAtual ASSUME O TEXTO SO SPAN
    let valorAtual = spanTarefa.textContent;

    //VERIFICAMOS SE NÃO ESTAMOS A EDITAR NENHUMA TAREFA ...
    if (textTarefaEdit === ""){
        //RECORREMOS À FUNÇÃO DE apagarTarefa ENVIANDO O button RECEBIDO NESTA FUNÇÃO
        apagarTarefa(button);

        //ATUALIZAMOS O INPUT DE TAREFAS NO FRONT END E SELECIONAMOS O INPUT
        textNovaTarefa.value = valorAtual;
        textNovaTarefa.focus();

        //ATUALIZAMOS O TEXTO DO BUTÃO ADICIONAR/ATUALIZAR APRESENTAMOS MENSAGEM EDIÇÃO DURANTE 3000ms
        //POR FIM GUARDAMOS O VALOR DA TAREFA NUMA VARIAVEL
        btnNovaTarefa.innerHTML = `Atualizar <i class="bi bi-arrow-clockwise"></i>`
        mensagem.innerHTML = `<i class="bi bi-check success-message"></i> Tarefa '${valorAtual}' em modo edição`;
        apresentaMensagem(3000);
        textTarefaEdit = valorAtual;
    }
    //SE JÁ TIVERMOS A EDITAR ALGUMA TAREFA ...
    else
    {
        //APRESENTA MENSAGEM DE ERRO A INFORMAR QUE ESTÁ UMA TAREFA EM ATUALIZAÇÃO
        mensagem.innerHTML = `<i class="bi bi-x error-message"></i> Tarefa '${textTarefaEdit}' em modo edição, não pode editar esta tarefa`;
        apresentaMensagem(5000);
    }
    
}

function verificaEstado(checkbox){

    //A tarefa ASSUME A DIV COMPLETA
    const tarefa = checkbox.parentElement;

    //O spanTarefa VAI BUSCAR O TEXTO DA TAREFA: <span>texto da tarefa</span>
    const spanTarefa = tarefa.querySelector('.valor-tarefa');
   
    //CASO A CHECKBOX ESTEJA CHECKED .. ADICIONAMOS A CLASS .completed AO SPAN DA TAREFA
    if (checkbox.checked) {
        //ADICIONA A CLASSE .completed À TAREFA
        spanTarefa.classList.add('completed');
        //ATUALIZAMOS O CONTADOR DE TAREFAS
        contadorTarefas--;
        textContaTarefas.innerText = contadorTarefas;
    }
    //CASO NÃO ESTEJA CHECK 
    else 
    {
        //REMOVE A CLASSE .completed À TAREFA
        spanTarefa.classList.remove('completed');
        //ATUALIZAMOS O CONTADOR DE TAREFAS
        contadorTarefas++;
        textContaTarefas.innerText = contadorTarefas;
    }

    //GUARDA AS TAREFAS NO LOCAL
    guardarTarefas();
}

function apresentaMensagem(tempo){
    mensagem.style.display="block";
    setTimeout(() => {mensagem.style.display = "none"}, tempo);
}

function guardarTarefas(){

    //ARRAY VAZIO DE TAREFAS A GUARDAR
    const todasTarefas = [];

    //PERCORRE A LISTA DE TAREFAS ATRAVÉS DE UM FOREACH
    listaTarefas.querySelectorAll('.tarefa').forEach(tarefa => {

        //GUARDA O TEXTO E ESTADO DA TAREFA NUMA VARIÁVEL
        let textoTarefa = tarefa.querySelector('.valor-tarefa').textContent;

        //VERIFICA SE EXISTE completed NA CLASSE DA TAREFA, SE SIM ASSUME true, SE NAO ASSUME false
        let tarefaConcluida = tarefa.querySelector('.valor-tarefa').classList.contains('completed');

        //INSERE A TAREFA NO ARRAY {texto_tarefa: "Texto", tarefa_feita: true}
        todasTarefas.push({texto_tarefa: textoTarefa, tarefa_feita: tarefaConcluida});
    });
    localStorage.setItem('lista-tarefas', JSON.stringify(todasTarefas));
}

function carregaTarefasLocal(){

    //COLOCA OS CONTADORES NO TEXTO
    textContaTarefas.textContent = contadorTarefas;
    textTotalTarefas.textContent = contadorTotal;

    const tarefasEmStorage = localStorage.getItem('lista-tarefas');

    //VERIFICA SE EXISTE O ITEM 'lista-tarefas'
    if(tarefasEmStorage){

        //CASO EXISTA O ITEM 'lista-tarefas', CONVERTEMOS OS VALORES PARA VARIÁVEIS
        const tarefas = JSON.parse(tarefasEmStorage);

        //PERCORREMOS TODAS AS TAREFAS
        tarefas.forEach(item => {

            //CRIAMOS UMA DIV: <div class="tarefa"> </div>
            let div = document.createElement('div');
            div.setAttribute('class', 'tarefa');

            //VERIFICA SE A TAREFA ESTÁ CHECK
            var tarefaCheck = item.tarefa_feita ? 'checked' : '';
            var tarefaCompleta = item.tarefa_feita ? 'completed' : '';

            //TAGS E VARIAVEIS QUE VÃO ESTAR DENTRO DO DIV
            div.innerHTML = 
            `
            <input type="checkbox" class="verifica-tarefa" name="check-task-${contadorTotal+1}" ${tarefaCheck} onclick="verificaEstado(this)"/>
            <span class="valor-tarefa ${tarefaCompleta}">${item.texto_tarefa}</span>
            <button class="editar" onclick="editarTarefa(this)">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="remover" onclick="apagarTarefa(this)">
                <i class="bi bi-x-circle"></i>
            </button>
            `;

            //ADICIONAMOS A TAREFA A LISTA DE TAREFAS
            listaTarefas.append(div);

            //AUMENTA O CONTADOR TOTAL E VERIFICA SE A TAREFA ESTÁ PENDENTE
            contadorTotal ++;
            if(!tarefaCheck){
                contadorTarefas++;
            }
        });

        //CARREGA OS TOTAIS
        textTotalTarefas.innerText = contadorTotal;
        textContaTarefas.innerText = contadorTarefas;
    }
}
