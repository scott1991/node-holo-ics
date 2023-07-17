import Loki from 'lokijs';

let db = null;

export function databaseInitialize() {
  return new Promise((resolve, reject) => {
    try {
      db = new Loki('db.lokidb', {
        autoload: true,
        autoloadCallback: function() {
          resolve(db);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getCollection(collectionName) {
  return db.getCollection(collectionName);
}

export function updateTalentsIcon(videoList) {
  let talentsIconCollection = db.getCollection('talentsIcon');

  // Iterate through videoList and add or update name and talent.iconImageUrl to the talentsIcon collection
  videoList.forEach(video => {
    let existingEntry = talentsIconCollection.findOne({ name: video.name });

    if (existingEntry) {
      // Update the existing entry
      if (existingEntry.iconImageUrl !== video.talent.iconImageUrl) {
        existingEntry.iconImageUrl = video.talent.iconImageUrl;
        talentsIconCollection.update(existingEntry);
        console.log("updated", video.name)
      }

    } else {
      // Insert a new entry
      talentsIconCollection.insert({
        name: video.name,
        iconImageUrl: video.talent.iconImageUrl
      });
      console.log("inserted", video.name)
    }
  });
}

export function saveDB(){
  db.saveDatabase(err => {
    if (err) {
      throw err;
    } else {
      console.log('Database saved.');
    }
  });
}
