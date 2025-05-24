const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const token = '7835548993:AAHkR_Xe2nJDHhxz-J9vaSouyIHY0ck7490';
const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(cors()); // ✅ разрешаем запросы из игры
app.use(bodyParser.json());

// /start — стартовая кнопка
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

// Покупка Stars
app.post('/buy', async (req, res) => {
  const userId = req.body.user_id;
  if (!userId) return res.status(400).send({ error: 'No user_id' });

  try {
    await bot.sendInvoice(
      userId,
      'Booster Pack',
      'Покупка бустера',
      'booster_001',
      '', // Stars — без provider_token
      'XTR',
      [{ label: 'Booster', amount: 100 }],
      {
        need_name: false,
        need_phone_number: false,
        need_email: false
      }
    );

    res.send({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Failed to send invoice' });
  }
});

// Подтверждение оплаты
bot.on('pre_checkout_query', (query) => {
  bot.answerPreCheckoutQuery(query.id, true);
});

bot.on('successful_payment', (msg) => {
  bot.sendMessage(msg.chat.id, '✅ Покупка прошла успешно!');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot server running on port', PORT);
});
