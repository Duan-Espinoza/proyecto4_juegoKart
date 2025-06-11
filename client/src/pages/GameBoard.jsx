const { use } = require("react");

useEffect(() => {
  const fetchGameData = async () => {
    try {
      const response = await fetch('/api/game');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGameData(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  fetchGameData();
}, []);

//es temporal y sujeto a cambios
