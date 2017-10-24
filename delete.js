
// This button once clicked will remove the file mentioned 
// in the text box from the S3 bucket

var delButton = document.getElementById('delete-button');

// Event listener for the delete button click
delButton.addEventListener('click', function() {

  var fileToDel = document.getElementById('delete-file').value;

  // Check to make sure user entered the file to delete
  if (!fileToDel) {
    alert("Type the file name to delete!");
    return;
  }
 
  // Providing credentials to delete
    AWS.config.update({
        "accessKeyId": "AKIAIELA23ITK46BVTCA",
        "secretAccessKey": "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",
        "region": "us-west-1"
    });

// Delete the file from the S3 bucket
    var s3Bucket = new AWS.S3();
    var params = {
        Bucket: 'globalcontentstore.com',
        Key: fileToDel
    };
    s3Bucket.deleteObject(params, function (err, data) {
        if (data) {
            alert("Successfully deleted the file");
        }
        else {
            alert("File delete failed : "+err);
        }
    });
});