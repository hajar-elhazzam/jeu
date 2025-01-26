import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Select, Layout, List } from 'antd';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

// Nouvelle palette de couleurs pour les cartes
const COLORS = [
  '#E02AE2', '#FF00FF', '#00FFFF', '#FFA500',
  '#800080', '#008000', '#000080', '#808000',
  '#FFC0CB', '#A52A2A', '#8B4513', '#808080',
  '#000000', '#C71585', '#FF6347', '#ADFF2F',
  '#FFD700', '#32CD32', '#FF1493', '#7FFF00',
  '#FF4500', '#D2691E', '#8A2BE2', '#00BFFF',
  '#20B2AA', '#FF8C00', '#6A5ACD', '#F0E68C',
  '#98FB98', '#D3D3D3', '#FF6347', '#90EE90'
];

function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameMode, setGameMode] = useState(4); // Mode par défaut : 4 cartes
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('gameHistory')) || []);
  const [background, setBackground] = useState('#f0f2f5');

  useEffect(() => {
    initializeGame();
  }, [gameMode]);

  function initializeGame() {
    // Sélectionner le bon nombre de paires de couleurs en fonction du mode
    const colorPairs = COLORS.slice(0, gameMode / 2);
    const shuffled = [...colorPairs, ...colorPairs]
      .map((color, id) => ({ id, color, flipped: false, number: id + 1 })) // Ajouter un numéro pour chaque carte
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
  }

  function handleCardClick(card) {
    if (flippedCards.length === 2 || matchedCards.includes(card.id) || flippedCards.includes(card.id)) return;

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards.map(id => cards.find(c => c.id === id));
      if (first.color === second.color) {
        setMatchedCards([...matchedCards, first.id, second.id]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }

    if (matchedCards.length + 2 === cards.length) {
      saveGameHistory();
    }
  }

  function saveGameHistory() {
    const newHistory = [...history, { gameMode, date: new Date().toLocaleString() }];
    setHistory(newHistory);
    localStorage.setItem('gameHistory', JSON.stringify(newHistory));
  }

  function changeBackground(color) {
    setBackground(color);
  }

  const cardStyle = (card) => ({
    textAlign: 'center',
    background: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.color : '#B0BEC5',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white', // Texte visible avec fond sombre
    fontSize: '18px',
    border: '2px solid #d9d9d9',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.2s ease', // Ajout d'une transition pour le survol
  });

  // Ajout de la transformation pour le survol de la carte
  const cardHoverStyle = (card) => ({
    transform: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'none' : 'scale(1.1)', // Agrandir la carte quand elle est survolée
  });

  return (
    <Layout style={{ minHeight: '100vh', background }}>
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '24px' }}>Jeu de Memory (16 couleurs)</Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Select
            value={gameMode}
            onChange={value => setGameMode(value)}
            style={{ width: 120, marginRight: 10 }}
          >
            <Option value={4}>Mode 4</Option>
            <Option value={16}>Mode 16</Option>
            <Option value={32}>Mode 32</Option>
          </Select>
          <Button onClick={() => changeBackground('#e6f7ff')} style={{ marginRight: 10 }}>
            Fond Bleu
          </Button>
          <Button onClick={() => changeBackground('#f6ffed')} style={{ marginRight: 10 }}>
            Fond Vert
          </Button>
        </div>

        <Row gutter={[16, 16]} justify="center">
          {cards.map(card => (
            <Col key={card.id} xs={6} sm={4} md={3} lg={2}>
              <Card
                onClick={() => handleCardClick(card)}
                hoverable
                style={{
                  ...cardStyle(card),
                  ...cardHoverStyle(card), // Ajout des effets de survol
                }}
              >
                {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.number : ''} {/* Afficher le numéro de la carte */}
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: '30px' }}>
          <h2>Historique des jeux :</h2>
          <List
            bordered
            dataSource={history}
            renderItem={item => (
              <List.Item>
                Mode : {item.gameMode}, Date : {item.date}
              </List.Item>
            )}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Memory Card Game ©2025
      </Footer>
    </Layout>
  );
}

export default MemoryCardGame;
