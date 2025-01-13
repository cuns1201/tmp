import Dotenv from 'dotenv-webpack'
 
export default {
  plugins: [
    new Dotenv({
      path: "./some.other.env", // default is .env
    }),
  ],
};