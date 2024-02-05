import { format, parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { getCollection } from './dbHelper.js';
export function prepareEvents(videoList) {
  const talentsIconCollection = getCollection('talentsIcon');
  return videoList.map(video => {
    let attendees = [{
      name: video.name,
      email: 'talent@hololivepro.com', // Modify as needed
      rsvp: false,
      partstat: 'ACCEPTED',
      role: 'REQ-PARTICIPANT'
    }]; // add streamer as default
    if (video.collaboTalents && video.collaboTalents.length > 0) {
      attendees.concat(video.collaboTalents.map(collaboTalent => {
        let talent = talentsIconCollection.findOne({ iconImageUrl: collaboTalent.iconImageUrl });
        if (talent){
          return {
            name: talent.name,
            email: 'talent@hololivepro.com',
            rsvp: false,
            partstat: 'ACCEPTED',
            role: 'REQ-PARTICIPANT'
          }
        }
      })) ;
    }

    let categories = [];
    const regex = /#[^\s#]+/g;
    categories = video.title.match(regex);
    const platformsCollection = getCollection('platforms');
    const platform = platformsCollection.findOne({ id: video.platformType }) ;

    const zonedDate = parse(video.datetime, 'yyyy/MM/dd HH:mm:ss', new Date());
    const utcDate = zonedTimeToUtc(zonedDate, 'Asia/Tokyo');

    const event = {
      start: format(utcDate, 'yyyy,MM,dd,HH,mm').split(',').map(Number),
      duration: { hours: 2 }, // we don't know how long. set to 2hr
      title: video.name, // will fill in summery
      description: video.title.replace(/\s/g, ' '), // use replace to make safe string
      url: video.url,
      location: platform ? platform.name : ' ',
      attendees: attendees,
      organizer: {
        name: video.name,
        email: 'talent@hololivepro.com' // modify as needed
      }
    };
    if (categories){
      event.categories = categories.map(category => category.slice(1)); // remove '#' prefix;
    }
    return event;
  });
}




