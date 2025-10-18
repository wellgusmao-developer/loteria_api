// Funções para modais
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function switchModal(fromId, toId) {
    closeModal(fromId);
    openModal(toId);
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = 'none';
        }
    }
}

// Scroll suave para seções
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Gerar números aleatórios para apostas
function generateBet() {
    const lotteryType = document.getElementById('lottery-type').value;
    const betContainer = document.getElementById('generated-bet');
    let numbers = [];
    let maxNumber, quantity;
    
    switch(lotteryType) {
        case 'megasena':
            maxNumber = 60;
            quantity = 6;
            break;
        case 'lotofacil':
            maxNumber = 25;
            quantity = 15;
            break;
        case 'quina':
            maxNumber = 80;
            quantity = 5;
            break;
        case 'lotomania':
            maxNumber = 100;
            quantity = 50;
            break;
        case 'timemania':
            maxNumber = 80;
            quantity = 10;
            break;
        case 'diadesorte':
            maxNumber = 31;
            quantity = 7;
            break;
        default:
            maxNumber = 60;
            quantity = 6;
    }
    
    // Gerar números únicos
    while (numbers.length < quantity) {
        const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    
    // Ordenar números
    numbers.sort((a, b) => a - b);
    
    // Exibir números
    let numbersHTML = '<div class="numbers">';
    numbers.forEach(num => {
        numbersHTML += `<div class="number">${num}</div>`;
    });
    numbersHTML += '</div>';
    
    betContainer.innerHTML = `
        <h3>Aposta para ${lotteryType.toUpperCase()}</h3>
        ${numbersHTML}
        <p>Lembre-se: esta é apenas uma sugestão de aposta. Jogue com responsabilidade.</p>
    `;
}

// Carregar resultados da API
async function loadResults() {
    const resultsContainer = document.getElementById('results-container');
    const loader = document.getElementById('loader');
    
    // Mostrar loader
    loader.style.display = 'flex';
    resultsContainer.style.display = 'none';

    try {
        const lotteries = ['megasena', 'lotofacil', 'quina', 'lotomania', 'timemania', 'duplasena', 'diadesorte', 'maismilionaria','supersete'];
        let resultsHTML = '';

        for (const lottery of lotteries) {
            try {
                const response = await fetch(`https://loteriascaixa-api.herokuapp.com/api/${lottery}/latest`);
                const data = await response.json();
                
                if (data && data.dezenas) {
                    let numbersHTML = '';
                    data.dezenas.forEach(num => {
                        numbersHTML += `<div class="number">${num}</div>`;
                    });

                    const dataSorteio = data.data || 'Data não disponível';

                    resultsHTML += `
                        <div class="lottery-card ${lottery.toLowerCase()}">
                            <div class="card-header">
                                <h3>${data.loteria || lottery.toUpperCase()}</h3>
                                <div class="next-draw">Próximo: ${getNextDrawDate(lottery)}</div>
                            </div>
                            <div class="card-body">
                                <div class="numbers">
                                    ${numbersHTML}
                                </div>
                            </div>
                            <div class="card-footer">
                                <span>Concurso: ${data.concurso || 'N/A'}</span>
                                <span>Data: ${dataSorteio}</span>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error(`Erro ao carregar dados da ${lottery}:`, error);
            }
        }

        if (!resultsHTML) {
            resultsHTML = '<p>Não foi possível carregar os resultados no momento. Tente novamente mais tarde.</p>';
        }

        resultsContainer.innerHTML = resultsHTML;

    } catch (error) {
        console.error('Erro ao carregar dados da API:', error);
        resultsContainer.innerHTML = '<p>Não foi possível carregar os resultados no momento. Tente novamente mais tarde.</p>';
    } finally {
        // Esconder loader e mostrar resultados
        loader.style.display = 'none';
        resultsContainer.style.display = 'grid';
    }
}


// Obter data do próximo sorteio
function getNextDrawDate(lotteryType) {
    const today = new Date();
    const day = today.getDay();
    
    switch(lotteryType.toLowerCase()) {
        case 'megasena':
            // Sorteios às quartas e sábados
            if (day <= 3) { // 0=domingo, 3=quarta
                return 'Quarta-feira, 20:00';
            } else {
                return 'Sábado, 20:00';
            }
        case 'lotofacil':
            // Sorteios às segundas, quartas e sextas
            if (day === 0 || day === 1) return 'Segunda-feira, 20:00';
            if (day >= 2 && day <= 4) return 'Quarta-feira, 20:00';
            return 'Sexta-feira, 20:00';
        case 'quina':
            // Sorteios às segundas, quartas e sextas
            if (day === 0 || day === 1) return 'Segunda-feira, 20:00';
            if (day >= 2 && day <= 4) return 'Quarta-feira, 20:00';
            return 'Sexta-feira, 20:00';
        default:
            return 'Em breve';
    }
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    loadResults();
    
    // Adicionar event listeners aos formulários
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Login realizado com sucesso!');
        closeModal('loginModal');
        
        // Verificar se usuário quer receber e-mails
        const wantsEmails = this.querySelector('input[name="email-notifications"]').checked;
        if (wantsEmails) {
            alert('Você receberá os resultados por e-mail diariamente!');
        }
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Conta criada com sucesso! Verifique seu e-mail para confirmação.');
        closeModal('registerModal');
        
        // Verificar se usuário quer receber e-mails
        const wantsEmails = this.querySelector('input[name="email-notifications"]').checked;
        if (wantsEmails) {
            alert('Você receberá os resultados por e-mail diariamente!');
        }
    });
    
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
});

// Mensagem de Contato
document.getElementById("form-contato").addEventListener("submit", function(event){
    event.preventDefault(); // impede envio imediato
    let form = this;

    // Envia via fetch
    fetch(form.action, {
        method: "POST",
        body: new FormData(form)
    }).then(() => {
        form.reset(); // limpa formulário
        document.getElementById("msg-sucesso").style.display = "block"; // mostra confirmação
        setTimeout(() => {
            document.getElementById("msg-sucesso").style.display = "none"; // esconde depois de 5s
        }, 5000);
    }).catch(() => {
        alert("❌ Erro ao enviar sua mensagem. Tente novamente.");
    });
});
