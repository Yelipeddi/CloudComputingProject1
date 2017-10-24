// Provide Amazon access credentials

AWS.config.update({
    "accessKeyId": "*******",
    "secretAccessKey": "************",
    "region": "us-west-1"
 });

var dynDB = new AWS.DynamoDB.DocumentClient({region: 'us-west-1'});

// Getting button reference to list the files in the folder
var dbButton = document.getElementById('list-Dynamo');


// After the click, fetch the files from folder abhinaya_folder 
// and list them 
dbButton.addEventListener('click', function() {
   
   var folderName = 'abhinaya_folder';
 
  // disable the button so that we cannot do mutilple file fetching at once.
  dbButton.disabled = true;

  // Once all the files under the folder have been fetched
  // enable the button again
  listFilesInDynamo(folderName, function(err) {
    if (err) {
      alert("Dynamo error: " + err);
    }
    dbButton.disabled = false;
  });
})

// Fetch all images in the given gallery.
// `startKey` represents the exclusive start key of the Dynamo query.
// To start a new query, leave `startKey` undefined.
// This function recursively calls itself until there are no more query pages,
// and then runs the callback.
function listFilesInDynamo(folderName, cb, startKey) {
  var params = {
    TableName: 'globalcontenttable',
    KeyConditionExpression: 'folder = :foldname',
    ExpressionAttributeValues: {
      ":foldname": folderName
    },
    ExclusiveStartKey: startKey,
  }

  dynDB.query(params, function (err, data) {
    if (err) {
      return cb(err);
    }

    for (item of data.Items) {
      appendFileToList(item.file_key);
    }

    if (data.LastEvaluatedKey) {
    // if LastEvaluatedKey is set, it means there are more files
    // to fetch, so we call the listFilesinDynamo recursively
      return listFilesinDynamo(folderName, cb, data.LastEvaluatedKey);
    } else {
      return cb(null);
    }
  })
}

// Append file to the end of the list
function appendFileToList(filePath) {
  var ul = document.getElementById('file-list');
  var li = document.createElement('li');
  var files = document.createElement('files');

  files.src = 'https://s3-us-west-1.amazonaws.com/globalcontentstore.com/' + filePath

  li.appendChild(files);
  ul.appendChild(li);
}

