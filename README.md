# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


To init dev project:

- yarn install
- yarn dev

To build image nginx to deploy project:

- yarn install
- yarn build
- docker build -t "image-name" .

To local run imagen into docker container:

- docker run -p 8081:80 -it "image-name"
