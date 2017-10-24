

jQuery(function($) { retrieveS3Files(); });


function retrieveS3Files(marker, html) {
  var s3_link = createQuerylink(marker);
  // When the data is loading, we can display the ajax loading circle
  $('#listing')
      .html('<img src="//assets.okfn.org/images/icons/ajaxload-circle.gif" />');
  $.get(s3_link)
      .done(function(data) {
        // Once the data is loaded, we can clear the loading circle symbol
        $('#listing').html('');
        var xml_info = $(data);
        var info = getS3Data(xml_info);

        html = typeof html !== 'undefined' ? html + createTable(info) :
                                             createTable(info);
        if (info.nextMarker != "null") {
          retrieveS3Files(info.nextMarker, html);
        } else {
          document.getElementById('listing').innerHTML =
              '<pre>' + html + '</pre>';
        }
      })
      .fail(function(error) {
        console.error(error);
        $('#listing').html('<strong>Error: ' + error + '</strong>');
      });
}



function createQuerylink(marker) {
  var s3_link = BKT_URL;
  s3_link += '?delimiter=/';

 
  var rt = '.*[?&]prefix=' + S3_ROOT_DIR + '([^&]+)(&.*)?$';
  var prefix = '';
  if (S3_IGNR_PATH == false) {
    var prefix = location.pathname.replace(/^\//, S3_ROOT_DIR);
  }
  var match = location.search.match(rt);
  if (match) {
    prefix = S3_ROOT_DIR + match[1];
  } else {
    if (S3_IGNR_PATH) {
      var prefix = S3_ROOT_DIR;
    }
  }
  if (prefix) {
    // make sure we end in /
    var prefix = prefix.replace(/\/$/, '') + '/';
    s3_link += '&prefix=' + prefix;
  }
  if (marker) {
    s3_link += '&marker=' + marker;
  }
  return s3_link;
}

function getS3Data(xml_info) {
  var files = $.map(xml_info.find('Contents'), function(item) {
    item = $(item);
    // clang-format off
    return {
      Key: item.find('Key').text(),
          UploadTime: item.find('LastModified').text(),
          DisplayName: item.find('DisplayName').text(),
          LastModified: item.find('LastModified').text(),
          Type: 'file'
    }
    // if clang format is on
  });
  var directories = $.map(xml_info.find('CommonPrefixes'), function(item) {
    item = $(item);
    // clang-format off
    return {
      Key: item.find('Prefix').text(),
        UploadTime: '',
        DisplayName: 'abhi.yelipeddi',
        LastModified: '',
        Type: 'directory'
    }
    // if clang format is on
  });
  if ($(xml_info.find('IsTruncated')[0]).text() == 'true') {
    var nextMarker = $(xml_info.find('NextMarker')[0]).text();
  } else {
    var nextMarker = null;
  }
  // if clang format is off
  return {
    files: files,
    directories: directories,
    prefix: $(xml_info.find('Prefix')[0]).text(),
    nextMarker: encodeURIComponent(nextMarker)
  }
  // if clang format is on
}

function createTable(info) {
  var files = info.directories.concat(info.files), prefix = info.prefix;
  var cols = [15, 15, 15, 15];
  var content = [];

  content.push(addPadding('Upload Time', cols[1]) + '  ' +
               addPadding('First.Last Name', cols[2])+ '  ' + addPadding('Update Time', cols[3]) + 'Description \n');
              
  content.push(new Array(cols[0] + cols[1] + cols[2] + cols[3] + 4).join('*') + '\n');

  // if there are directories to be displayed
  // add ../ at the start of the directory listing
  if (prefix && prefix !== S3_ROOT_DIR) {
    var up = prefix.replace(/\/$/, '').split('/').slice(0, -1).concat('').join(
            '/'),  // one directory up
        item =
            {
              Key: up,
              UploadTime: '',
              DisplayName: '',
              LastModified: '',
              keyText: '../',
              href: S3_IGNR_PATH ? '?prefix=' + up : '../'
            },
        row = displayRow(item, cols);
    content.push(row + '\n');
  }

//This is the query function to query 
// each file and display it in a row

  jQuery.each(files, function(idx, item) {
    // strip off the prefix
    item.keyText = item.Key.substring(prefix.length);
    if (item.Type === 'directory') {
      if (S3_IGNR_PATH) {
        item.href = location.protocol + '//' + location.hostname +
                    location.pathname + '?prefix=' + item.Key;
      } else {
        item.href = item.keyText;
      }
    } else {
      item.href = BKT_WEB_URL + '/' + encodeURIComponent(item.Key);
      item.href = item.href.replace(/%2F/g, '/');
    }
    var row = displayRow(item, cols);
    if (typeof NO_SHOW_FILE == 'undefined' || NO_SHOW_FILE != item.Key)
      content.push(row + '\n');
  });

  return content.join('');
}

// This function displays the upload time,
// first name and last name and updated time, description
// and link to download the file
function displayRow(item, cols) {
  var row_item = '';
  row_item += addPadding(item.UploadTime, cols[1]) + '  ';
  row_item += addPadding(item.DisplayName, cols[2]);
  row_item += addPadding(item.LastModified, cols[3]);
  row_item += '<a href="' + item.href + '">' + item.keyText + '</a>';
  return row_item;
}


// this function adds padding to display 
// information within the column.
// If the information is exceeds the column limit
// we append 3 dots 
function addPadding(strToPad, len) {
  var string = strToPad.slice(0, len - 3);
  if (strToPad.length > string.length) {
    string += '...';
  }
  while (string.length < len) {
    string = string + ' ';
  }
  return string;
}

