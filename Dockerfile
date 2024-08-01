# Temel Node.js imajını belirleyin - Node.js v20.16
FROM node:20.16

# Çalışma dizinini ayarlayın
WORKDIR /usr/src/app

# Paket dosyalarını kopyalama
COPY package*.json ./

# Bağımlılıkları yükleyin
RUN npm install

# Proje dosyalarını kopyalayın
COPY . .

# Uygulamanın başlatma komutunu ayarlayın
CMD ["npm", "run", "start"]