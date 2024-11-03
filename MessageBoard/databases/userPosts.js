const messages = [
    {
      text: "Hi there!",
      user: "Amando",
      added: new Date()
    },
    {
      text: "Hello Gooners!",
      user: "Charles",
      added: new Date()
    }
  ];

  messages.push({
    text: "New message!",
    user: "New User",
    added: new Date(),
    likes: 0
  });
  
  let messageId = 0
  messages.forEach(message => {
      message.id = messageId
      messageId++
    })

  async function getMsgById(messageId) {
    return messages.find(msg => msg.id === messageId)
  };

  function getAll() {
    return messages
  }

module.exports = { getMsgById, getAll };