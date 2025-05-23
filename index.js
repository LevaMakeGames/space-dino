const TelegramBot = require('node-telegram-bot-api');

// 🔐 Вставь сюда токен от @BotFather
const token = '7835548993:AAHkR_Xe2nJDHhxz-J9vaSouyIHY0ck7490';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Запусти игру:', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🚀 Играть в SpaceDino',
          web_app: { url: 'https://space-dino.vercel.app' }
        }
      ]]
    }
  });
});
