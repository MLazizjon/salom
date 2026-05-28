import React from 'react';
import styled from 'styled-components';

// --- RESPONSIVE STYLED KOMPONENTLAR ---
const HeaderKonteyner = styled.div`
  background: #ffffff;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #eef2f5;
  box-sizing: border-box;
  width: 100%;

  /* 📱 350px dan boshlab mobil moslashuvchanlik */
  @media (max-width: 480px) {
    padding: 12px 15px;
    border-radius: 8px;
    gap: 10px;
  }

  /* 💻 1300px gacha bo'lgan katta ekranlar uchun maksimal kenglik cheklovi */
  @media (min-width: 1300px) {
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const QidiruvInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
  }

  &::placeholder {
    color: #aaa;
  }

  /* Kichik ekranlar (350px atrofida) uchun shrift va paddingni moslash */
  @media (max-width: 380px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const FiltrStatistika = styled.div`
  font-size: 13px;
  color: #657786;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Shriftlar siqilib ketmasligi uchun pastga tushadi */
  gap: 5px;

  span {
    font-weight: 500;
  }

  b {
    color: #131416;
  }

  @media (max-width: 380px) {
    font-size: 11px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

// --- HEADER KOMPONENTI ---
function Header({ searchTerm, setSearchTerm, jamiYuklar, filtrlandiSoni }) {
  return (
    <HeaderKonteyner>
      <QidiruvInput 
        type="text" 
        placeholder="🔍 Yuk yo'nalishini kiriting... (Samarqand, Toshkent, Moskva)" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FiltrStatistika>
        <span>Jami yuklar: <b>{jamiYuklar}</b> ta</span>
        {searchTerm && (
          <span style={{ color: '#1a73e8' }}>
            Filtrlandi: <b>{filtrlandiSoni}</b> ta
          </span>
        )}
      </FiltrStatistika>
    </HeaderKonteyner>
  );
}

export default Header;