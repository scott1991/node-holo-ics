import fetchData from './fetchData.js';
import { prepareEvents } from './prepareEvents.js';
import { updateTalentsIcon, saveDB } from './dbHelper.js';
import ics from 'ics';

async function getIcs(channel) {

  try {
    const data = await fetchData(channel);
    // updateTalentsIcon(data);
    const data0 = data.dateGroupList[0].videoList;
    const data1 = data.dateGroupList[1].videoList;
    const data2 = data.dateGroupList[2].videoList;
    updateTalentsIcon(data0);
    updateTalentsIcon(data1);
    updateTalentsIcon(data2);
    saveDB();
    const preparedEvent0 = prepareEvents(data0);
    const preparedEvent1 = prepareEvents(data1);
    const preparedEvent2 = prepareEvents(data2);
    let allEvents = preparedEvent0.concat(preparedEvent1, preparedEvent2);
    return processData(allEvents);
  } catch (error) {
    throw error;
  }

}

function processData(allEvents) {
  const { error, value } = ics.createEvents(allEvents);
  if (error) {
    //throw error.inner[0];
    throw error;
  }
  return value;
}

export default getIcs;