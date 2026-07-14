#Builder
FROM node:22-alpine AS builder

#Working directory
WORKDIR /app

#Copy packages
COPY package.json package-lock.json ./

#Install packages
RUN npm install

#Copy all files
COPY . . 

#Run build
RUN npm run build


#Runner
FROM node:22-alpine as runner

# Working directory
WORKDIR /app

#ENV Production
ENV NODE_ENV=production

#Copy the necessary files
COPY --from=builder /app/.next/standalone /.
COPY --from=builder /app/.next/static ./.next/static

#Expose port
EXPOSE 3000


#Command to run the app
CMD ["node","server.js"]
