
const axios = require('axios');
const readline = require('readline');

async function sendDataToFastAPIAndPrint (API_URL, data,res) {
 try {
  const response = await axios({
   method: 'get',
   url: API_URL,
   responseType: 'stream',
   data: data
  });

  const stream = response.data;

  // Set headers for the response
//   res.setHeader('Content-Type', stream.headers['content-type']);
//   res.setHeader('Content-Length', stream.headers['content-length']);

  // Stream the data to the client
  stream.pipe(res);

  stream.on('data', (chunk) => {
   const decodedChunk = chunk.toString('utf-8');
   //console.log(decodedChunk)
   // Print with a slight delay to simulate typing effect (optional)
   async () => {
    for (let char of decodedChunk) {
     process.stdout.write(char);

    console.log(char);
     await new Promise(resolve => setTimeout(resolve, 1e-10)); // Adjust delay as desired
    }
   };
  });

  stream.on('end', () => {
   console.log('\nStream ended.');
  });

 } catch (error) {
  console.error(`Error sending data: ${error.message}`);
 }
};

// Example usage
// const data = { text: "tell me how to negotiate effectively with an investor" };
// const API_URL = "http://35.232.246.77:8000/send_text";

// sendDataToFastAPIAndPrint(API_URL, data);



module.exports = {
    sendDataToFastAPIAndPrint: sendDataToFastAPIAndPrint,
  };