const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
 
form.addEventListener('submit', async function (e) {
  e.preventDefault();
 
  const userMessage = input.value.trim();
  if (!userMessage) return;
 
  appendMessage('user', userMessage);
  input.value = '';
 
  const botMessageElement = appendMessage('bot', '...');
 
  try {
    const response = await fetch('/api/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.reply);
    }
 
    botMessageElement.textContent = data.reply;
  } catch (error) {
    console.error('Error:', error);
    botMessageElement.textContent = 'Sorry, I encountered an error. Please try again.';
  }
});
 
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
