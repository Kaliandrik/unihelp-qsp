    // Dados dos médicos e possíveis respostas
    const doctorProfiles = {
        1: {
            id: 1,
            name: "Dr. André Silva",
            specialty: "Cardiologista",
            avatar: "men/32",
            responses: {
                greetings: [
                    "Olá Maria, como você está se sentindo hoje?",
                    "Bom dia Maria, como vai seu coração hoje?",
                    "Oi Maria, me conte como tem sido sua semana?"
                ],
                symptoms: [
                    "Esses sintomas são comuns após o procedimento. Está tomando os medicamentos corretamente?",
                    "Vamos analisar esses sintomas. Poderia descrever com mais detalhes?",
                    "Isso pode estar relacionado ao seu tratamento atual. Está seguindo todas as recomendações?"
                ],
                medications: [
                    "A dose que prescrevi está sendo eficaz? Tem sentido algum efeito colateral?",
                    "É importante tomar os remédios nos horários corretos. Como tem sido sua rotina?",
                    "Vamos monitorar a resposta aos medicamentos. Tem anotado alguma mudança?"
                ],
                appointments: [
                    "Acho que seria bom marcarmos uma consulta de acompanhamento. Que tal semana que vem?",
                    "Seus exames estão agendados? Precisamos avaliar seus progressos.",
                    "Podemos marcar uma teleconsulta para discutir esses sintomas com mais calma."
                ],
                general: [
                    "Entendi. Vamos acompanhar essa evolução.",
                    "Isso é importante para seu tratamento. Vamos monitorar.",
                    "Ótimo feedback. Isso me ajuda a ajustar seu tratamento."
                ]
            }
        },
        2: {
            id: 2,
            name: "Dra. Carla Mendes",
            specialty: "Pediatra",
            avatar: "women/44",
            responses: {
                greetings: [
                    "Olá, como está o pequeno hoje?",
                    "Bom dia, como estão os sintomas da criança?",
                    "Oi, me conte como tem sido o desenvolvimento?"
                ],
                symptoms: [
                    "Esses sintomas são normais nessa fase. A febre continua alta?",
                    "Está mantendo a hidratação adequada? Isso é fundamental.",
                    "Vamos observar por mais 24h. Se piorar, me avise imediatamente."
                ],
                medications: [
                    "A dose da medicação está sendo tolerada? Alguma reação?",
                    "Lembre-se de dar os remédios nos horários prescritos.",
                    "Podemos ajustar a medicação se os sintomas persistirem."
                ],
                development: [
                    "Isso faz parte do desenvolvimento normal. Alguma outra preocupação?",
                    "Vamos marcar uma consulta para avaliar esses marcos do desenvolvimento.",
                    "Continue estimulando como orientamos na última consulta."
                ],
                general: [
                    "Ótimo, vamos continuar monitorando.",
                    "Agradeço pelo feedback. Isso ajuda no acompanhamento.",
                    "Anotado. Vamos ver como evolui nos próximos dias."
                ]
            }
        }
    };

    // Variáveis globais
    let currentDoctorId = 1;
    let conversationHistory = {};

    // Inicialização do chat
    document.addEventListener('DOMContentLoaded', function() {
        // Toggle do menu
        document.getElementById('menuToggle').addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        // Atualiza data e hora
        updateDateTime();
        setInterval(updateDateTime, 60000);
        
        // Configuração dos cards de médicos
        setupDoctorCards();
        
        // Configuração do input de mensagem
        const textarea = document.querySelector('.message-input');
        const sendBtn = document.querySelector('.send-btn');
        
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            sendBtn.disabled = this.value.trim() === '';
        });
        
        sendBtn.addEventListener('click', sendMessage);
        
        textarea.addEventListener('keydown', function(e) {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    });

    function updateDateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString('pt-BR');
        document.getElementById('horaData').textContent = `${timeString} | ${dateString}`;
    }

    function setupDoctorCards() {
        const doctorsList = [
            { id: 1, name: "Dr. André Silva", specialty: "Cardiologista", avatar: "men/32", online: true, unread: 2 },
            { id: 2, name: "Dra. Carla Mendes", specialty: "Pediatra", avatar: "women/44", online: true, unread: 0 }
        ];

        const contactsList = document.querySelector('.contacts-list');
        contactsList.innerHTML = '';

        doctorsList.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'contact-card';
            doctorCard.dataset.id = doctor.id;
            
            doctorCard.innerHTML = `
                <img src="https://randomuser.me/api/portraits/${doctor.avatar}.jpg" 
                     alt="${doctor.name}" class="contact-avatar">
                <div class="contact-info">
                    <div class="contact-name">${doctor.name}</div>
                    <div class="contact-specialty">${doctor.specialty}</div>
                    <div class="contact-status ${doctor.online ? 'status-online' : ''}">
                        <i class="fas fa-circle"></i> ${doctor.online ? 'Online' : 'Offline'}
                    </div>
                </div>
                ${doctor.unread > 0 ? `<div class="unread-badge">${doctor.unread}</div>` : ''}
            `;
            
            doctorCard.addEventListener('click', function() {
                document.querySelectorAll('.contact-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                currentDoctorId = doctor.id;
                loadDoctorProfile(currentDoctorId);
                
                if(!conversationHistory[currentDoctorId]) {
                    startNewConversation(currentDoctorId);
                } else {
                    loadConversation(currentDoctorId);
                }
            });
            
            contactsList.appendChild(doctorCard);
        });

        // Seleciona o primeiro médico por padrão
        const firstDoctorCard = contactsList.querySelector('.contact-card');
        if(firstDoctorCard) {
            firstDoctorCard.click();
        }
    }

    function loadDoctorProfile(doctorId) {
        const doctor = doctorProfiles[doctorId];
        if(!doctor) return;
        
        const chatHeader = document.querySelector('.chat-header');
        chatHeader.innerHTML = `
            <img src="https://randomuser.me/api/portraits/${doctor.avatar}.jpg" 
                 alt="${doctor.name}" class="chat-avatar">
            <div class="chat-doctor-info">
                <div class="chat-doctor-name">${doctor.name}</div>
                <div class="chat-doctor-specialty">${doctor.specialty}</div>
            </div>
        `;
    }

    function startNewConversation(doctorId) {
        const doctor = doctorProfiles[doctorId];
        if(!doctor) return;
        
        // Limpa mensagens anteriores
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML = '';
        
        // Adiciona mensagem de saudação do médico
        const greeting = doctor.responses.greetings[
            Math.floor(Math.random() * doctor.responses.greetings.length)
        ];
        addMessage(greeting, 'received');
        
        // Inicializa histórico da conversa
        conversationHistory[doctorId] = [{
            sender: 'doctor',
            message: greeting,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }];
    }

    function loadConversation(doctorId) {
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML = '';
        
        if(conversationHistory[doctorId]) {
            conversationHistory[doctorId].forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender === 'doctor' ? 'received' : 'sent'}`;
                
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">${msg.message}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
                
                messagesContainer.appendChild(messageDiv);
            });
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function sendMessage() {
        const textarea = document.querySelector('.message-input');
        const message = textarea.value.trim();
        
        if(message && currentDoctorId) {
            // Adiciona mensagem do usuário
            addMessage(message, 'sent');
            textarea.value = '';
            textarea.style.height = 'auto';
            document.querySelector('.send-btn').disabled = true;
            
            // Salva no histórico
            if(!conversationHistory[currentDoctorId]) {
                conversationHistory[currentDoctorId] = [];
            }
            
            conversationHistory[currentDoctorId].push({
                sender: 'user',
                message: message,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            });
            
            // Resposta do médico
            setTimeout(() => {
                const doctor = doctorProfiles[currentDoctorId];
                if(!doctor) return;
                
                // Determina o tipo de resposta com base no conteúdo
                let responseType = 'general';
                const lowerMsg = message.toLowerCase();
                
                if(/(dor|sintoma|incômodo|desconforto)/.test(lowerMsg)) {
                    responseType = 'symptoms';
                } else if(/(remédio|medicação|comprimido|pílula|dose)/.test(lowerMsg)) {
                    responseType = 'medications';
                } else if(/(consulta|agendamento|exame|retorno)/.test(lowerMsg)) {
                    responseType = 'appointments';
                } else if(currentDoctorId === 2 && /(desenvolvimento|andar|falar|crescer)/.test(lowerMsg)) {
                    responseType = 'development';
                }
                
                // Seleciona resposta aleatória do tipo determinado
                const possibleResponses = doctor.responses[responseType] || doctor.responses.general;
                const response = possibleResponses[
                    Math.floor(Math.random() * possibleResponses.length)
                ];
                
                addMessage(response, 'received');
                
                // Atualiza histórico
                conversationHistory[currentDoctorId].push({
                    sender: 'doctor',
                    message: response,
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                });
            }, 1000 + Math.random() * 2000);
        }
    }

    function addMessage(text, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }