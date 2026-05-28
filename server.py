<<<<<<< HEAD:server.py
import os
import sys

# 🚫 RENDERNING PROXY MUHITLARINI KOD BOSHLANISHIDAN TOZALAYMIZ
os.environ.pop('http_proxy', None)
os.environ.pop('https_proxy', None)
os.environ.pop('HTTP_PROXY', None)
os.environ.pop('HTTPS_PROXY', None)

from telethon import TelegramClient, events
from telethon.sessions import StringSession
from groq import Groq
=======
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py
import asyncio
import json
<<<<<<< HEAD:server.py
import re
from aiohttp import web
=======
import os
import re
import time
from telethon import TelegramClient, events
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
import requests

# 1. .env faylidan muhit o'zgaruvchilarini yuklash
load_dotenv()
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py

# ==========================================
# 2. SOZLAMALAR (SETTINGS)
# ==========================================
API_ID = 31839723
API_HASH = "e6eda082ee69e1e1b6ed51f39a6c17a5"
BOT_TOKEN = "8618221989:AAEBSlSNbcipL8crtUdkn-Wve2J5zQB2VIA"
ADMIN_IDS = [1218335936, 6288779523, 7784938784, 7171086653]

<<<<<<< HEAD:server.py
# 🔑 GROQ API INTEGRATSIYASI (Eski/Yangi httpx ziddiyatlarisiz toza ishga tushirish)
GROQ_API_KEY = "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"
groq_client = Groq(api_key=GROQ_API_KEY)
=======
# Groq AI (Llama) kaliti
GROQ_API_KEY = "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"
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py

ai_client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

# .env faylidan Supabase kalitlarini o'qish
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Supabase mijozini yaratish
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Kuzatiladigan Telegram kanallari ro'yxati
TARGET_CHANNELS = [
<<<<<<< HEAD:server.py
    'milyukkar', 'yuk229', 'lorry_uzbekistan_yuk',
    'logistika_gruzov_dostavka', 'cargo_Turkey_export_import',
    'Furachilar_isuzu_yukmarkazi', 'LorryIchkiTashuv'
]

# ==========================================
# 2. 🔐 SESSİYANI TEKSHIRISH
# ==========================================
SESSION_DATA = os.environ.get("TELEGRAM_SESSION")

if SESSION_DATA:
    print("🤖 Render muhiti: StringSession orqali ulanmoqda...")
    client = TelegramClient(StringSession(SESSION_DATA), API_ID, API_HASH)
else:
    print("💻 Kompyuter muhiti: Oddiy sessiya fayli ishlatilmoqda...")
    client = TelegramClient('logistika_user', API_ID, API_HASH)

sio = socketio.AsyncServer(async_mode='aiohttp', cors_allowed_origins="*")
app = web.Application()
sio.attach(app)

request_queue = asyncio.Queue()

async def handle_home(request):
    return web.Response(text="🟢 SNG Logist Server is Active and Running!", content_type="text/plain")

app.router.add_get('/', handle_home)

@sio.event
async def connect(sid, environ):
    print(f"🟢 React web-sayti ulandi (sid: {sid})")

# ==========================================
# 3. AQLLI PYTHON FILTRI
=======
    "milyukkar",
    "yuk229",
    "lorry_uzbekistan_yuk",
    "logistika_gruzov_dostavka",
    "cargo_Turkey_export_import",
    "Furachilar_isuzu_yukmarkazi",
    "LorryIchkiTashuv",
]

# Telegram Client (UserBot)
client = TelegramClient(
    "logistika_user", API_ID, API_HASH, connection_retries=None, retry_delay=5
)


# ==========================================
# 3. SUN'IY INTELLEKT FUNKSIYASI (LLAMA-3.1)
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py
# ==========================================
async def analyze_message_with_llama(text):
    # Telefon raqamlarini matndan qidirib topish (Regex)
    phone_pattern = r"\+?998\s?\(?\d{2}\)?\s?\d{3}\s?\d{2}\s?\d{2}|\+?7\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}|\b\d{9}\b|\b\d{2}\s?\d{3}\s?\d{2}\s?\d{2}\b"
    found_numbers = re.findall(phone_pattern, text)

<<<<<<< HEAD:server.py
# ==========================================
# 4. GROQ SUN'IY INTELLEKT FUNKSIYASI
# ==========================================
async def analyze_message_with_groq(text, channel_title, retries=3, delay=10):
    phone_pattern = r'\+?998\s?\(?\d{2}\)?\s?\d{3}\s?\d{2}\s?\d{2}|\+?7\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}|\b\d{9}\b|\b\d{2}\s?\d{3}\s?\d{2}\s?\d{2}\b'
    found_numbers = list(set(re.findall(phone_pattern, text)))
    numbers_str = ", ".join(found_numbers) if found_numbers else "Ko'rsatilmagan"
=======
    # Raqamlarni chiroyli formatga keltirish (+998 qo'shish) va tozalash
    cleaned_numbers = []
    for num in found_numbers:
        clean_num = re.sub(r"\D", "", num)  # Faqat raqamlarni qoldirish
        if len(clean_num) == 9:
            cleaned_numbers.append(f"+998{clean_num}")
        elif len(clean_num) == 12 and clean_num.startswith("998"):
            cleaned_numbers.append(f"+{clean_num}")
        elif clean_num.startswith("7") and len(clean_num) == 11:
            cleaned_numbers.append(f"+{clean_num}")
        else:
            cleaned_numbers.append(num)
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py

    # Takrorlangan raqamlarni olib tashlash
    cleaned_numbers = list(set(cleaned_numbers))
    numbers_str = (
        ", ".join(cleaned_numbers) if cleaned_numbers else "Ko'rsatilmagan"
    )

    # 🔥 LYUBOY YU'NALISHNI QABUL QILADIGAN YANGI PROMPT
    prompt = f"""
<<<<<<< HEAD:server.py
    Siz professional xalqaro logistika dispetcherisiz. Matndan FAQAT XALQARO yuklarni ajratib oling.
    Bugungi sana: {bugungi_sana}
    Kelgan xabar: "{text}"
    Javobni FAQAT taqdim etilgan JSON formatida qaytaring:
=======
    Siz logistika tizimida ishlovchi aqlli yordamchisiz. Kelgan xabardan har qanday yuk e'lonini (buyurtmani) chiroyli formatga keltirib ajratib oling.
    
    QOIDALAR:
    1. Yo'nalish cheklovi yo'q! Yuk xoh O'zbekiston ichida (masalan: Samarqand -> Toshkent), xoh SNG (masalan: Toshkent -> Moskva) yoki boshqa davlatlar bo'lsa ham HAMMASINI qabul qiling (is_cargo: true).
    2. Faqatgina xabarda umuman yuk so'ralmagan bo'lsa, u shunchaki reklama yoki boshqa suhbat bo'lsagina rad eting (is_cargo: false).
    3. Agar bitta xabarda bir nechta har xil yuk buyurtmasi bo'lsa, ularni "cargos" ro'yxati ichida alohida-alohida ajrating.
    4. Xabardagi aloqa telefon raqamlarini mutloq saqlab qoling va ularni "Aloqa" qismiga chiroyli joylang.
    5. Yuk turi va imlo xatolarini to'g'rilang (Masalan: "Fuardami" -> "Furada (Tent)", "Zilga" -> "Zil", "isuzu" -> "Isuzu").

    Ushbu xabardan topilgan aloqa raqamlari: {numbers_str} (Bularni albatta "Aloqa" qatoriga joylashtiring).

    Kelgan xabar:
    \"\"\"{text}\"\"\"

    Javobni FAQAT quyidagi JSON formatida qaytaring:
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py
    {{
        "is_cargo": true/false,
        "cargos": [
            {{
<<<<<<< HEAD:server.py
                "matn": "📢 Manba: {channel_title}\\n📍 Yuk tavsifi\\n📞 Aloqa: {numbers_str}"
=======
                "matn": "📍 Samarqand -> Toshkent (yoki yo'nalish nomi)\\n🚚 Turi: Furada\\n⚖️ Vazni: 20 tonna (agar bo'lsa)\\n📦 Yuk: Tayyor\\n📞 Aloqa: {numbers_str}"
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py
            }}
        ]
    }}
    """
<<<<<<< HEAD:server.py
    
    for attempt in range(retries):
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant", 
                    messages=[
                        {"role": "system", "content": "Siz faqat toza JSON qaytaradigan robot ekansiz."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1,
                    max_tokens=1024,
                    response_format={"type": "json_object"}
                )
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"⚠️ Groq urinish {attempt+1} xatosi: {e}")
            await asyncio.sleep(delay)
            
    return {"is_cargo": False, "cargos": []}
=======
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: ai_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"},
            ),
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"❌ Llama AI xatosi: {e}")
        return {"is_cargo": False, "cargos": []}
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py


# ==========================================
# 4. ADMINLARGA BOT ORQALI XABAR YUBORISH
# ==========================================
def send_to_admins(text):
    for admin_id in ADMIN_IDS:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
<<<<<<< HEAD:server.py
        payload = {"chat_id": admin_id, "text": text}
        try: requests.post(url, json=payload, timeout=5)
        except: pass

# ==========================================
# 5. NAVBAT ISHCHISI (WORKER)
# ==========================================
async def queue_worker():
    while True:
        message_text, channel_title, msg_id = await request_queue.get()
        try:
            ai_result = await analyze_message_with_groq(message_text, channel_title)
            if ai_result.get("is_cargo") and ai_result.get("cargos"):
                vaqt_hozir = time.strftime('%H:%M:%S')
                for index, cargo in enumerate(ai_result["cargos"]):
                    cargo_text = cargo.get("matn", "")
                    send_to_admins(f"🌍 **GROQ FILTERED CARGO**\n\n{cargo_text}")
                    await sio.emit('yangi-yuk', {
                        "id": f"{msg_id}-{index}",
                        "matn": cargo_text,
                        "vaqt": vaqt_hozir,
                        "manba": channel_title
                    })
        except Exception as e:
            print(f"⚠️ Worker xatosi: {e}")
        finally:
            await asyncio.sleep(5)
            request_queue.task_done()

# ==========================================
# 6. TELEGRAM TINGLOVCHI
# ==========================================
async def start_bot():
    print("🚀 Telegram UserBot ulanishni boshladi...")
    await client.start()
    print("🔓 Telegram tarmog'iga ulandi!")
    
=======
        payload = {"chat_id": admin_id, "text": text, "parse_mode": "Markdown"}
        try:
            requests.post(url, json=payload, timeout=5)
        except Exception:
            pass


# ==========================================
# 5. TAHLIL QILISH VA SUPABASE-GA SAQLASH
# ==========================================
async def process_and_send(message_text, channel_title, msg_id):
    ai_result = await analyze_message_with_llama(message_text)

    if ai_result.get("is_cargo") and ai_result.get("cargos"):
        print(f"✅ AI mos yuklarni topdi! Soni: {len(ai_result['cargos'])} ta")

        for index, cargo in enumerate(ai_result["cargos"]):
            cargo_text = cargo.get("matn", "")

            # Telegram adminlarga yuborish
            send_to_admins(
                f"🌍 *AI FILTERED CARGO*\n📍 {channel_title}\n\n{cargo_text}"
            )

            # 🔥 MA'LUMOTNI SUPABASE BAZASIGA SAQLASH
            try:
                supabase.table("cargos").insert({
                    "telegram_id": f"{msg_id}-{index}",
                    "channel": channel_title,
                    "text": cargo_text
                }).execute()
                print(f"💾 Muvaffaqiyatli: Yuk Supabase-ga saqlandi! ({channel_title})")
            except Exception as e:
                print(f"❌ Supabase-ga yozishda xato: {e}")
    else:
        print(f"❌ Yuk mos kelmadi yoki keraksiz xabar. ({channel_title})")


# ==========================================
# 6. TELEGRAM TINGLOVCHINI ISHGA TUSHIRISH
# ==========================================
async def start_bot():
    print("🚀 Telegram UserBot ishga tushmoqda...")
    await client.start()
    print("🔓 Telegramga muvaffaqiyatli ulandingiz!")

>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py
    active_entities = []
    print("\n⏳ Kanallarga ulanish boshlandi...")
    for channel in TARGET_CHANNELS:
        try:
            entity = await client.get_entity(channel)
            active_entities.append(entity)
<<<<<<< HEAD:server.py
            print(f"  ✅ Kuzatuvda: @{channel}")
        except Exception as e:
            print(f"  ❌ Kanal topilmadi @{channel}: {e}")
=======
            print(f"  ✅ Ulandi: @{channel} ({entity.title})")
        except Exception as e:
            print(f"  ❌ Xato: @{channel} kanaliga ulanib bo'lmadi! Sababi: {e}")

    print("🎯 Kanallarni ro'yxatga olish yakunlandi.\n")
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py

    @client.on(events.NewMessage(chats=active_entities))
    async def handler(event):
        if not event.raw_text:
            return

        message_text = str(event.raw_text)
        chat = await event.get_chat()
        channel_title = str(chat.title) if chat else "Kanal"
<<<<<<< HEAD:server.py
        if not quick_pre_filter(message_text): return
        await request_queue.put((message_text, channel_title, event.message.id))

# ==========================================
# 7. SERVERNI ISHGA TUSHIRISH
# ==========================================
async def main():
    asyncio.create_task(queue_worker())
    asyncio.create_task(start_bot())
    
    port = int(os.environ.get("PORT", 10000))
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', port)
    await site.start()
    print(f"🚀 Web Server {port}-portda muvaffaqiyatli tinglamoqda!")
    
    while True:
        await asyncio.sleep(3600)

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Server to'xtatildi.")
=======

        print(f"\n📩 Kanaldan yangi xabar keldi -> {channel_title}")
        print("🤖 Llama AI tahlili fonga topshirildi...")

        # Fon rejimida ishlatish (asyncio task)
        asyncio.create_task(
            process_and_send(message_text, channel_title, event.message.id)
        )

    print("📡 Tizim to'liq ishchi holatda. Filtr yoqildi...")
    await client.run_until_disconnected()


if __name__ == "__main__":
    asyncio.run(start_bot())
>>>>>>> 17cbd13 (Bosh sahifa dark mode va tillar qo'shildi):backent/server.py
