/* import { useEffect } from 'react';

export default  function LocationTracker(id) {
  useEffect(() => {
    // Função para obter a localização e exibir no console
    const sendLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, user_id } = position.coords;
            console.log('Latitude:', latitude, 'Longitude:', longitude, 'user_id:', id.id);
          },
          (error) => {
            console.log('Erro ao obter localização:', error.message);
          }
        );
      } else {
        console.log('Geolocalização não suportada pelo navegador');
      }
    };

    // Envia a localização imediatamente ao carregar
    sendLocation();

    // cada 5min
    const intervalId = setInterval(sendLocation, 300000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  return null; 
};
 */

import { useEffect } from 'react';

export default function LocationTracker({ id }) {
  useEffect(() => {
    // Função para obter a localização e enviar para a API
    const sendLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Latitude:', latitude, 'Longitude:', longitude, 'user_id:', id);

            try {
              const response = await fetch(`https://imhere-webservice-7a6l.onrender.com/localizacao/${id}`, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                }),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              console.log('Localização enviada com sucesso:', data);
            } catch (error) {
              console.error('Erro ao enviar localização para a API:', error.message);
            }
          },
          (error) => {
            console.error('Erro ao obter localização:', error.message);
          }
        );
      } else {
        console.error('Geolocalização não suportada pelo navegador');
      }
    };

    // Envia a localização imediatamente ao carregar
    sendLocation();

    // Envia a cada 10 minutos (600,000 ms)
    const intervalId = setInterval(sendLocation, 600000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [id]); // Adiciona 'id' como dependência para reagir a mudanças

  return null;
}
