var APiStatus = 'http://35.232.246.77:8000/';
var SearchQueryendpoint = 'http://35.232.246.77:8000/send_text';
var storage = new Storage({
  keyFilename: './dataStorage/gpc.json', // Path to your service account key file
});
var destination = './destination/file.json';
var folderName = 'langEasy';  // Optional: Folder within the bucketconst 
var ranking = 'ranking.json'; // Filename with .json extension
var evaluation = 'evaluation.json'; // Filename with .json extension
var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

var bucketName = 'storage_awarri_llm';
async function updateFileWithJson(jsonData, type) {
  // Combine folder and filename to create the file pathconst 
  const filePath1 = this.folderName ? `${this.folderName}/${this.ranking}` : this.ranking;
  const filePath2 = this.folderName ? `${this.folderName}/${this.evaluation}` : this.evaluation;
  const bucket = this.storage.bucket(this.bucketName); 
  const filePath = type =="rating"?filePath1 :filePath2 
  const file = bucket.file(filePath); 
  try {     
    await file.save(JSON.stringify(jsonData)); // Convert JSON data to string and save directly to the file
    console.log('File updated successfully');
    return "success"
  }
  catch (error) {
    console.error('Error updating file:', error);
    return "error"
  }
}