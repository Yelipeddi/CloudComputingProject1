        var chooseFile = document.getElementById('file-chooser');
        var upButton = document.getElementById('upload-button');
        var results = document.getElementById('results');
        upButton.addEventListener('click', function () {
            var file = chooseFile.files[0];
            if (file) {            
                AWS.config.update({
                    "accessKeyId": "**********",
                    "secretAccessKey": "**********",
                    "region": "us-west-1"
                });
                var s3Bucket = new AWS.S3();
                var params = {
                    Bucket: 'globalcontentstore.com',
                    Key: file.name,
                    ContentType: file.type,
                    Body: file,
                    ACL: 'public-read'
                };        
                s3Bucket.putObject(params, function (err, res) {
                    if (err) {
                        results.innerHTML = ("Upload file error: ", err);
                    } else {
                        results.innerHTML = ("File upload successful");
                    }
                });
            } else {
                results.innerHTML = 'Choose file to upload.';
            }
        }, false);
