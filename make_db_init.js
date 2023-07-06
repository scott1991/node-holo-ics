import Loki from 'lokijs';
import fs from 'fs'


var db = new Loki('db.lokidb',{
  autoload: true,
  autoloadCallback : databaseInitialize,
});


function databaseInitialize() {
  collectionInitialize("talentsIcon") ;
  collectionInitialize("platforms").insert( [{ "0": "Twitch" },{ "1": "Youtube" }]);
  // kick off any program logic or start listening to external events
  runProgramLogic();
}

function collectionInitialize(name, propObj) {
  var entries = db.getCollection(name);
  if (entries === null) {
    entries = db.addCollection(name, propObj);
  }
  return entries ;
}


function runProgramLogic() {
  // Use fs to read '1.json' and parse it
  fs.readFile('1.json', 'utf8', function (err, data) { // 1.json from https://schedule.hololive.tv/api/list/1
    if (err) {
      return console.log(err);
    }

    let json = JSON.parse(data);

    // Get the 'talentsIcon' collection to add or update data
    let talentsIconCollection = db.getCollection('talentsIcon');

    json['dateGroupList'].forEach(element => {
      let videoList = element['videoList'];

      // Iterate through videoList and add or update name and talent.iconImageUrl to the talentsIcon collection
      videoList.forEach(video => {
        let existingEntry = talentsIconCollection.findOne({ name: video.name });

        if (existingEntry) {
          // Update the existing entry
          if (existingEntry.iconImageUrl !== video.talent.iconImageUrl){
            existingEntry.iconImageUrl = video.talent.iconImageUrl;
            talentsIconCollection.update(existingEntry);
            console.log("updated",video.name)
          }
          
        } else {
          // Insert a new entry
          talentsIconCollection.insert({
            name: video.name,
            iconImageUrl: video.talent.iconImageUrl
          });
          console.log("inserted",video.name)
        }
      });

    });

    // Save the database
    db.saveDatabase(err => {
      if (err) {
        console.log('Database save failed: ' + err);
      } else {
        console.log('Database saved.');
      }
    });

  });
}

