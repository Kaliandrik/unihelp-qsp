// Função para alternar o menu sidebar em telas pequenas
document.getElementById('menuToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('active');
});

// Função para atualizar data e hora
function updateDateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString('pt-BR');
  document.getElementById('horaData').textContent = `${timeString} | ${dateString}`;
}

// Atualizar a cada minuto
updateDateTime();
setInterval(updateDateTime, 60000);

// Função para marcar notificações como lidas (pode ser expandida)
function markNotificationAsRead(notificationId) {
  // Implementar lógica para marcar notificação como lida
  console.log(`Notificação ${notificationId} marcada como lida`);
}

// Função para enviar mensagem (pode ser expandida)
function sendMessage(conversationId, messageText) {
  // Implementar lógica para enviar mensagem
  console.log(`Mensagem enviada para conversa ${conversationId}: ${messageText}`);
}

// Event listeners para as telas de notificações e mensagens
document.addEventListener('DOMContentLoaded', function() {
  // Se estiver na página de notificações
  if (document.querySelector('.notifications-container')) {
    document.querySelectorAll('.mark-as-read').forEach(button => {
      button.addEventListener('click', function() {
        const notification = this.closest('.notification-item');
        notification.classList.remove('unread');
      });
    });
  }
  
  // Se estiver na página de mensagens
  if (document.querySelector('.messages-container')) {
    document.querySelector('.send-btn').addEventListener('click', function() {
      const input = document.querySelector('.message-input');
      if (input.value.trim()) {
        // Aqui você enviaria a mensagem
        console.log('Mensagem enviada:', input.value);
        input.value = '';
      }
    });
  }
});