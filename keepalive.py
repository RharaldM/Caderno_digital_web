import requests
import time
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def keep_alive(url, interval=600):  # 600 segundos = 10 minutos
    while True:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                logger.info('Ping bem-sucedido')
            else:
                logger.warning(f'Resposta não OK: {response.status_code}')
        except Exception as e:
            logger.error(f'Erro ao fazer ping: {str(e)}')
        
        time.sleep(interval)

if __name__ == '__main__':
    URL = 'https://caderno-digital-web.onrender.com/'
    logger.info('Iniciando keep-alive...')
    keep_alive(URL)