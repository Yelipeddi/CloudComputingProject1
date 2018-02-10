# 3-tier Web Application hosted on AWS

University Name: http://www.sjsu.edu/ 

Course: Cloud Technologies

Professor Sanjay Garje 

ISA: Divyankitha Urs

Student: Abhinaya Yelipeddi

Linkedin Profile: https://www.linkedin.com/in/abhinaya-yelipeddi-1a3073148/

Project Introduction

This project is a web application to upload, update, delete and download existing files. All the files uploaded by the users are stored in S3 bucket. This application is publicly accessible to all the users based on the IAM policy. This application displays the following information about the uploaded files in the website:

•	Upload time
•	Update time,
•	First.Last Name
•	File Name/Description along with link to download

This application also displays the folders created in the S3 bucket, but does not allow to create folders from the website directly. If any files are uploaded to the folder, that event triggers Amazon Lambda function “list_files” and creates an entry in the DynamoDB for all the files which have suffix “txt”. “List files in Folder” button displays all the “txt” files in that folder. 

Feature List
•	Upload File to S3 bucket from website
•	Download File from S3 bucket using website
•	Delete File on S3 bucket using website
•	List File with upload time, First.Last Name, File Name/Description
•	List “.txt” files in folder “Folder” with Lamba and Dynamodb
•	Set Cloudwatch Alarms if the application is in unhealthy state.
•	Enabled transfer acceleration and CloudFront to reduce load at the source
•	Added lifecycle policy to automatically move objects to different storage levels and archives.
•	Enabled EC2 instances and S3 objects across regions to make the application resilent to handle outages.
•	Added two load balancers and enabled Autoscaling to auto recover and rebalance the traffic appropriately.

	Pre-requisites Set Up
  1. Bring up the Web application on EC2 instance and load the javascript files and html files to lauch the web application.
  2. Second way is to load the index.html and upload.js, delete.js, list.js and dynamo.js files into the S3 bucket and enable     static webhosting on the S3 bucket.(globalcontentstore.com)
  3. Enable versioning, transfer acceleration, static web hosting, cross region replication on S3 bucket
  4. Enable CloudFront
  5. Use Amazon Lambda function to index the files with suffix "txt" into DynamoDB 
  6. Enable Cloudwatch Alarms and SNS to get emails if the alarms triggers.
  7. Need to have Eclipse and Developer Tools for Javascript console for debugging
  
  For quick bringup of the web application:
  Load all the html and .js files to the S3 bucket to bring up the web application.
  
  Sample Screenshots
  Attached in the issues section.
  
 
  
  
  
  
