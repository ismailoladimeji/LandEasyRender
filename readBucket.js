const {Storage}=require ("@google-cloud/storage")
var env =require('dotenv').config();
const bucketName = 'storage-awarri_llm';
const fs = require('fs');

// Specify the path to the JSON file
const filePath = 'data.json';
var cat= [];
const secretKey = process.env.SECRET_KEY;
// Read the JSON file


async function readBucket(bucketName, filename){
 const storage = new Storage({
    keyFilename:secretKey, // Path to your service account key file
  });
  var Context=null
try{
const bucket = storage.bucket(bucketName);
 
const folders = new Set();
const [Files]=await bucket.getFiles();

Files.forEach(file => {
   // const parts = file.name.split('/');
   // if (parts.length > 1) {
      // Extract folder name
      //folders.add(parts[0]);
   // }
   folders.add(file.name);
  });

console.log('Folders in the bucket:', Array.from(folders));
console.log("Bucket Found")
//Download the file as a bufferconst 
   
 Files.forEach(async p=>{
  if(p.name.toString()==filename){
    const [fileContent] = await p.download(); 
    Context=fileContent.toString()
    console.log(p.name,filename)
    console.log('File content:',Context);
    return Context?Context:[]
  }

 })
 console.log('File content:',Context);
 return Context?Context:[]
 //return Files?Files:""

}catch (parseError) {
  console.error('Error parsing JSON data:', parseError);
  return   Context?Context:[]
}

}

const FilesArr=[
  'Evaluations',
  'Evaluations/',
  'Evaluations/object_1714930902691.json',
  'QA_ranking.json',
  'Ranking/',
  'evaluation.json',
  'ranking.json'
]
readBucket(bucketName,FilesArr[0])

async function readCategory(bucketName, filename,res){
  const storage = new Storage({
    keyFilename:secretKey, // Path to your service account key file
  });
  var Context=null
try{
const bucket = storage.bucket(bucketName);
const [Files]=await bucket.getFiles();

 Files.forEach(async p=>{
  if(p.name.toString()==filename){
    const [fileContent] = await p.download(); 
    Context=fileContent.toString()
    console.log(p.name,filename)
    var datt=[];
     JSON.parse(Context).map(v=>datt.push(v["category"]))
    console.log(datt)
    // return datt
    return res.json({ status: 'success', message: 'API call successful--',data: datt});
  }
  return []

 })


}catch (parseError) {
  console.error('Error parsing JSON data:', parseError);
  return  []
}
}

async function readQuestion(bucketName, filename, category, arr,res){
  const storage = new Storage({
    keyFilename:secretKey, // Path to your service account key file
  });
  var Context=null;
  
try{
const bucket = storage.bucket(bucketName);
const [Files]=await bucket.getFiles();

 Files.forEach(async p=>{
  if(p.name.toString()==filename){
    const [fileContent] = await p.download(); 
    Context=fileContent.toString()
    console.log(p.name,filename,category)
    var datt=  JSON.parse(Context).find(v=>v["category"]==category)?.questions
    console.log(datt)
    return res.json({ status: 'success', message: 'API call successful--',data: datt});
    //return datt;
  }
  return []
 })


}catch (parseError) {
  console.error('Error parsing JSON data:', parseError);
  return  []
}
}
// readBucket(bucketName,FilesArr[3])
// readCategory(bucketName,FilesArr[3])
//readQuestion(bucketName,FilesArr[3],"Mathematics",[])

async function uploadFile(bucketName, filePath, destinationFileName) {
    const storage = new Storage({
        keyFilename:secretKey, // Path to your service account key file
      });
      const bucket = await storage.bucket(bucketName)
      let existingData 
      const exists= doesFileExist(bucketName, destinationFileName)
      .then(async (exists) => {
        try {
          if (exists){
            console.log("wrong...............entered")
           const file = await bucket.file(destinationFileName);
            const [file1] = await file.download();
             // Parse the existing JSON data
             existingData=file1
            console.log("existing data....."+existingData)//,existingData.length,!existingData)
            if(existingData&&existingData.length>=0){
              existingData =  JSON.parse(file1.toString());
             // Add new data to the existing JSON array
             existingData.push(filePath);
            }
             else
            existingData=[]
            console.log("ene data....."+JSON.stringify(existingData))
              // Convert the modified data back to JSON string
          const modifiedJson = JSON.stringify(existingData);
           await file.save(modifiedJson);
          
          console.log(`File saved in bucket ${bucketName} Succesfully.`);
        } else {
          console.log("file not exist")
        var upload='';
        if(destinationFileName=="Ranking/"){
          upload="ranking.json";
        }else{
          upload="evaluation.json";
        }
    console.log(upload)
      const file =bucket.file(upload);
  try{
    await file.save(JSON.stringify(filePath));
    console.log(`File has been uploaded`);
  }catch(er){
    console.log(`Failed to upload`);
  }
     
        }
        } catch (err) {
          console.error('Error creating file:', err);
        }
   
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }

  
async function doesFileExist(bucketName, fileName) {
  try {
    const storage = new Storage({
      keyFilename:secretKey, // Path to your service account key file
    });
    // Get a reference to the bucket
    const bucket = storage.bucket(bucketName);

    // Get a reference to the file
    const file = bucket.file(fileName);

    // Check if the file exists
    const [exists] = await file.exists();

    return exists;
  } catch (err) {
    console.error('Error checking file existence:', err);
    return false;
  }
}
//   Example usage
// const g =
//   {
//     "system prompt": "Your a helpful assistant,Your task is to manage customer querry information. provide as accurate information as possible",
//     "question prompt": "Hello assistant, my name is John, I am having trouble purchasing my flight, what might bethe problem?",
//     "assistant response": [
//         "Hello John, sorry that your facing such problem, could you confirm if your network is active?",
//         "Hey John, check your internet connection to see if it is working, and let me know."
//     ],
//     "ranks": [
//         5,
//         2
//     ],
//     "alternative response": "None",
//     "domain topic": "assistance"
// }

// const h={
//   "system prompt": "Your a helpful assistant, Your task is to manage customer querry information. provide as accurate information as possible.",
//   "question prompt": "Hello assistant, my name is. John,I am having trouble purchasing my flight, what might be the problem?",
//   "assistant response": "Hello John, sorry that your facing such problem, could you confirm if your network is active?",
//   "setadata": {
//       "Age": 23,
//       "source": "wikipedia link",
//       "location": "location"
//   },
//   "metrics": {
//       "toxicity": "non toxic",
//       "truthfulness": "high",
//       "coherrence": "high",
//       "fairness": 10,
//       "hallucination": 0,
//       "relevance": 10,
//       "safety": "completely safer"
//   },
//   "domain tople": "assistance"
// }
//uploadFile(bucketName, h, 'Evaluations');
//uploadFile(bucketName, g, 'Ranking/');
//uploadFile(bucketName, 'evaluation.json', 'Evaluations');


module.exports = {
    uploadFile: uploadFile,
    readQuestion:readQuestion,
    readCategory:readCategory,
    cat:cat
  };


  // fs.readFile("evaluation.json", 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Error reading JSON file:', err);
  //     return;
  //   }
  
  //   try {
  //     // Parse the JSON data
  //     const jsonData = JSON.parse(data);
  //   } catch (parseError) {
  //     console.error('Error parsing JSON data:', parseError);
  //   }
  // });