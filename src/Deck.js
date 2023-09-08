import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// this receives the 'imageUrl' prop to determine which image to show.
function Card({ imageUrl }) {
    return <img src={imageUrl} alt="Playing Card" />;
  }
  
  function Deck() {
    // Define state variables using 'useState'.
    const [deckId, setDeckId] = useState(''); // Store the deck ID.
    const [drawnCards, setDrawnCards] = useState([]); // Store the drawn cards.
    const [isShuffling, setIsShuffling] = useState(false);
    const [error, setError] = useState(''); // Store error messages.
    const [cardIndex, setCardIndex] = useState(1);
    
    // Create a ref using 'useRef' to store the deck ID across renders.
    const deckIdRef = useRef(deckId);
  
    // 'useEffect' is used to run code when the component mounts, rather than have it get called everytime there is a re-render
    useEffect(() => {
      // Define an asynchronous function 'initializeDeck' to fetch the initial deck.
      async function initializeDeck() {
        try {
          // Send a GET request to the API to shuffle a new deck.
          const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
          
          // Update 'deckId' state with the received deck ID.
          setDeckId(response.data.deck_id);
          
          // Update 'deckIdRef.current' with the received deck ID using the ref.
          deckIdRef.current = response.data.deck_id;
          
          // Call 'drawCard' to draw an initial card.
          drawCard();
        } catch (error) {
          console.error('Error initializing deck:', error);
        }
      }
  
      // Call the 'initializeDeck' function when the component mounts.
      initializeDeck();
    }, []); // Empty array means this effect runs once on mount.

    const shuffleDeck = async () => {
      if (isShuffling) {
        return; // Prevent multiple shuffles while one is in progress
      }
  
      try {
        setIsShuffling(true); // Start shuffle, disable button
        setDrawnCards([]); // Clear drawn cards
  
        // Send a request to shuffle the existing deck using 'deckIdRef.current'.
        await axios.get(`https://deckofcardsapi.com/api/deck/${deckIdRef.current}/shuffle/`);
  
        setIsShuffling(false); // Shuffle complete, enable button
      } catch (error) {
        console.error('Error shuffling deck:', error);
        setIsShuffling(false); // Error occurred, enable button
      }
    };
    // asynchronous function to draw a card from the deck.
    const drawCard = async () => {
      try {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckIdRef.current}/draw/?count=1`);
        const drawnCard = response.data.cards[0];
  
        if (drawnCard) {
          setDrawnCards([...drawnCards, drawnCard]);
          setCardIndex(cardIndex + 1); // Increase card index with each draw
        } else {
          setError('Error: no cards remaining!');
        }
      } catch (error) {
        console.error('Error drawing card:', error);
      }
    };
  
    return (
      <div className="Deck">
        <button onClick={shuffleDeck} disabled={isShuffling}>
          Shuffle Deck
        </button>
        <button onClick={drawCard} disabled={isShuffling}>
          Draw Card
        </button>
  
        <div className="Cards">
          {drawnCards.map((card, index) => (
            <Card key={index} imageUrl={card.image} index={index} />
          ))}
        </div>
  
        {isShuffling && <p>Shuffling...</p>}
        {error && <p>{error}</p>}
      </div>
    );
  }
  
  export default Deck;