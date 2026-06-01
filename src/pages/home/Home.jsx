import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../../components/supabase'; 
// 🔥 Alohida ajratilgan Header komponentingiz (Yo'nalishni tekshirib oling)
import Header from '../../components/header/Header'; 

// --- ANIMATSIYALAR ---
const kirishEffekti = keyframes`
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const aylanish = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// --- STYLED KOMPONENTLAR ---
const HomeSahifa = styled.div`
  max-width: 700px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;

  @media (min-width: 1300px) {
    max-width: 800px; 
  }
  
  @media (max-width: 350px) {
    padding: 0 10px;
    margin: 15px auto;
  }
`;

const HomeSarlavha = styled.div`
  text-align: center;
  margin-bottom: 25px;
  h2 { color: #333; margin-bottom: 5px; font-size: 24px; font-weight: 600; }
  p { color: #777; margin: 0; font-size: 14px; }

  @media (max-width: 480px) {
    h2 { font-size: 19px; }
    p { font-size: 12px; }
  }
`;

const YukRoyxati = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const YukKarta = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #1a73e8;
  animation: ${kirishEffekti} 0.4s ease-out;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const KartaBoshi = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 8px;
  flex-wrap: wrap;
  gap: 5px;
`;

const IdBelgi = styled.span`
  font-weight: bold;
  color: #1a73e8;
  background: #e8f0fe;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  
  @media (max-width: 380px) {
    font-size: 11px;
  }
`;

const VaqtBelgi = styled.span`
  font-size: 12px;
  color: #888;
`;

const YukMatni = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #2c3e50;
  white-space: pre-line;

  @media (max-width: 380px) {
    font-size: 13px;
  }
`;

const KutishPaneli = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #888;
`;

const Spinner = styled.div`
  width: 35px;
  height: 35px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a73e8;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: ${aylanish} 1s linear infinite;
`;

// ==========================================
// 🔥 LOTIN-KIRILL TRANSLIT LUG'ATI
// ==========================================
const lotinToKirill = {
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'j': 'ж', 'z': 'з', 
  'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 
  'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф', 'x': 'х', 'ts': 'ц', 'ch': 'ч', 
  'sh': 'ш', 'shch': 'щ', 'yu': 'ю', 'ya': 'я', 'q': 'к', 'h': 'х'
};

const kirillToLotin = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 
  'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
};

// Matnni bir vaqtning o'zida ham lotin, ham kirill ko'rinishiga o'tkazadigan aqlli funksiya
function dualAlifbo(text) {
  if (!text) return { lotin: "", kirill: "" };
  let lotin = text.toLowerCase();
  let kirill = text.toLowerCase();

  // Lotindan Kirillga o'tkazish
  Object.keys(lotinToKirill).forEach(key => {
    const regex = new RegExp(key, 'g');
    kirill = kirill.replace(regex, lotinToKirill[key]);
  });

  // Kirilldan Lotinga o'tkazish
  Object.keys(kirillToLotin).forEach(key => {
    const regex = new RegExp(key, 'g');
    lotin = lotin.replace(regex, kirillToLotin[key]);
  });

  // Logistika uchun harflardagi o'xshash xatoliklarni to'g'rilash (q -> k, c -> s)
  lotin = lotin.replace(/q/g, 'k').replace(/c/g, 's');

  return { lotin, kirill };
}

// --- ASOSIY HOME KOMPONENTI ---
function Home() {
  const [yuklar, setYuklar] = useState([]);
  const [status, setStatus] = useState("Supabase bazasiga ulanmoqda...");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Dastlabki ma'lumotlarni Supabase'dan o'qib olish
    const fetchCargos = async () => {
      try {
        const { data, error } = await supabase
          .from('cargos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setYuklar(data);
          setStatus("Ulandi! Jonli yuklar oqimi faol.");
        }
      } catch (error) {
        console.error("Xatolik:", error.message);
        setStatus("Ulanishda xato: " + error.message);
      }
    };

    fetchCargos();

    // 2. ⚡️ REALTIME (JONLI AKSIYA): Yangi yuklarni sahifani yangilamasdan ushlash
    const channel = supabase
      .channel('jonli-yuklar')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cargos' }, 
        (payload) => {
          console.log("📩 Yangi yuk keldi:", payload.new);
          setYuklar((eskiYuklar) => [payload.new, ...eskiYuklar]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🌍 MULTI-WORD + TRANSLIT JONLI QIDIRUV FILTRI (RAKETA REJIM)
  const filtrlanganYuklar = yuklar.filter((yuk) => {
    if (!yuk.text) return false;

    // Bazadagi yuk xabarini ikki xil alifboga o'tkazamiz
    const yukDual = dualAlifbo(yuk.text);

    // Qidiruv maydoniga yozilgan so'zlarni probellar bo'yicha bo'laklarga ajratamiz
    const qidiruvSozlari = searchTerm
      .trim()
      .toLowerCase()
      .split(/\s+/) 
      .filter(soz => soz.length > 0);

    // Agar qidiruv oynasi bo'sh bo'lsa, hamma yuklarni sahifada ko'rsatadi
    if (qidiruvSozlari.length === 0) return true;

    // Har bir yozilgan qidiruv so'zini alohida tahlil qilamiz
    return qidiruvSozlari.every((soz) => {
      const sozDual = dualAlifbo(soz);

      // Tekshiruv: yozilgan qisqartma yoki alifbo xabarning ichida bormi?
      return (
        yukDual.lotin.includes(sozDual.lotin) || 
        yukDual.kirill.includes(sozDual.kirill) ||
        yukDual.lotin.includes(soz) ||
        yukDual.kirill.includes(soz)
      );
    });
  });

  return (
    <HomeSahifa>
      <HomeSarlavha>
        <h2>Jonli yuklar e'lonlari (Bulutli Rejim)</h2>
        <p>Telegram kanallardan kelayotgan buyurtmalar real vaqtda bazadan yangilanadi</p>
        <small style={{ color: '#1a73e8', display: 'block', marginTop: '5px' }}>
          <b>Tizim holati:</b> {status}
        </small>
      </HomeSarlavha>

      {/* 🛠 RESPONSIV HEADER COMPONENTI */}
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        jamiYuklar={yuklar.length}
        filtrlandiSoni={filtrlanganYuklar.length}
      />

      {/* ASOSIY RO'YXAT VA HOLATLAR */}
      {yuklar.length === 0 ? (
        <KutishPaneli>
          <Spinner />
          <p>Yangi yuk e'lonlari kutilmoqda...</p>
        </KutishPaneli>
      ) : filtrlanganYuklar.length === 0 ? (
        // Agar birorta ham mos yuk topilmasa chiquvchi oyna
        <KutishPaneli>
          <p style={{ color: '#e02424', fontWeight: '500' }}>
            😔 Kechirasiz, "{searchTerm}" bo'yicha mos e'lon topilmadi.
          </p>
          <p style={{ fontSize: '13px' }}>Poiskka boshqacha so'z yozib ko'ring yoki yangi yuk tushishini kuting.</p>
        </KutishPaneli>
      ) : (
        <YukRoyxati>
          {/* Filtrdan muvaffaqiyatli o'tgan barcha yuklarni ekranga chiqaramiz */}
          {filtrlanganYuklar.map((yuk) => (
            <YukKarta key={yuk.id}>
              <KartaBoshi>
                <IdBelgi>📢 @{yuk.channel || "Kanal"}</IdBelgi>
                <VaqtBelgi>
                  🕒 {new Date(yuk.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </VaqtBelgi>
              </KartaBoshi>
              <YukMatni>{yuk.text}</YukMatni>
            </YukKarta>
          ))}
        </YukRoyxati>
      )}
    </HomeSahifa>
  );
}

export default Home;