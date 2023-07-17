import { format } from 'date-fns';
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
    const event = {
      start: format(new Date(video.datetime), 'yyyy,MM,dd,HH,mm').split(',').map(Number),
      duration: { hours: 2 }, // we don't know how long. set to 2hr
      title: video.name, // will fill in summery
      description: video.title.replace(/\s/g, ' '), // use replace to make safe string
      url: video.url,
      location: video.platformType === 1 ? 'Youtube' : 'Twitch', 
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




