  import React, { useState, useEffect } from 'react';
  import styled, { keyframes } from 'styled-components';
  import { supabase } from '../../components/supabase'; 
  // 🔥 Alohida ajratilgan Header komponentingiz (Yo'lni loyihangizga qarab tekshirib oling)
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

    /* Katta monitorlarda (1300px gacha va undan yuqori) chiroyli cheklov */
    @media (min-width: 1300px) {
      max-width: 800px; 
    }
    
    /* Kichik telefonlar (350px) uchun maxsus moslashuv */
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

  // --- ASOSIY HOME KOMPONENTI ---
  function Home() {
    const [yuklar, setYuklar] = useState([]);
    const [status, setStatus] = useState("Supabase bazasiga ulanmoqda...");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      // 1. Dastlabki yuklarni bazadan o'qib olish
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

      // 2. ⚡️ REALTIME: Yangi yuk qo'shilganda uni shu zahoti ushlab olish
      const channel = supabase
        .channel('jonli-yuklar')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cargos' }, 
          (payload) => {
            console.log("📩 Yangi yuk keldi:", payload.new);
            // Yangi yukni ro'yxat boshiga qo'shamiz (bu state o'zgarishi filtrni ham jonli yangilaydi)
            setYuklar((eskiYuklar) => [payload.new, ...eskiYuklar]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

    // 🔥 MUKAMMAL JONLI QIDIRUV FILTRI:
    // Siz "buxoro" deb qidirganda harflar va tasodifiy probellar xalaqit bermaydi
    const filtrlanganYuklar = yuklar.filter((yuk) => {
      if (!yuk.text) return false;
      
      const qidiruvMatni = searchTerm.trim().toLowerCase();
      const yukMatni = yuk.text.toLowerCase();
      
      return yukMatni.includes(qidiruvMatni);
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

        {/* 🛠 ALOHIDA RESPONSIV HEADER COMPONENTI */}
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
          // Agar qidiruv oynasiga yozilgan so'z bo'yicha hech narsa topilmasa chiqadigan chiroyli xabar
          <KutishPaneli>
            <p style={{ color: '#e02424', fontWeight: '500' }}>
              😔 Kechirasiz, "{searchTerm}" so'zi bo'yicha e'lon topilmadi.
            </p>
            <p style={{ fontSize: '13px' }}>Biron bir yangi yuk kelib tushsa va u mos kelsa, sahifani yangilamasdan shu yerda chiqadi.</p>
          </KutishPaneli>
        ) : (
          <YukRoyxati>
            {/* Faqat filtrdan muvaffaqiyatli o'tgan yuklarni ekranga chiqaramiz */}
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