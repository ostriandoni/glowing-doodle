const fs = require("fs");
const xml2js = require("xml2js");
const moment = require("moment");
const arg = process.argv;

if (!(arg && arg[2])) {
  return;
}

const xmlInput = fs.readFileSync(arg[2]);

(async () => {
  try {
    const result = await xml2js.parseStringPromise(xmlInput, {
      mergeAttrs: false,
    });
    const x = arg && arg[3] ? arg[3] : 12;
    const y = arg && arg[4] ? arg[4] : "minutes";
    const metadataTime = moment(result.gpx.metadata[0].time[0])
      .add(x, y)
      .toDate();
    result.gpx.metadata[0].time[0] = metadataTime.toISOString();

    for (let trkpt of result.gpx.trk[0].trkseg[0].trkpt) {
      const newTime = moment(trkpt.time[0], moment.ISO_8601).add(x, y).toDate();
      trkpt.time[0] = newTime.toISOString();
    }

    const builder = new xml2js.Builder();
    const xmlOutput = builder.buildObject(result);
    fs.writeFileSync("result.gpx", xmlOutput);
  } catch (err) {
    console.log(err);
  }
})();
