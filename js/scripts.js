// Variáveis globais de controles
let contTempoPomodoro = 0, contTempoLongo = 0, contTempoCurto = 0, statusDoTempo = 0, contBarra = 0;

// Array responsavel pela linha do tempo do pomodoro.
const linhaDoTempo = ["POMODORO","CURTO","POMODORO","LONGO","FIM"];

// Função que desabilita e habilita a entrada de dados dos inputs.
function controlarInputs(habilitado) {
    if (habilitado) {
        tempoPomodoro.setAttribute("disabled", habilitado);
        tempoLongo.setAttribute("disabled", habilitado);
        tempoCurto.setAttribute("disabled", habilitado);
    }
    else {
        tempoPomodoro.removeAttribute("disabled");
        tempoLongo.removeAttribute("disabled");
        tempoCurto.removeAttribute("disabled");
    }
}

// Função que valida se o tempo do pomodoro é válido. Aceitável até 23h 59m 59s.
function validarTempoPomodoro() {
	return tempoPomodoro.value && tempoPomodoro.value > 0 && tempoPomodoro.value <= 86399 ? true : false;
}

// Função que valida se o tempo do descanso longo é válido. Aceitável até 23h 59m 59s.
function validarTempoLongo() {    
	return tempoLongo.value && tempoLongo.value > 0 && tempoLongo.value <= 86399 ? true : false;
}

// Função que valida se o tempo do descanso curto é válido. Aceitável até 23h 59m 59s.
function validarTempoCurto() {
	return tempoCurto.value && tempoCurto.value > 0 && tempoCurto.value <= 86399 ? true : false;
}

// Função que limpa o painel, zerando os valores.
function limparPainel() {
	hora.innerHTML = "00";
	minuto.innerHTML = "00";
	segundo.innerHTML = "00";
}

// Função que insere o tempo formatado no painel em H, M e S.
function setTempoPainel(tempo) {
	if (tempo > 3599) {
		const valorHora = parseInt(tempo / 3600);
        const valorMinuto = parseInt((tempo - valorHora * 3600 ) / 60 );
        const valorSegundo = parseInt(tempo - (valorHora * 3600) - (valorMinuto * 60));
		hora.innerHTML = valorHora < 10 ? `0${valorHora}` : valorHora;
        minuto.innerHTML = valorMinuto < 10 ? `0${valorMinuto}` : valorMinuto;
        segundo.innerHTML = valorSegundo < 10 ? `0${valorSegundo}` : valorSegundo;
		return;
	}
	if (tempo > 59) {
		const valorMinuto = parseInt(tempo / 60);
        const valorSegundo = parseInt(tempo - (valorMinuto * 60));
		hora.innerHTML = "00";
        minuto.innerHTML = valorMinuto < 10 ? `0${valorMinuto}` : valorMinuto;
        segundo.innerHTML = valorSegundo < 10 ? `0${valorSegundo}` : valorSegundo;
		return;
	}
    hora.innerHTML = "00";
    minuto.innerHTML = "00";
    segundo.innerHTML = tempo < 10 ? `0${tempo}` : tempo;
}

// função que dispara o cronometro, intervao de 1s.
function iniciarContagem() {    
    controleParada = setInterval(() => {
        contarTempo();
       }, 1000);
}

// função que para o cronometro.
function pararContagem() {
     clearInterval(controleParada);
}

// função que controla a linha do tempo e insere o valor do cronometro atualizado no painel.
function contarTempo() {

    console.log(contBarra)

    if (linhaDoTempo[statusDoTempo] === "POMODORO") {
        titulo.innerHTML = "Pomodoro Timer";        
        contTempoPomodoro--;
        contBarra = (contTempoPomodoro * 100)  / tempoPomodoro.value;        
        setTempoPainel(contTempoPomodoro);    
        if (contTempoPomodoro === 0) {
            contTempoPomodoro = tempoPomodoro.value;
            //contBarra = tempoPomodoro.value;
            statusDoTempo++;           
        }        
    }
    else if (linhaDoTempo[statusDoTempo] === "CURTO") {
        titulo.innerHTML = "Descanso Curto";                
        contTempoCurto--;
        contBarra = (contTempoCurto * 100)  / tempoCurto.value;
        setTempoPainel(contTempoCurto);    
        if (contTempoCurto === 0) {
            contTempoCurto = tempoCurto.value;                        
           // contBarra = tempoCurto.value;
            statusDoTempo++;                 
        }        
    }
    else if (linhaDoTempo[statusDoTempo] === "LONGO") {
        titulo.innerHTML = "Descanso Longo";        
        contTempoLongo--;
        contBarra = (contTempoLongo * 100)  / tempoLongo.value;
        setTempoPainel(contTempoLongo);    
        if (contTempoLongo === 0) {           
           contTempoLongo = tempoLongo.value;
          // contBarra = tempoLongo.value;
           statusDoTempo++;                 
        }
    }
    if (linhaDoTempo[statusDoTempo] === "FIM") {
        const audio = document.querySelector("audio");
        audio.play();        
        titulo.innerHTML = "Pomodoro Timer";        
        pararContagem(controleParada)                     
        acao.innerHTML = "Iniciar";
        acao.setAttribute("estado", "iniciar");        
        tempoRestante.style.visibility = "hidden";
        contBarra = 0;        
    }     
    tempoRestante.style.width = contBarra + "%";
    tempoRestante.style.backgroundColor = "hsl( calc(" + contBarra + " * 1.2) , 80%, 50%)";
}

// A cada tecla pressionada é validado o campo do pomodoro.
tempoPomodoro.onkeyup = () => {
    if (!validarTempoPomodoro()) {
        limparPainel();
		mensagem.innerHTML = "* O valor informado para o Pomodoro é inválido!";
		return;
	}
	mensagem.innerHTML = "";
	setTempoPainel(tempoPomodoro.value);
    contTempoPomodoro = tempoPomodoro.value;
}

// Ao perder o foco, a div msg é limpa.
tempoPomodoro.onblur = () => {
    mensagem.innerHTML = "";
}

// A cada clique no botao, as funcões e as regras de negócio são acionadas.
acao.onclick = () => {

    if (!validarTempoPomodoro()) {
        barraProgresso.style.display = "";            
        mensagem.innerHTML = "* O valor informado para o Pomodoro é inválido!";
        return;
    }
    if (!validarTempoCurto()) {
        mensagem.innerHTML = "* O valor informado para o Descanso Curso é inválido!";
        return;
    }
    if (!validarTempoLongo()) {
        mensagem.innerHTML = "* O valor informado para o Descanso Longo é inválido!";
        return;
    }

    switch (acao.getAttribute("estado")) {
        case "iniciar":
            contTempoPomodoro = tempoPomodoro.value;
            contTempoCurto = tempoCurto.value;
            contTempoLongo = tempoLongo.value;
            mensagem.innerHTML = "";
            acao.innerHTML = "Parar";
            acao.setAttribute("estado", "pausar");
            iniciarContagem();
            controlarInputs(true);            
            tempo.style.visibility = "visible";            
            tempoRestante.style.width = "100%";
            break;
        case "pausar":
            mensagem.innerHTML = "* Tempo Parado!";
            acao.innerHTML = "Continuar";
            acao.setAttribute("estado", "continuar");
            titulo.classList.toggle("piscar");
            pararContagem();
            controlarInputs(false);
            break;
        case "continuar":
            mensagem.innerHTML = "";
            acao.innerHTML = "Parar";
            acao.setAttribute("estado", "pausar");            
            titulo.classList.toggle("piscar");            
            iniciarContagem();
            controlarInputs(false);
            break;
    }
}