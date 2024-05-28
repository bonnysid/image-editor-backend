FROM node:18

# Установка зависимостей
RUN apt-get update && apt-get install -y python3 python3-pip build-essential cmake git

# Установка OpenCV
RUN git clone https://github.com/opencv/opencv.git && \
    cd opencv && \
    mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc) && \
    make install

# Установка необходимых глобальных пакетов Node.js
RUN npm install -g nodemon

# Копирование файлов проекта
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Запуск приложения
CMD ["nodemon", "src/index.ts"]
